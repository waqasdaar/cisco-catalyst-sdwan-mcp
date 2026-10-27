
# Catalyst SD-WAN MCP Server — Prompt Library

## Tool Domain Map

The Catalyst SD-WAN MCP server communicates with **Cisco vManage** via its REST API, exposing tools across device management, control plane operations, data plane monitoring, policy, templates, and alarms:[^2][^4]


| Domain | Core Tools |
| :-- | :-- |
| **Device Inventory** | `get_devices`, `get_wan_edge_inventory`, `get_device_status`, `get_device_counters` |
| **Control Plane** | `get_control_connections`, `get_omp_routes`, `get_omp_summary`, `get_omp_peers` |
| **Data Plane / BFD** | `get_bfd_sessions`, `get_bfd_summary`, `get_tunnel_statistics`, `get_app_route_stats` |
| **Interfaces** | `get_interface_stats`, `get_interface_detail`, `get_wan_interfaces` |
| **Alarms \& Events** | `get_alarms`, `get_active_alarms`, `get_events`, `get_audit_log` |
| **Templates** | `get_device_templates`, `get_feature_templates`, `get_template_config` |
| **Policies** | `get_centralized_policies`, `get_localized_policies`, `get_policy_definition`, `get_app_aware_routing_policy` |
| **Configuration** | `get_running_config`, `get_device_config_diff` |
| **Application \& QoE** | `get_dpi_stats`, `get_app_route_summary`, `get_qos_stats` |
| **Site \& Topology** | `get_site_list`, `get_topology`, `get_transport_locations` |
| **Security** | `get_security_policy`, `get_utm_stats`, `get_firewall_stats` |
| **Software** | `get_software_versions`, `get_device_image_versions` |


***

## 📦 Category 1 — Device Inventory \& Fabric Health

For **NOC Engineers, WAN Architects, and IT Operations** tracking the full SD-WAN device estate.

1. **"List all devices currently registered in the SD-WAN fabric. Group them by device type — vManage, vSmart, vBond, and WAN Edge routers. Show hostname, system IP, site ID, model, software version, reachability state, and last seen time. Flag any device not in a reachable state."**
2. **"Show the WAN Edge inventory across the entire fabric. For each WAN Edge, show the serial number, chassis ID, site ID, associated device template, software version, and whether it is in vManage mode or CLI mode. Flag any device in CLI mode — these are outside centralized management."**
3. **"What is the current operational status of all vSmart controllers? Show controller hostname, system IP, reachability, number of OMP sessions established, and number of WAN Edges connected to each controller. Flag any vSmart with fewer OMP sessions than expected."**
4. **"How many WAN Edge devices are running each software version across the entire SD-WAN fabric? Give me a software version distribution matrix — I need to know how many devices are on each version to plan our upgrade campaign."**
5. **"Which WAN Edge routers have been in an unreachable or degraded state in the last 24 hours? Show site ID, hostname, system IP, last reachable time, and the primary WAN circuit type at that site."**

***

## 🔁 Category 2 — Control Plane Operations (OMP \& Connections)

For **SD-WAN Architects and Network Engineers** managing the SD-WAN control plane health.

6. **"Check all control plane connections (DTLS/TLS) for WAN Edge device at site `1001`. Show each control connection — remote system IP (vSmart or vBond), connection type (DTLS/TLS), state, uptime, and number of vRoutes exchanged. Flag any control connection not in `up` state."**
7. **"Show the OMP route summary for device `BR-EDGE-DALLAS`. How many OMP routes are currently received, installed, and advertised? Show breakdown by route type — service routes, transport routes, and TLOC routes."**
8. **"List all OMP peers for vSmart controller `VSMART-01`. Show each WAN Edge peer — site ID, system IP, state, OMP session uptime, and number of routes exchanged. Flag any peer not in `up` state."**
9. **"Inspect the OMP routes received by WAN Edge `BR-EDGE-NYC` for the `10.50.0.0/16` prefix. Show all received paths — originating site, TLOC color, preference value, and whether the route is installed in the RIB. Are there multiple equal-cost paths available?"**
10. **"Have any OMP sessions reset or flapped in the last 4 hours across any WAN Edge in the fabric? Pull the alarms and events filtered for OMP state change events — show affected device, site ID, and the duration of each OMP disruption."**

***

## 📡 Category 3 — Data Plane \& BFD Tunnel Health

For **NOC Teams and WAN Engineers** monitoring tunnel state and data plane performance.

