/*
 * MIT License
 * Moving one device from its device template to the configuration group converted from it, with its values, in
 * steps a person approves one at a time (deploy_template_migration):
 *
 *   prepare              plans the device's values from its template and checks them against the groups' schemas;
 *                        saves its running config; detaches the template (the running config stays); associates the
 *                        configuration group, and the policy group of the same name when there is one (the
 *                        template-to-group conversion puts SIG there); sets the values; returns the review of what
 *                        the deploy would change. Nothing is pushed to the device.
 *   deploy               pushes the configuration group, refusing when the review drops or changes settings and they
 *                        were not accepted, and, for a device with SIG, unless the SIG provider's credentials are
 *                        confirmed: vManage deploys a policy group only on a device that runs its configuration
 *                        group, so the device has no SIG tunnels until step deploy_policy_group.
 *   status               the device's health: vSmart control connections, and BFD sessions up against before.
 *   deploy_policy_group  checks that the policy group configures every SIG setting the device ran before, then
 *                        pushes it.
 *
 * Every change goes through the server's write path (VMANAGE_ALLOW_WRITE=true and confirm: true).
 */

import { maskLine, missingLines, RESALTED, reviewConfig, SIG_LINES, type ConfigReview } from './configReview.js';
import { AAA_PASSWORD_PLACEHOLDER, mapValues, parseSchema, rowsFromInput, shownPlan, type MappingReport, type Value } from './configVariables.js';

// A hash that may only be re-salted is not a change the user has to accept.
const needsAcceptance = (review: ConfigReview) => [
  ...review.dropped,
  ...review.changed,
  ...review.secretsChanged.filter((s) => !s.endsWith(RESALTED)),
];

export interface Group {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface Device {
  uuid: string;
  systemIp: string;
  hostName: string;
}

export interface MigrationDeps {
  get<T = any>(path: string, query?: Record<string, string>): Promise<T>;
  /** A POST that only builds data (template device input, deploy preview). */
  readPost<T = any>(path: string, body: unknown): Promise<T>;
  /** A change, through the server's write path. */
  write(method: 'POST' | 'PUT', path: string, body: unknown): Promise<any>;
  listGroups(kind: 'config-group' | 'policy-group'): Promise<Group[]>;
  findGroup(kind: 'config-group' | 'policy-group', ref: unknown): Promise<Group>;
  device(ref: string): Promise<Device>;
  sleep(ms: number): Promise<void>;
}

export interface DevicePlan {
  deviceId: string;
  values: Record<string, Value>;
  report: MappingReport;
  policyGroupValues?: Record<string, Value>;
  policyGroupReport?: MappingReport;
}

/** The value plans of a device template's attached devices, for its configuration group and the policy group of the
 *  same name. Read-only. */
export async function planTemplate(deps: MigrationDeps, templateRef: string, groupRef?: unknown) {
  const ref = templateRef.trim();
  if (!ref) throw new Error('template is required (device template ID or name)');
  const [templates, policyGroups] = await Promise.all([
    deps.get<{ data?: Array<{ templateId: string; templateName: string }> }>('/dataservice/template/device').then((b) => b.data ?? []),
    deps.listGroups('policy-group'),
  ]);
  const template = templates.find((t) => t.templateId === ref || t.templateName.toLowerCase() === ref.toLowerCase());
  if (!template) throw new Error(`No device template "${ref}"`);
  const group = await deps.findGroup('config-group', groupRef ?? template.templateName);
  const policyGroup = policyGroups.find((g) => g.name === group.name);
  const schema = async (kind: string, id: string) => {
    const body = await deps.get(`/dataservice/v1/${kind}/${encodeURIComponent(id)}/device/variables/schema`);
    return parseSchema(Array.isArray(body) ? body : [body]);
  };
  const [attached, spec, policySpec] = await Promise.all([
    deps.get<{ data?: Array<{ uuid: string }> }>(`/dataservice/template/device/config/attached/${encodeURIComponent(template.templateId)}`).then((b) => b.data ?? []),
    schema('config-group', group.id),
    policyGroup ? schema('policy-group', policyGroup.id) : undefined,
  ]);
  const devices: Record<string, DevicePlan> = {};
  if (attached.length) {
    // Read-only: builds the template's device input; it does not attach or push anything.
    const input = await deps.readPost('/dataservice/template/device/config/input/', {
      templateId: template.templateId,
      deviceIds: attached.map((d) => d.uuid),
      isEdited: false,
      isMasterEdited: false,
    });
    for (const [host, row] of Object.entries(rowsFromInput(template.templateName, input))) {
      const planned = mapValues(spec, row);
      if (!policySpec) {
        devices[host] = { deviceId: row.deviceId, ...planned };
        continue;
      }
      const policy = mapValues(policySpec, row);
      planned.report.unused = planned.report.unused.filter((name) => policy.report.unused.includes(name));
      devices[host] = { deviceId: row.deviceId, ...planned, policyGroupValues: policy.values, policyGroupReport: policy.report };
    }
  }
  return { template, group, policyGroup, devices, spec, policySpec };
}

export interface MigrationState {
  configGroup: Group;
  policyGroup?: Group;
  before: string; // the running config from before the migration, kept in memory only
  bfdBefore: number;
}

const variablesOf = (values: Record<string, Value>, password: string | undefined) =>
  Object.entries(values)
    .filter(([, value]) => value !== null)
    .map(([name, value]) => ({ name, value: value === AAA_PASSWORD_PLACEHOLDER ? password : value }));

export class TemplateMigration {
  /** `state` outlives each call (the server keeps it); `deps` carry the call's write approval. */
  constructor(
    private readonly deps: MigrationDeps,
    private readonly state: Map<string, MigrationState>
  ) {}