11. **"Show the BFD session summary for WAN Edge `BR-EDGE-CHICAGO`. List all BFD peers — remote system IP, local TLOC color, remote TLOC color, BFD state, uptime, and current packet loss and latency measurements. Flag any BFD session not in `up` state."**
12. **"Get the tunnel statistics for all tunnels originating from WAN Edge `BR-EDGE-LONDON`. Show each tunnel — remote site, TLOC color pair, current throughput (Tx/Rx), latency, jitter, and packet loss. Flag any tunnel with packet loss above 1% or latency above 150ms."**
13. **"Show the application-aware routing statistics for WAN Edge `BR-EDGE-SEATTLE` for the last 1 hour. For each tunnel, show the SLA class being met, average latency, jitter, and packet loss — and whether the preferred path for any application has changed due to an SLA violation."**
14. **"Which sites in the SD-WAN fabric currently have only ONE active BFD tunnel? These sites are in a single-path state with no redundancy — list site ID, hostname, the single active TLOC color, and the state of any backup tunnels."**
15. **"Show me all BFD sessions across the entire fabric that have been in a `down` state for more than 10 minutes. Group by site and TLOC color — flag any site where ALL tunnels are down (complete site isolation)."**

***

## 📊 Category 4 — Interface \& WAN Circuit Statistics

For **WAN Engineers and Capacity Planning Teams** monitoring physical and logical interface performance.

16. **"Get interface statistics for WAN Edge `BR-EDGE-HOUSTON`. Show all interfaces — input/output rates in Mbps, error counters, drop counters, and interface state. Flag any WAN-facing interface above 70% utilization."**
17. **"Show all WAN interfaces across the SD-WAN fabric. For each device, list the transport interface name, TLOC color (MPLS, Internet, LTE), IP address, configured bandwidth, and current utilization. Flag any circuit above 80% of its committed bandwidth."**
18. **"Which WAN Edge devices have LTE or cellular as their currently active primary transport (failover condition)? Show site ID, hostname, active TLOC color, and how long they have been on the LTE path — these represent sites where the primary circuit is down."**

***

## 🚨 Category 5 — Alarms, Events \& Incident Response

For **NOC Teams and Incident Commanders** managing real-time SD-WAN alerts.

19. **"List all currently active alarms in the SD-WAN fabric. Group by severity — Critical, Major, Minor. For each alarm, show the affected device, site ID, alarm type, alarm message, and time since triggered. Flag all Critical alarms for immediate escalation."**
20. **"Show all alarms that triggered between 2:00 PM and 4:00 PM today. I need to correlate with a reported user impact window — show every alarm that was open or triggered during that period, sorted by site ID."**
21. **"Pull the audit log for the last 24 hours. Show all configuration changes made via vManage — username, action type (template push, policy change, device attach), target device or template name, and timestamp. Flag any changes made outside business hours."**
22. **"Have any site-down events occurred in the last 7 days? Show the site ID, hostname, down time, restore time (if recovered), total outage duration, and the root cause category as logged by vManage."**

***

## 📋 Category 6 — Templates \& Configuration Management

For **Network Engineers and Change Management Teams** managing SD-WAN device and feature templates.

23. **"List all device templates in vManage. For each template, show the template name, device model it targets, number of attached devices, and last modified date. Flag any template that has been modified in the last 48 hours — recent changes may be related to ongoing issues."**
24. **"List all feature templates in vManage. Group by feature type (BGP, OSPF, VPN, BFD, OMP, Security, System). Show template name, associated device templates, and last modified date. Flag any feature template with no parent device template — these are orphaned templates."**
25. **"Get the running configuration for WAN Edge `BR-EDGE-DALLAS`. Show the full device configuration as deployed by vManage. I need this for a configuration audit and compliance check."**
26. **"Show the configuration diff for WAN Edge `BR-EDGE-CHICAGO` — what changed between the current running configuration and the last pushed template configuration? Are there any out-of-band CLI changes that are not reflected in vManage templates?"**

***

## 🛡️ Category 7 — Policy Management \& Application Routing

For **Network Architects and Security Engineers** managing SD-WAN traffic steering and security policies.

27. **"List all centralized policies configured in vManage. For each policy, show the policy name, activation state (active/inactive), number of sequences, associated site lists and VPN lists, and last modified date. Flag any policy that is currently inactive but references production site lists."**
28. **"Show the application-aware routing policy applied to the `PROD-ENTERPRISE` VPN. For each application or SLA class defined, show the preferred transport path (TLOC color), fallback path, SLA thresholds (loss, latency, jitter), and which sites the policy is applied to."**
29. **"Get the localized policy for WAN Edge `BR-EDGE-ATLANTA`. Show QoS policies, ACLs, and route policies — confirm the QoS class-map is correctly prioritizing voice (`DSCP EF`) and video (`DSCP AF41`) traffic above best-effort data."**
30. **"List all security policies configured in the SD-WAN fabric — UTM, firewall, IPS, and DNS security policies. Show which device templates they are attached to and whether they are currently active. Flag any security policy attached to a template with no deployed WAN Edges."**

***

## 🏭 Vertical-Specific Prompt Packs