  async prepare(args: { device: string; template: string; config_group?: unknown }) {
    const device = await this.deps.device(args.device);
    const plan = await planTemplate(this.deps, args.template, args.config_group);
    const planned = Object.values(plan.devices).find((d) => d.deviceId === device.uuid);
    if (!planned) throw new Error(`${device.hostName} is not attached to device template ${plan.template.templateName}`);
    const problems = [...planned.report.missing.map((n) => `${n}: no value`), ...planned.report.invalid,
      ...(planned.policyGroupReport?.missing ?? []).map((n) => `${n} (policy group): no value`), ...(planned.policyGroupReport?.invalid ?? [])];
    if (problems.length) {
      throw new Error(`${device.hostName}: the planned values are incomplete, nothing was changed: ${problems.join('; ')}. See plan_config_group_variables.`);
    }
    const password = process.env.VMANAGE_MIGRATION_AAA_PASSWORD;
    if (Object.values(planned.values).includes(AAA_PASSWORD_PLACEHOLDER) && !password) {
      throw new Error(`${device.hostName}: the group configures the AAA user password; set VMANAGE_MIGRATION_AAA_PASSWORD on the server. Nothing was changed.`);
    }
    const [before, { bfdUp: bfdBefore }] = await Promise.all([this.runningConfig(device), this.health(device)]);
    this.state.set(device.uuid, { configGroup: plan.group, policyGroup: plan.policyGroup, before, bfdBefore });

    const steps: string[] = [];
    try {
      const detach = await this.deps.write('POST', '/dataservice/template/config/device/mode/cli', {
        deviceType: 'vedge',
        devices: [{ deviceId: device.uuid, deviceIP: device.systemIp }],
      });
      const detached = await this.waitTask(taskId(detach), 180, `detach ${plan.template.templateName} from ${device.hostName}`);
      // Associating a group while the template is still attached would fail or leave both in place.
      if (detached.status === 'in progress') {
        throw new Error(`detaching ${plan.template.templateName} is still running (task ${detached.taskId}); run step "prepare" again once it is done`);
      }
      steps.push(`detached device template ${plan.template.templateName} (the running config stays)`);
      for (const [kind, group, values] of [
        ['config-group', plan.group, planned.values],
        ...(plan.policyGroup && planned.policyGroupValues ? [['policy-group', plan.policyGroup, planned.policyGroupValues]] : []),
      ] as Array<['config-group' | 'policy-group', Group, Record<string, Value>]>) {
        const path = `/dataservice/v1/${kind}/${encodeURIComponent(group.id)}/device`;
        await this.deps.write('PUT', `${path}/associate`, { devices: [{ id: device.uuid }] });
        steps.push(`associated ${kind.replace('-', ' ')} ${group.name}`);
        await this.deps.write('PUT', `${path}/variables`, {
          solution: 'sdwan',
          devices: [{ 'device-id': device.uuid, variables: variablesOf(values, password) }],
        });
        steps[steps.length - 1] += ` and set its ${Object.keys(values).length} values`;
      }
    } catch (error) {
      const done = steps.length ? `Done before the failure: ${steps.join('; ')}.` : 'Nothing was changed.';
      throw new Error(`${device.hostName}: prepare failed: ${(error as Error).message}. ${done} Nothing was pushed to the device.${steps.length ? ' To undo, remove the device from its groups and re-attach its template.' : ''}`);
    }
    const review = await this.review(device, plan.group, plan.policyGroup);
    const toAccept = needsAcceptance(review);
    return {
      step: 'prepared',
      device: device.hostName,
      configGroup: plan.group.name,
      policyGroup: plan.policyGroup?.name,
      done: steps,
      review,
      next: `Nothing was pushed to the device. Go through the review with the user. Then call step "deploy"${toAccept.length ? ' with accept_review: true once the user accepts the dropped and changed settings and secrets' : ''}${plan.policyGroup ? ', and sig_ready: true once the user confirms the SIG provider credentials are set in vManage' : ''}. To undo instead, remove the device from its groups and re-attach its template.`,
    };
  }