### Retail / Multi-Site

- *"Show the SD-WAN fabric health for all sites tagged with the `retail-store` site tag. How many stores are currently reachable, how many have active alarms, and how many are on LTE backup? Give me a store network health dashboard."*


### Healthcare / Clinical Uptime

- *"List all SD-WAN sites tagged `clinical` or `hospital`. Are all sites reachable? For each site, show active tunnel count, BFD session state, and any alarms. Flag any clinical site with fewer than 2 active BFD tunnels — single-path clinical sites are a patient safety risk."*


### Financial Services / Trading

- *"Show the application-aware routing policy SLA compliance for the `Trading-Apps` application list across all branch sites. Which sites are currently experiencing an SLA violation on the preferred MPLS path and have failed over to internet transport? Show current path, latency, and loss for each."*


### Manufacturing / OT

- *"List all SD-WAN sites tagged `manufacturing` or `plant`. Show the VPN configuration for the OT VPN segment — confirm it is isolated from the corporate VPN and that no cross-VPN route leaking is configured. Flag any plant site where OT and IT VPNs share the same transport locator."*


### MSP / Multi-Tenant

- *"Show a per-tenant health summary across all vManage organizations. For each tenant, show total site count, reachable vs. unreachable WAN Edges, active alarm count by severity, and number of BFD sessions currently down. I need this for my MSP daily operations briefing."*

***

## 🔁 Cross-Ecosystem / Multi-MCP Prompts

The Catalyst SD-WAN MCP server is the **WAN fabric intelligence layer** of the suite — it governs how every branch, campus, and cloud site connects to the corporate network. These cross-server prompts chain SD-WAN's WAN-level visibility with application, identity, security, and infrastructure insight from the full MCP-Suite.[^1]

***

### 🔗 SD-WAN + ThousandEyes — WAN Path \& Application Correlation

31. **"ThousandEyes is detecting elevated latency from the Dallas branch enterprise agent to Microsoft 365. Pull the BFD tunnel statistics from the SD-WAN MCP for `BR-EDGE-DALLAS` — show latency and loss per TLOC color right now. Has the application-aware routing policy triggered a path change? Cross-reference ThousandEyes path visualization with the currently active SD-WAN transport path to confirm they are consistent."**
32. **"ThousandEyes reports simultaneous performance degradation from 5 branch enterprise agents to Salesforce. Pull the SD-WAN tunnel statistics for all 5 WAN Edges simultaneously — are all 5 currently using internet transport? Check if a common internet service provider or peering point is the shared element in their SD-WAN paths."**

***

### 🔗 SD-WAN + Meraki — Branch Convergence (SD-WAN + Cloud-Managed LAN)

33. **"A user at the Austin branch reports they cannot reach corporate applications. The branch has a Meraki MR wireless infrastructure connected to a Catalyst SD-WAN WAN Edge. Use the Meraki MCP to confirm the user's Wi-Fi connection is healthy (RSSI, SSID, VLAN). Then use the SD-WAN MCP to confirm the WAN Edge at that site has active BFD tunnels and OMP routes to the corporate data center. Isolate whether the issue is LAN-side (Meraki) or WAN-side (SD-WAN)."**
34. **"Show all Meraki branch sites that also have a Catalyst SD-WAN WAN Edge (identifiable by matching site ID or location tag). For each site, cross-reference Meraki MX uplink state with SD-WAN BFD tunnel state — flag any site where Meraki shows a healthy LAN but SD-WAN shows degraded tunnels, or vice versa."**

***

### 🔗 SD-WAN + ISE — Identity-Aware WAN Policy

35. **"ISE is reporting a spike in authentication failures at the Chicago branch. Use the SD-WAN MCP to pull the OMP and BFD state for `BR-EDGE-CHICAGO` — is the WAN Edge reachable and are its RADIUS server routes in the OMP routing table? A missing RADIUS route in OMP would prevent branch switches from reaching ISE, causing authentication failures."**
36. **"A contractor at the Seattle branch has been quarantined by ISE (SGT changed to `Quarantine`). Confirm end-to-end policy enforcement: use ISE MCP to verify the quarantine SGT assignment, then use SD-WAN MCP to confirm the centralized security policy has a `drop` action for the `Quarantine` SGT across all SD-WAN VPN segments that contractor could access from that site."**

***

### 🔗 SD-WAN + Catalyst Center — Campus-to-WAN Handoff

37. **"Catalyst Center is showing a degraded health score for the HQ campus. Use the SD-WAN MCP to check the WAN Edge at HQ — are all tunnels up, OMP routes healthy, and interface utilization normal on the WAN-facing interfaces? Determine if the HQ health issue is in the campus fabric (Catalyst Center domain) or at the WAN Edge (SD-WAN domain)."**
38. **"A path trace in Catalyst Center from a campus host to a branch server is showing hops beyond the WAN Edge but the trace is incomplete. Use the SD-WAN MCP to pull the OMP route for the branch server's subnet on the HQ WAN Edge — confirm the route is present, show the active TLOC path, and identify the next-hop tunnel endpoint. This completes the campus-to-branch path visibility."**