  async deploy(args: { device: string; config_group?: unknown; accept_review?: boolean; sig_ready?: boolean; wait_seconds?: number }) {
    const device = await this.deps.device(args.device);
    const state = await this.stateOf(device, args.config_group);
    const review = await this.review(device, state.configGroup, state.policyGroup);
    const toAccept = needsAcceptance(review);
    if (toAccept.length && args.accept_review !== true) {
      const secrets = toAccept.length - review.summary.dropped - review.summary.changed;
      throw new Error(`${device.hostName}: deploying ${state.configGroup.name} would drop ${review.summary.dropped} and change ${review.summary.changed} settings${secrets ? ` and ${secrets} secrets` : ''}: ${toAccept.slice(0, 20).join('; ')}. Nothing was deployed. Fix the group, or call again with accept_review: true once the user accepts them.`);
    }
    if (state.policyGroup && args.sig_ready !== true) {
      throw new Error(`${device.hostName} has SIG, in policy group ${state.policyGroup.name}: from this deploy until step deploy_policy_group, it has no SIG tunnels, and that step needs the SIG provider's credentials in vManage (the conversion does not carry them). Call again with sig_ready: true once the user confirms they are set. Nothing was deployed.`);
    }
    const task = await this.deps.write('POST', `/dataservice/v1/config-group/${encodeURIComponent(state.configGroup.id)}/device/deploy`, { devices: [{ id: device.uuid }] });
    const outcome = await this.waitTask(taskId(task), args.wait_seconds ?? 240, `deploy ${state.configGroup.name} to ${device.hostName}`);
    return {
      step: 'deployed',
      device: device.hostName,
      configGroup: state.configGroup.name,
      task: outcome,
      health: await this.healthReport(device, state),
      next: `Call step "status" until healthy is true${state.policyGroup ? ', then step "deploy_policy_group": the device has no SIG tunnels until then' : ''}.`,
    };
  }

  async status(args: { device: string; config_group?: unknown }) {
    const device = await this.deps.device(args.device);
    const state = await this.stateOf(device, args.config_group);
    return { step: 'status', device: device.hostName, health: await this.healthReport(device, state) };
  }

  async deployPolicyGroup(args: { device: string; config_group?: unknown; accept_review?: boolean; wait_seconds?: number }) {
    const device = await this.deps.device(args.device);
    const state = await this.stateOf(device, args.config_group);
    if (!state.policyGroup) throw new Error(`${device.hostName}: ${state.configGroup.name} has no policy group of its name; there is nothing to deploy`);
    const path = `/dataservice/v1/policy-group/${encodeURIComponent(state.policyGroup.id)}`;
    const preview = await this.deps.readPost<{ existingConfig?: string; newConfig?: string }>(`${path}/device/${encodeURIComponent(device.uuid)}/preview`, {});
    const lost = missingLines(state.before, preview.newConfig ?? '', SIG_LINES);
    if (lost.length && args.accept_review !== true) {
      throw new Error(`${device.hostName}: policy group ${state.policyGroup.name} does not configure ${lost.length} SIG settings the device ran before: ${lost.slice(0, 20).join('; ')}. The device runs without its SIG tunnels until it is deployed. Fix the policy group, or call again with accept_review: true once the user accepts them.`);
    }
    const task = await this.deps.write('POST', `${path}/device/deploy`, { devices: [{ id: device.uuid }] });
    const outcome = await this.waitTask(taskId(task), args.wait_seconds ?? 240, `deploy ${state.policyGroup.name} to ${device.hostName}`);
    return {
      step: 'policy group deployed',
      device: device.hostName,
      policyGroup: state.policyGroup.name,
      notConfiguredFromBefore: lost,
      task: outcome,
      health: await this.healthReport(device, state),
      next: 'Call step "status" until healthy is true, and check the SIG tunnels on the device (show sdwan secure-internet-gateway tunnels).',
    };
  }

  /** The state saved by prepare, or, after a server restart, rebuilt from vManage (the running config then stands
   *  for "before", which holds while the configuration group is not deployed). */
  private async stateOf(device: Device, groupRef: unknown): Promise<MigrationState> {
    const saved = this.state.get(device.uuid);
    if (saved) return saved;
    if (groupRef === undefined) throw new Error(`${device.hostName}: no migration prepared in this server session; pass config_group, or run step "prepare"`);
    const configGroup = await this.deps.findGroup('config-group', groupRef);
    const policyGroup = (await this.deps.listGroups('policy-group')).find((g) => g.name === configGroup.name);
    const state = { configGroup, policyGroup, before: '', bfdBefore: 0 };
    [state.before, { bfdUp: state.bfdBefore }] = await Promise.all([this.runningConfig(device), this.health(device)]);
    this.state.set(device.uuid, state);
    return state;
  }

  private async review(device: Device, group: Group, policyGroup?: Group): Promise<ConfigReview & { summary: Record<string, number> }> {
    const preview = await this.deps.readPost<{ existingConfig?: string; newConfig?: string }>(
      `/dataservice/v1/config-group/${encodeURIComponent(group.id)}/device/${encodeURIComponent(device.uuid)}/preview`,
      {}
    );
    const review = reviewConfig(preview.existingConfig ?? '', preview.newConfig ?? '', policyGroup ? SIG_LINES : undefined);
    return { summary: Object.fromEntries(Object.entries(review).map(([k, v]) => [k, v.length])), ...review };
  }

  private async runningConfig(device: Device): Promise<string> {
    const body = await this.deps.get<unknown>('/dataservice/device/config', { deviceId: device.systemIp });
    return typeof body === 'string' ? body : '';
  }

  private async health(device: Device) {
    const rows = async (path: string) => (await this.deps.get<{ data?: any[] }>(path, { deviceId: device.systemIp })).data ?? [];
    const [control, bfd] = await Promise.all([
      rows('/dataservice/device/control/connections').catch(() => []),
      rows('/dataservice/device/bfd/sessions').catch(() => []),
    ]);
    return {
      vsmartUp: control.filter((c) => c['peer-type'] === 'vsmart' && c.state === 'up').length,
      bfdUp: bfd.filter((b) => b.state === 'up').length,
    };
  }

  private async healthReport(device: Device, state: MigrationState) {
    const now = await this.health(device);
    return { ...now, bfdBefore: state.bfdBefore, healthy: now.vsmartUp > 0 && now.bfdUp >= state.bfdBefore };
  }

  /** Waits for a vManage task, up to maxSeconds; a task still running is returned as such, a failed one throws. */
  private async waitTask(id: string | undefined, maxSeconds: number, what: string) {
    if (!id) return { status: 'no task returned' };
    const deadline = Date.now() + maxSeconds * 1000;
    for (;;) {
      const body = await this.deps.get<{ summary?: { status?: string }; data?: any[] }>(`/dataservice/device/action/status/${encodeURIComponent(id)}`);
      if (body.summary?.status === 'done') {
        const failed = (body.data ?? []).filter((d) => d.statusId && d.statusId !== 'success');
        if (failed.length) {
          const activity = failed.map((d) => (d.activity ?? []).slice(-5).map((a: string) => maskLine(a)).join(' | ')).join('; ');
          throw new Error(`${what} failed (task ${id}): ${activity}`);
        }
        return { taskId: id, status: 'done' };
      }
      if (Date.now() >= deadline) return { taskId: id, status: 'in progress', note: 'call step "status" to follow it' };
      await this.deps.sleep(5000);
    }
  }
}

function taskId(response: any): string | undefined {
  const body = response?.result ?? response;
  return body?.parentTaskId ?? body?.id ?? undefined;
}