***

### 🔗 SD-WAN + Splunk — WAN Event Analytics \& Security

39. **"Splunk has been ingesting SD-WAN alarms via syslog. Search `index=sdwan_events` for the top 10 most frequent alarm types in the last 7 days across all sites. For each alarm type, use the SD-WAN MCP to pull the current alarm state — are these alarms still active or have they self-resolved? Build a WAN alarm frequency report to guide NOC threshold tuning."**
40. **"Splunk has flagged an unusual traffic volume spike from a branch site to an external IP flagged as a threat IOC. Use the SD-WAN MCP to: (1) identify which WAN Edge and VPN segment the traffic is originating from; (2) check the DPI statistics for that device to identify the application; (3) confirm whether the centralized security policy should be blocking that destination. Then use FMC MCP to confirm the firewall policy at the data center is blocking return traffic from that IOC."**

***

### 🔗 SD-WAN + FMC — WAN Security \& Threat Response

41. **"FMC has fired an IPS alert for traffic originating from branch site `1042` (SD-WAN site ID). Use the SD-WAN MCP to identify the WAN Edge at that site, the VPN segment the traffic came from, and the application-aware routing policy in effect. Then use FMC to confirm the IPS rule that triggered and determine whether an automatic quarantine policy should be pushed to the SD-WAN centralized policy to isolate that VPN segment."**

***

### 🔗 SD-WAN + Cisco Support — WAN Infrastructure Lifecycle

42. **"List all WAN Edge software versions across the fabric via the SD-WAN MCP. For each unique IOS-XE or vEdge OS version, use the Cisco Support MCP to: (1) check for PSIRT advisories; (2) pull severity 1–2 open bugs specific to SD-WAN features (OMP, BFD, application-aware routing); (3) confirm whether the version is on Cisco's recommended SD-WAN release train. Produce a per-site firmware risk and currency report."**

***

### 🔗 SD-WAN + All MCP Servers — Full-Stack Branch Incident Triage

43. **"We have a P1 incident: users at the Chicago branch cannot reach any corporate applications. Orchestrate a full-stack branch triage: (1) SD-WAN MCP — check WAN Edge reachability, BFD tunnel state, OMP routes, and active alarms for site `1042`; (2) Meraki MCP — check LAN switch and AP health at the Chicago branch; (3) ISE MCP — confirm RADIUS authentication is succeeding for Chicago branch users; (4) ThousandEyes — run instant tests from the Chicago enterprise agent to key corporate applications; (5) Splunk — search for correlated error logs from Chicago SD-WAN and LAN devices; (6) Catalyst Center — check if the path from Chicago WAN Edge to the data center shows any issues. Produce a ranked root-cause brief."**

***

## Prompt Engineering Tips for Catalyst SD-WAN MCP

| Principle | Guidance |
| :-- | :-- |
| **Anchor by system-ip or site-id** | vManage identifies devices by `system-ip` — always use system IP or site ID in device-specific prompts for precise targeting  |
| **BFD first for data plane triage** | For any connectivity complaint, start with `get_bfd_sessions` — BFD state is the fastest single indicator of data plane health  |
| **OMP for control plane triage** | For routing issues, start with `get_omp_routes` and `get_control_connections` — OMP session state and route presence answer most control plane questions  |
| **App-route stats for SLA issues** | For application performance complaints, `get_app_route_stats` shows per-tunnel SLA compliance and path selection in one call  |
| **Audit log for change correlation** | `get_audit_log` is essential for correlating incidents with recent policy or template changes — always check it within the first 5 minutes of any P1  |
| **Policy activation state matters** | Always check `get_centralized_policies` activation state — a policy can be configured in vManage but inactive (not pushed to vSmart), creating a gap between intent and enforcement |
| **Chain ThousandEyes as outside-in** | SD-WAN MCP sees the WAN fabric from inside; ThousandEyes sees it from the application path perspective — always pair them for complete branch performance triage  |


***

The Catalyst SD-WAN MCP server is the **WAN fabric intelligence and operations layer** of the MCP-Suite. It uniquely bridges the gap between the campus network (Catalyst Center, Meraki), identity (ISE), application experience (ThousandEyes), security (FMC, Splunk), and the cloud-managed AI fabric (Hyperfabric) — because every one of those domains depends on healthy WAN connectivity to function. The cross-ecosystem prompts above transform what would have been multi-tool, multi-portal investigations into single conversational workflows, delivering the full promise of AI-driven SD-WAN operations.
