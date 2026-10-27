# Catalyst SD-WAN MCP server: vManage API coverage

Generated 2026-10-27T12:15:55.262Z against vManage spec version 2.0.0 (test devices: edge <edge>, controller <controller>, validator <validator>). Regenerate with `npm run verify:api`.

## Summary

| Item | Count |
|---|---|
| Operations in the vManage OpenAPI spec | 4128 |
| Callable via `call_api_operation` (read) | 2392 |
| Callable via `call_api_operation` when writes are enabled | 1672 |
| Blocked (secrets / file upload / event stream) | 64 |
| Result: Blocked | 64 |
| Result: Verified live | 1113 |
| Result: Write | 1672 |
| Result: Read | 1131 |
| Result: Live error | 148 |
| Dedicated MCP tools | 83 |

## Dedicated MCP tools

| Tool | vManage endpoint(s) | In 26.x spec | Live result | Detail |
|---|---|---|---|---|
| `list_api_categories` | any (validated against spec) | n/a (spec-driven) | Verified live | {} → object |
| `search_api_operations` | any (validated against spec) | n/a (spec-driven) | Verified live | {"query":"omp routes"} → object |
| `describe_api_operation` | any (validated against spec) | n/a (spec-driven) | Verified live | {"operation_id":"createReceivedRoutesList"} → object |
| `call_api_operation` | any (validated against spec) | n/a (spec-driven) | Verified live | {"operation_id":"createOMPSummary","query":{"deviceId":"<edge>"}} → 1 rows |
| `list_devices` | /dataservice/device | Yes | Verified live | {} → 17 rows |
| `get_device_details` | /dataservice/device | Yes | Verified live | {"device_id":"<edge>"} → object |
| `list_reachable_devices` | /dataservice/device/reachable | Yes | Verified live | {} → 0 rows |
| `list_controllers` | /dataservice/system/device/controllers | Yes | Verified live | {} → 4 rows |
| `get_control_connections` | /dataservice/device/control/{…} | Yes | Verified live | {"device_id":"<edge>"} → 5 rows |
| `get_control_connections_history` | /dataservice/device/control/connectionshistory | Yes | Verified live | {"device_id":"<edge>"} → 3 rows |
| `get_control_local_properties` | /dataservice/device/control/{…} | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_control_wan_interfaces` | /dataservice/device/control/{…} | Yes | Verified live | {"device_id":"<edge>"} → 2 rows |
| `get_control_valid_devices` | /dataservice/device/control/{…} | Yes | Verified live | {"device_id":"<controller>"} → 47 rows |
| `get_control_affinity` | /dataservice/device/control/affinity/{…} | Yes | Verified live | {"device_id":"<edge>"} → 2 rows |
| `get_control_links` | /dataservice/device/control/links | Yes | Verified live | {"state":"up"} → 0 rows |
| `get_control_status` | /dataservice/device/control/status | Yes | Verified live | {} → 1 rows |
| `get_control_count` | /dataservice/device/control/count | Yes | Verified live | {} → 1 rows |
| `get_control_network_summary` | /dataservice/device/control/networksummary | Yes | Verified live | {} → 15 rows |
| `get_network_connections_summary` | /dataservice/network/connectionssummary | Yes | Verified live | {} → 3 rows |
| `get_control_summary` | /dataservice/device/control/summary | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_control_statistics` | /dataservice/device/control/statistics | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_omp_peers` | /dataservice/device/omp/{…} | Yes | Verified live | {"device_id":"<edge>"} → 2 rows |
| `get_omp_routes` | /dataservice/device/omp/routes/{…} | Yes | Verified live | {"device_id":"<edge>"} → 108 rows |
| `get_omp_tlocs` | /dataservice/device/omp/tlocs/{…} | Yes | Verified live | {"device_id":"<edge>"} → 14 rows |
| `get_omp_services` | /dataservice/device/omp/services | Yes | Verified live | {"device_id":"<edge>"} → 16 rows |
| `get_omp_multicast` | /dataservice/device/omp/{…} | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |
| `get_omp_cloudx` | /dataservice/device/omp/cloudx | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |
| `get_omp_links` | /dataservice/device/omp/links | Yes | Verified live | {"state":"up"} → 0 rows |
| `get_omp_status` | /dataservice/device/omp/status | Yes | Verified live | {} → 1 rows |
| `get_omp_summary` | /dataservice/device/omp/summary | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_validator_connections` | /dataservice/device/orchestrator/{…} | Yes | Verified live | {"device_id":"<validator>"} → 16 rows |
| `get_validator_summary` | /dataservice/device/orchestrator/summary | Yes | Verified live | {"device_id":"<validator>"} → 2 rows |
| `get_validator_statistics` | /dataservice/device/orchestrator/statistics | Yes | Verified live | {"device_id":"<validator>"} → 1 rows |
| `get_validator_local_properties` | /dataservice/device/orchestrator/localproperties | Yes | Verified live | {"device_id":"<validator>"} → 1 rows |
| `get_validator_valid_devices` | /dataservice/device/orchestrator/{…} | Yes | Verified live | {"device_id":"<validator>"} → 47 rows |
| `get_validator_proxy_mapping` | /dataservice/device/orchestrator/proxymapping | Yes | Verified live | {"device_id":"<validator>"} → 0 rows |
| `get_bfd_sessions` | /dataservice/device/bfd/sessions | Yes | Verified live | {"device_id":"<edge>"} → 6 rows |
| `get_bfd_summary` | /dataservice/device/bfd/summary | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_bfd_tloc` | /dataservice/device/bfd/tloc | Yes | Verified live | {"device_id":"<edge>"} → 2 rows |
| `get_device_interfaces` | /dataservice/device/interface | Yes | Verified live | {"device_id":"<edge>"} → 12 rows |
| `get_system_status` | /dataservice/device/system/status | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_device_arp` | /dataservice/device/arp | Yes | Verified live | {"device_id":"<edge>"} → 27 rows |
| `get_app_route_statistics` | /dataservice/device/app-route/statistics | Yes | Verified live | {"device_id":"<edge>"} → 36 rows |
| `get_app_route_sla_class` | /dataservice/device/app-route/sla-class | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_bgp_neighbors` | /dataservice/device/bgp/neighbors | Yes | Verified live | {"device_id":"<edge>"} → 2 rows |
| `get_bgp_routes` | /dataservice/device/bgp/routes | Yes | Verified live | {"device_id":"<edge>"} → 16 rows |
| `get_bgp_summary` | /dataservice/device/bgp/summary | Yes | Verified live | {"device_id":"<edge>"} → 2 rows |
| `get_cflowd_flows` | /dataservice/device/cflowd/flows | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |
| `get_cflowd_statistics` | /dataservice/device/cflowd/statistics | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |
| `get_app_log_flows` | /dataservice/device/app/log/flows | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |
| `get_app_log_flow_count` | /dataservice/device/app/log/flow-count | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |
| `get_sdwan_stats` | /dataservice/device/sdwan-stats | Yes | Verified live | {"device_id":"<edge>"} → 1 rows |
| `get_ux2_overview` | /dataservice/v1/feature-profile/{…} | Yes | Verified live | {} → object |
| `list_config_groups` | any (validated against spec) | n/a (spec-driven) | Verified live | {} → 6 rows |
| `get_config_group` | any (validated against spec) | n/a (spec-driven) | Verified live | {"config_group":"<config-group>"} → object |
| `get_config_group_device_variables` | /dataservice/v1/config-group/{…} | Yes | Verified live | {"config_group":"<config-group>"} → object |
| `preview_config_group_device_config` | /dataservice/v1/config-group/{…} | Yes | Verified live | {"config_group":"<config-group>","device":"<device>"} → object |
| `list_policy_groups` | any (validated against spec) | n/a (spec-driven) | Verified live | {} → 2 rows |
| `get_policy_group` | /dataservice/v1/{…} | Yes | Verified live | {"policy_group":"<policy-group>"} → object |
| `list_topology_groups` | any (validated against spec) | n/a (spec-driven) | Verified live | {} → 1 rows |
| `get_topology_group` | /dataservice/v1/topology-group/{…} | Yes | Verified live | {"topology_group":"<topology-group>"} → object |
| `list_feature_profiles` | /dataservice/v1/feature-profile/{…} | Yes | Verified live | {} → object |
| `get_feature_profile` | /dataservice/v1/feature-profile/{…} | Yes | Verified live | {"profile_type":"system","profile":"<feature-profile>"} → object |
| `get_network_hierarchy` | /dataservice/v1/network-hierarchy<br>/dataservice/device<br>/dataservice/v1/{…} | No: /v1/network-hierarchy | Verified live | {} → 14 rows |
| `list_device_templates` | /dataservice/template/device | Yes | Verified live | {} → 21 rows |
| `list_feature_templates` | /dataservice/template/feature | Yes | Verified live | {} → 137 rows |
| `get_attached_devices` | /dataservice/template/device/config/attached/{…} | Yes | Verified live | {"template_id":"<template-id>"} → 0 rows |
| `get_template_definition` | /dataservice/template/device/object/{…}<br>/dataservice/template/feature/object/{…} | Yes | Verified live | {"template_id":"<template-id>","template_type":"device"} → object |
| `list_policy_lists` | /dataservice/template/policy/list<br>/dataservice/template/policy/list/{…} | Yes | Verified live | {} → 33 rows |
| `list_policy_definitions` | /dataservice/template/policy/definition/{…} | Yes | Verified live | {"definition_type":"control"} → 0 rows |
| `list_policies` | /dataservice/template/policy/{…} | Yes | Verified live | {} → object |
| `get_cloudx_status` | /dataservice/template/cloudx | Yes | Verified live | {} → 0 rows |
| `get_cloudx_gateway_list` | /dataservice/template/cloudx/gatewaylist | Yes | Verified live | {} → 3 rows |
| `get_cloudx_client_list` | /dataservice/template/cloudx/clientlist | Yes | Verified live | {} → 3 rows |
| `get_cloudx_apps` | /dataservice/template/cloudx/manage/apps | Yes | Verified live | {} → 0 rows |
| `list_alarms` | /dataservice/alarms | Yes | Verified live | {} → 0 rows |
| `get_certificate_summary` | /dataservice/certificate/stats/summary | Yes | Verified live | {} → 1 rows |
| `list_vedge_inventory` | /dataservice/device/vedgeinventory/detail | Yes | Verified live | {} → 47 rows |
| `get_cluster_status` | /dataservice/clusterManagement/health/status | Yes | Verified live | {} → 2 rows |
| `list_custom_apps` | /dataservice/template/policy/customapp | Yes | Verified live | {} → 0 rows |
| `get_device_vpn` | /dataservice/device/vpn | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |
| `get_device_tloc` | /dataservice/device/tloc | Yes | Verified live | {"device_id":"<edge>"} → 2 rows |
| `get_bridge_table` | /dataservice/device/bridge/table | Yes | Verified live | {"device_id":"<edge>"} → 0 rows |

## Coverage by API category

| Category | Ops | Read | Write | Blocked | Live-tested | Verified live |
|---|---|---|---|---|---|---|
| Administration - Audit Log | 12 | 12 | 0 | 0 | 3 | 3 |
| Administration - User and Group | 38 | 11 | 22 | 5 | 11 | 11 |
| CCI Authorization Service  - CCI Registration | 1 | 0 | 1 | 0 | 0 | 0 |
| CCI Authorization Service - CCI Token | 1 | 0 | 0 | 1 | 0 | 0 |
| Certificate Management - Device | 53 | 21 | 30 | 2 | 17 | 17 |
| Certificate Management - vManage | 12 | 5 | 7 | 0 | 5 | 5 |
| Cisco Software | 6 | 4 | 0 | 2 | 3 | 3 |
| Client - Security | 1 | 0 | 0 | 1 | 0 | 0 |
| Client - UI | 1 | 1 | 0 | 0 | 1 | 1 |
| Cloud Sourced Application Compliance | 2 | 0 | 2 | 0 | 0 | 0 |
| Cloud Sourced Application Maintenance | 4 | 2 | 2 | 0 | 1 | 1 |
| Cluster Management | 22 | 15 | 7 | 0 | 11 | 11 |
| Colocation | 6 | 5 | 1 | 0 | 1 | 0 |
| Compliance - Device Details | 4 | 3 | 1 | 0 | 3 | 2 |
| Configuration - Advanced Inspection Profile Definition | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - App Registry | 9 | 7 | 2 | 0 | 5 | 5 |
| Configuration - Circuits | 3 | 1 | 2 | 0 | 1 | 1 |
| Configuration - Cloud On Ramp | 1 | 1 | 0 | 0 | 1 | 1 |
| Configuration - Cloud On Ramp SaaS | 10 | 9 | 1 | 0 | 7 | 7 |
| Configuration - CloudExpress | 17 | 10 | 7 | 0 | 9 | 9 |
| Configuration - Configuration Group | 16 | 8 | 8 | 0 | 1 | 1 |
| Configuration - Control Component Setting | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Dashboard Status | 7 | 3 | 4 | 0 | 2 | 2 |
| Configuration - Device Actions | 39 | 15 | 24 | 0 | 11 | 11 |
| Configuration - Device Config History | 14 | 14 | 0 | 0 | 6 | 4 |
| Configuration - Device Firmware Update | 11 | 5 | 6 | 0 | 4 | 4 |
| Configuration - Device Inventory | 33 | 12 | 15 | 6 | 7 | 6 |
| Configuration - Device Software Update | 13 | 3 | 6 | 4 | 1 | 1 |
| Configuration - Device SSL Proxy Certificate Management | 23 | 11 | 11 | 1 | 9 | 8 |
| Configuration - Device Template | 20 | 8 | 10 | 2 | 2 | 2 |
| Configuration - Disaster Recovery | 31 | 11 | 19 | 1 | 11 | 9 |
| Configuration - Downloaded Images | 1 | 1 | 0 | 0 | 1 | 1 |
| Configuration - Feature Certificate | 6 | 3 | 3 | 0 | 3 | 1 |
| Configuration - Feature Profile (Mobility) | 65 | 29 | 36 | 0 | 3 | 3 |
| Configuration - Feature Profile (NFVirtual) | 72 | 21 | 51 | 0 | 3 | 3 |
| Configuration - Feature Profile (SD-Routing) | 439 | 177 | 262 | 0 | 10 | 10 |
| Configuration - Feature Profile (SDWAN) | 605 | 269 | 336 | 0 | 53 | 53 |
| Configuration - FQDN List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - General Template | 20 | 13 | 7 | 0 | 6 | 5 |
| Configuration - Ise Server | 17 | 4 | 5 | 8 | 1 | 0 |
| Configuration - Maintenance window flag | 2 | 1 | 1 | 0 | 1 | 1 |
| Configuration - Multidomain Policy | 14 | 5 | 9 | 0 | 1 | 1 |
| Configuration - Network Design | 15 | 8 | 7 | 0 | 5 | 5 |
| Configuration - Network Design Templates | 6 | 4 | 2 | 0 | 2 | 2 |
| Configuration - Policy Access List Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy AMP Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy App Probe Class List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy App Registry | 3 | 1 | 2 | 0 | 1 | 1 |
| Configuration - Policy Application List Builder | 18 | 8 | 10 | 0 | 4 | 4 |
| Configuration - Policy AppRoute Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy ASPath List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Cflowd Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Cloud Application Builder | 1 | 1 | 0 | 0 | 1 | 1 |
| Configuration - Policy Color List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Community List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Control Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Custom Application Builder | 6 | 2 | 4 | 0 | 1 | 1 |
| Configuration - Policy Data Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Data IPV6 Prefix List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Data Prefix All Types Of Lists Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Data Prefix List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Device Access Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy DialPeer Definition Builder | 18 | 6 | 12 | 0 | 2 | 2 |
| Configuration - Policy Expanded Community List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Extended Community List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Fax Protocol List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Forwarding Class List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy FXO Port Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy FXS Port Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy FXSDID Port Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Geo Location List Builder | 10 | 5 | 5 | 0 | 3 | 3 |
| Configuration - Policy Hub and Spoke Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Identity List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Intrusion Prevention Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy IPS Signature List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy IPv6 Access Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy IPv6 Device Access Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy IPv6 Prefix List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy List Builder | 3 | 1 | 2 | 0 | 1 | 1 |
| Configuration - Policy Local Domain Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Local Domain Name List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Media Profile List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Mesh Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Mirror List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Modem Passthrough List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Policer Class List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Port List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Prefix for All Types of Lists Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Prefix List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy PRI ISDN Port Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Protocol Name List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Qos Map Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Region List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Rewrite Rule Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Scalable Group Tag List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Security Assembler | 2 | 1 | 1 | 0 | 0 | 0 |
| Configuration - Policy Site List Builder | 10 | 4 | 6 | 0 | 2 | 2 |
| Configuration - Policy SLA Class List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Supervisory Disc List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Threat Grid Api Key List | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy TLOC List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy TranslationProfile List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy TranslationRules List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Trunk Group List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy Umbrella Data List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy URL BlackList Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy URL Filtering Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy URL WhiteList Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy vEdge Assembler | 2 | 1 | 1 | 0 | 0 | 0 |
| Configuration - Policy vEdge Route Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Voice Assembler | 2 | 1 | 1 | 0 | 0 | 0 |
| Configuration - Policy VPN List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Policy VPN Membership Group Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy VPN-Qos Map Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy vSmart Assembler | 2 | 1 | 1 | 0 | 0 | 0 |
| Configuration - Policy Zone Based Firewall Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Policy Zone List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Preferred Color Group List Builder | 9 | 4 | 5 | 0 | 2 | 2 |
| Configuration - Quick Connect | 2 | 1 | 1 | 0 | 1 | 1 |
| Configuration - Rule Set Definition | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Secure Internet Gateway | 4 | 3 | 0 | 1 | 0 | 0 |
| Configuration - Secure Internet Gateway Tunnels | 1 | 1 | 0 | 0 | 1 | 1 |
| Configuration - Security Group Definition | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Security Template Policy | 10 | 6 | 4 | 0 | 3 | 3 |
| Configuration - Segments | 5 | 2 | 3 | 0 | 1 | 1 |
| Configuration - Settings | 28 | 13 | 13 | 2 | 11 | 10 |
| Configuration - Software Actions | 18 | 11 | 7 | 0 | 6 | 6 |
| Configuration - SSL Decryption Policy Definition Builder | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - SSL Decryption UTD Profile Definition | 9 | 3 | 6 | 0 | 1 | 1 |
| Configuration - Template Configuration | 10 | 7 | 3 | 0 | 2 | 1 |
| Configuration - Template Lock | 2 | 0 | 2 | 0 | 0 | 0 |
| Configuration - Template Master | 13 | 7 | 6 | 0 | 4 | 4 |
| Configuration - Topology | 5 | 5 | 0 | 0 | 3 | 3 |
| Configuration - vEdge Template Policy | 8 | 4 | 4 | 0 | 2 | 2 |
| Configuration - Voice Template Policy | 9 | 6 | 3 | 0 | 3 | 3 |
| Configuration - vSmart Template Policy | 12 | 5 | 7 | 0 | 4 | 3 |
| Data Collection Agent | 25 | 16 | 5 | 4 | 5 | 5 |
| Deployment Mode | 8 | 4 | 4 | 0 | 3 | 2 |
| developers | 1 | 1 | 0 | 0 | 1 | 1 |
| Device - Messaging | 1 | 1 | 0 | 0 | 1 | 1 |
| Device - Network | 4 | 4 | 0 | 0 | 4 | 4 |
| File based RealTime Data Collection - Device notification - File generation status | 1 | 0 | 1 | 0 | 0 | 0 |
| File based RealTime Data Collection - Download Generated File | 1 | 1 | 0 | 0 | 0 | 0 |
| File based RealTime Data Collection - Get Data Collection status for a Request UUID | 1 | 1 | 0 | 0 | 0 | 0 |
| File based RealTime Data Collection - Get Data Collection status for Device UUID | 1 | 1 | 0 | 0 | 0 | 0 |
| File based RealTime Data Collection - Get Supported Commands List for a Device UUID | 1 | 1 | 0 | 0 | 0 | 0 |
| File based RealTime Data Collection - Initiate File Generation | 1 | 0 | 1 | 0 | 0 | 0 |
| HSEC | 6 | 2 | 4 | 0 | 2 | 2 |
| IDP Certificate Management | 6 | 2 | 4 | 0 | 2 | 2 |
| IPS Signature - Comment | 4 | 1 | 3 | 0 | 0 | 0 |
| IPS Signature - Custom Rule | 2 | 0 | 2 | 0 | 0 | 0 |
| IPS Signature - Rule | 4 | 3 | 1 | 0 | 0 | 0 |
| IPS Signature - Rule Group | 4 | 2 | 2 | 0 | 1 | 1 |
| Jobs - Batch | 1 | 0 | 1 | 0 | 0 | 0 |
| Kubernetes Services | 5 | 2 | 3 | 0 | 2 | 2 |
| Licensing - Next Generation | 6 | 4 | 2 | 0 | 1 | 1 |
| Locale | 1 | 1 | 0 | 0 | 1 | 1 |
| Management | 2 | 2 | 0 | 0 | 2 | 2 |
| Manual Onboard Device | 4 | 1 | 3 | 0 | 0 | 0 |
| Monitoring - Alarms Details | 37 | 26 | 11 | 0 | 15 | 15 |
| Monitoring - Alarms Notification | 6 | 1 | 5 | 0 | 1 | 1 |
| Monitoring - App Hosting | 22 | 22 | 0 | 0 | 12 | 8 |
| Monitoring - Application Aware Routing | 22 | 22 | 0 | 0 | 8 | 4 |
| Monitoring - ART | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - BFD | 11 | 11 | 0 | 0 | 6 | 2 |
| Monitoring - BootUp Time | 1 | 1 | 0 | 0 | 1 | 1 |
| Monitoring - Bridge | 22 | 22 | 0 | 0 | 12 | 8 |
| Monitoring - CDP | 2 | 1 | 1 | 0 | 1 | 1 |
| Monitoring - Cedge Cflowd | 3 | 3 | 0 | 0 | 3 | 3 |
| Monitoring - Cellular-EIOLTE | 13 | 13 | 0 | 0 | 6 | 4 |
| Monitoring - Cflowd | 23 | 23 | 0 | 0 | 18 | 12 |
| Monitoring - CloudExpress | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - Crypto VPN | 2 | 2 | 0 | 0 | 0 | 0 |
| Monitoring - Device Configuration Security Advisories | 3 | 3 | 0 | 0 | 2 | 2 |
| Monitoring - Device Details | 38 | 31 | 7 | 0 | 23 | 23 |
| Monitoring - Device Health | 2 | 2 | 0 | 0 | 1 | 1 |
| Monitoring - Device Statistics | 11 | 11 | 0 | 0 | 6 | 0 |
| Monitoring - Device Statistics Details | 5 | 5 | 0 | 0 | 2 | 1 |
| Monitoring - Device Statistics Details V2 | 3 | 3 | 0 | 0 | 2 | 1 |
| Monitoring - DPI | 19 | 19 | 0 | 0 | 7 | 5 |
| Monitoring - DPI - On-demand troubleshooting | 5 | 2 | 3 | 0 | 2 | 2 |
| Monitoring - Endpoint Tracker Status | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - Events | 18 | 16 | 2 | 0 | 9 | 9 |
| Monitoring - Flowlog | 11 | 11 | 0 | 0 | 6 | 3 |
| Monitoring - Health | 2 | 2 | 0 | 0 | 2 | 2 |
| Monitoring - Interface Statistics | 14 | 14 | 0 | 0 | 5 | 4 |
| Monitoring - IPsAlert | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - LLDP | 2 | 1 | 1 | 0 | 1 | 1 |
| Monitoring - Network Availability | 3 | 3 | 0 | 0 | 0 | 0 |
| Monitoring - Performance Monitor | 6 | 6 | 0 | 0 | 1 | 1 |
| Monitoring - Power Consumption Statistics | 6 | 6 | 0 | 0 | 1 | 1 |
| Monitoring - PPL | 22 | 22 | 0 | 0 | 12 | 8 |
| Monitoring - Qfp | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - Qfp Drop Statistics | 13 | 13 | 0 | 0 | 6 | 4 |
| Monitoring - QoS | 13 | 13 | 0 | 0 | 6 | 4 |
| Monitoring - SDRA | 2 | 2 | 0 | 0 | 2 | 2 |
| Monitoring - Search | 2 | 2 | 0 | 0 | 1 | 1 |
| Monitoring - SecureX Integration | 4 | 0 | 1 | 3 | 0 | 0 |
| Monitoring - Security Policy | 5 | 5 | 0 | 0 | 2 | 2 |
| Monitoring - Security Unified Logging Connection Events | 13 | 13 | 0 | 0 | 6 | 4 |
| Monitoring - Server Info | 1 | 1 | 0 | 0 | 1 | 1 |
| Monitoring - SiteHealth Monitor | 13 | 13 | 0 | 0 | 8 | 6 |
| Monitoring - Stats Download | 3 | 1 | 1 | 1 | 0 | 0 |
| Monitoring - Stats Processing | 9 | 6 | 3 | 0 | 6 | 5 |
| Monitoring - Status | 5 | 3 | 2 | 0 | 2 | 2 |
| Monitoring - System Status Stats | 11 | 11 | 0 | 0 | 6 | 2 |
| Monitoring - Temperature Statistics | 12 | 12 | 0 | 0 | 7 | 5 |
| Monitoring - Tunnel Health | 12 | 12 | 0 | 0 | 6 | 3 |
| Monitoring - Umbrella | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - Umbrella Patterns | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - Underlay Alarms | 1 | 1 | 0 | 0 | 0 | 0 |
| Monitoring - URL Filtering | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - VNF Interface Statistics | 11 | 11 | 0 | 0 | 6 | 4 |
| Monitoring - Wlan Client Info | 11 | 11 | 0 | 0 | 6 | 4 |
| MSLA | 3 | 2 | 1 | 0 | 2 | 2 |
| MultiCloud - Accounts | 7 | 3 | 3 | 1 | 2 | 2 |
| MultiCloud - BranchConnect | 6 | 3 | 3 | 0 | 2 | 0 |
| MultiCloud - CloudGateway | 26 | 20 | 6 | 0 | 2 | 2 |
| MultiCloud - General | 15 | 12 | 3 | 0 | 6 | 5 |
| MultiCloud - Global Settings | 5 | 3 | 2 | 0 | 3 | 1 |
| MultiCloud - Mapping | 8 | 7 | 1 | 0 | 5 | 5 |
| MultiCloud - Tagging | 6 | 2 | 4 | 0 | 1 | 1 |
| Multicloud Interconnect - Accounts | 11 | 4 | 6 | 1 | 1 | 1 |
| Multicloud Interconnect - Cloud Resource Management | 11 | 6 | 5 | 0 | 0 | 0 |
| Multicloud Interconnect - Connectivity | 26 | 14 | 12 | 0 | 4 | 4 |
| Multicloud Interconnect - Entitlement | 1 | 1 | 0 | 0 | 0 | 0 |
| Multicloud Interconnect - Gateways | 14 | 8 | 6 | 0 | 4 | 3 |
| Multicloud Interconnect - General | 6 | 5 | 1 | 0 | 2 | 2 |
| Multicloud Interconnect - Global Settings | 4 | 2 | 2 | 0 | 1 | 0 |
| Multicloud Interconnect - Monitoring | 5 | 5 | 0 | 0 | 1 | 1 |
| Multicloud Interconnect - Resource Audit | 1 | 1 | 0 | 0 | 0 | 0 |
| Multicloud Interconnect - Service Sw package types | 1 | 1 | 0 | 0 | 0 | 0 |
| Multicloud Interconnect - Services | 1 | 1 | 0 | 0 | 0 | 0 |
| Network Settings | 4 | 2 | 2 | 0 | 0 | 0 |
| Overview - Cellular | 4 | 4 | 0 | 0 | 4 | 4 |
| Overview - PPL | 3 | 3 | 0 | 0 | 3 | 3 |
| Partner - ACI Policy Builder | 8 | 5 | 3 | 0 | 2 | 2 |
| Partner - DNAC SDA API | 6 | 4 | 2 | 0 | 1 | 1 |
| Partner - Registration | 12 | 6 | 6 | 0 | 2 | 2 |
| Partner - WCM Configs | 1 | 0 | 1 | 0 | 0 | 0 |
| Policy - Policy Group | 16 | 8 | 8 | 0 | 1 | 1 |
| Protocol Pack Compliance | 15 | 12 | 3 | 0 | 5 | 5 |
| Protocol Pack Maintenance | 13 | 7 | 5 | 1 | 5 | 4 |
| Radkit | 4 | 1 | 3 | 0 | 1 | 0 |
| Real Time Monitoring - GNSS | 5 | 5 | 0 | 0 | 5 | 5 |
| Real Time Monitoring - Raw Socket | 6 | 6 | 0 | 0 | 6 | 6 |
| Real-Time Monitoring - AAA | 7 | 7 | 0 | 0 | 7 | 7 |
| Real-Time Monitoring - App Hosting | 8 | 8 | 0 | 0 | 8 | 8 |
| Real-Time Monitoring - App Logs | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - Application-Aware Route | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - Appqoe | 16 | 16 | 0 | 0 | 13 | 13 |
| Real-Time Monitoring - ARP | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - BFD | 15 | 15 | 0 | 0 | 12 | 12 |
| Real-Time Monitoring - BGP | 3 | 3 | 0 | 0 | 3 | 3 |
| Real-Time Monitoring - Bridge | 3 | 3 | 0 | 0 | 3 | 3 |
| Real-Time Monitoring - Cellular | 12 | 12 | 0 | 0 | 12 | 12 |
| Real-Time Monitoring - Cellular AON Ipsec Interface  | 2 | 2 | 0 | 0 | 2 | 0 |
| Real-Time Monitoring - Cellular EIOLTE Connection Service | 2 | 2 | 0 | 0 | 2 | 0 |
| Real-Time Monitoring - Cellular EIOLTE Hardware Service  | 1 | 1 | 0 | 0 | 1 | 0 |
| Real-Time Monitoring - Cellular EIOLTE Network Service | 1 | 1 | 0 | 0 | 1 | 0 |
| Real-Time Monitoring - Cellular EIOLTE Sim Service | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - CFM | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - CloudExpress | 5 | 5 | 0 | 0 | 5 | 2 |
| Real-Time Monitoring - Commit List | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Container Lifecycle | 1 | 1 | 0 | 0 | 1 | 0 |
| Real-Time Monitoring - Crash Log | 4 | 4 | 0 | 0 | 3 | 3 |
| Real-Time Monitoring - Device | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Device Control | 22 | 22 | 0 | 0 | 21 | 21 |
| Real-Time Monitoring - Device Feature List | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - Device System Stats | 13 | 13 | 0 | 0 | 6 | 4 |
| Real-Time Monitoring - device/vlan | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - DHCP | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - Dns Defense | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - DOT1x | 3 | 3 | 0 | 0 | 3 | 3 |
| Real-Time Monitoring - DPI | 11 | 11 | 0 | 0 | 11 | 11 |
| Real-Time Monitoring - DRE | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - Dual Static Route Tracker Service | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - EIGRP | 3 | 3 | 0 | 0 | 3 | 3 |
| Real-Time Monitoring - Endpoint Tracker Group Service | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Endpoint Tracker Service | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Geo-fencing | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Hardware | 10 | 10 | 0 | 0 | 10 | 10 |
| Real-Time Monitoring - IGMP | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - Ignition Status | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Insecure Device Configuration | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Interface | 14 | 14 | 0 | 0 | 14 | 14 |
| Real-Time Monitoring - IP | 11 | 11 | 0 | 0 | 11 | 11 |
| Real-Time Monitoring - IPsec | 12 | 12 | 0 | 0 | 12 | 12 |
| Real-Time Monitoring - IPv4 FIB | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - IPv6 FIB | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - IPv6 Neighbours | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Lacp | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - License Info | 6 | 6 | 0 | 0 | 6 | 6 |
| Real-Time Monitoring - Lpshield | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Multicast | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - NetworkHub Resources | 3 | 3 | 0 | 0 | 3 | 0 |
| Real-Time Monitoring - Next Generation Firewall Update Status | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - NMS | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - NTP | 6 | 6 | 0 | 0 | 6 | 6 |
| Real-Time Monitoring - OMP | 17 | 17 | 0 | 0 | 16 | 16 |
| Real-Time Monitoring - Orchestrator | 9 | 9 | 0 | 0 | 9 | 9 |
| Real-Time Monitoring - OSPF | 9 | 9 | 0 | 0 | 9 | 9 |
| Real-Time Monitoring - PIM | 5 | 5 | 0 | 0 | 5 | 5 |
| Real-Time Monitoring - Pki Trustpoint | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Policer | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Policy | 25 | 25 | 0 | 0 | 25 | 25 |
| Real-Time Monitoring - Power Consumption | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Power Management | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Power Management Daily History | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Power Management Hourly History | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - PPPoE | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - QFP | 5 | 5 | 0 | 0 | 5 | 5 |
| Real-Time Monitoring - QoS | 3 | 3 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - RBAC | 3 | 3 | 0 | 0 | 3 | 2 |
| Real-Time Monitoring - Reboot History | 3 | 3 | 0 | 0 | 3 | 3 |
| Real-Time Monitoring - SDWAN Statistics | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - Security | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - SFP | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - Show On Demand Local | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Show On Demand Remote | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - SIG | 5 | 5 | 0 | 0 | 5 | 5 |
| Real-Time Monitoring - Software | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - SSE | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Sslproxy | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - Static Route Tracker Service | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Switchport | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - System | 9 | 9 | 0 | 0 | 9 | 5 |
| Real-Time Monitoring - TCP Optimization | 3 | 3 | 0 | 0 | 3 | 3 |
| Real-Time Monitoring - Tcpproxy | 2 | 2 | 0 | 0 | 2 | 2 |
| Real-Time Monitoring - Tools | 5 | 5 | 0 | 0 | 4 | 3 |
| Real-Time Monitoring - Transport | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Trustsec | 9 | 9 | 0 | 0 | 9 | 9 |
| Real-Time Monitoring - Tunnel | 6 | 6 | 0 | 0 | 6 | 6 |
| Real-Time Monitoring - Ucse | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Umbrella | 5 | 5 | 0 | 0 | 5 | 5 |
| Real-Time Monitoring - UTD | 13 | 13 | 0 | 0 | 13 | 13 |
| Real-Time Monitoring - VDSL Service | 7 | 7 | 0 | 0 | 7 | 7 |
| Real-Time Monitoring - VM | 4 | 4 | 0 | 0 | 3 | 0 |
| Real-Time Monitoring - Voice | 10 | 10 | 0 | 0 | 10 | 10 |
| Real-Time Monitoring - VPN | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - VRRP | 1 | 1 | 0 | 0 | 1 | 1 |
| Real-Time Monitoring - Wireless | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring - WLAN | 4 | 4 | 0 | 0 | 4 | 4 |
| Real-Time Monitoring -LTE450 Cellular | 3 | 3 | 0 | 0 | 3 | 3 |
| Resource - Pool | 3 | 1 | 2 | 0 | 0 | 0 |
| Rules | 1 | 1 | 0 | 0 | 0 | 0 |
| Scheduled Backup Restore | 11 | 5 | 6 | 0 | 2 | 2 |
| Scheduled Report Management | 10 | 5 | 5 | 0 | 2 | 2 |
| SD AVC - Reverse Migration | 5 | 3 | 2 | 0 | 1 | 1 |
| SD AVC Cloud Connector | 4 | 2 | 2 | 0 | 2 | 2 |
| SD AVC Domain-based App Rules | 1 | 1 | 0 | 0 | 1 | 1 |
| SD AVC IP Address based App Rules | 1 | 1 | 0 | 0 | 1 | 1 |
| SD AVC Webex App Rules | 1 | 1 | 0 | 0 | 1 | 1 |
| SDAVC SaaS - Publish Tenants | 1 | 0 | 1 | 0 | 0 | 0 |
| Secure Device Onboarding - Communication Plans | 1 | 1 | 0 | 0 | 0 | 0 |
| Secure Device OnBoarding - Provider Credentials | 7 | 2 | 0 | 5 | 1 | 0 |
| Secure Device Onboarding - Rate Plans | 1 | 1 | 0 | 0 | 0 | 0 |
| Secure Device OnBoarding - SDO Token | 2 | 1 | 0 | 1 | 1 | 0 |
| Service Chain Mapping | 1 | 1 | 0 | 0 | 1 | 1 |
| Setting - Dynamic Scheduler | 2 | 0 | 2 | 0 | 0 | 0 |
| Smart License | 4 | 3 | 1 | 0 | 1 | 1 |
| SmartLicensing - Licenses | 6 | 5 | 1 | 0 | 4 | 3 |
| SmartLicensing - Sync EA Licenses | 4 | 2 | 2 | 0 | 1 | 1 |
| SmartLicensing - Sync Licenses | 3 | 2 | 0 | 1 | 1 | 1 |
| System - Cloud Service | 18 | 9 | 3 | 6 | 6 | 6 |
| System - Cloud Service CDNA | 4 | 2 | 2 | 0 | 1 | 1 |
| System - Cloud Service Webex | 7 | 4 | 3 | 0 | 2 | 1 |
| System - Container | 2 | 1 | 1 | 0 | 1 | 1 |
| System - Reverse Proxy | 2 | 1 | 1 | 0 | 0 | 0 |
| Tenant Backup Restore | 5 | 2 | 2 | 1 | 1 | 0 |
| Tenant Management | 20 | 6 | 14 | 0 | 5 | 0 |
| Tenant Migration | 6 | 1 | 3 | 2 | 0 | 0 |
| Tools - TAC Cases | 2 | 2 | 0 | 0 | 2 | 1 |
| Topology - Topology Group | 7 | 3 | 4 | 0 | 1 | 1 |
| Troubleshooting MRE - Workflow | 2 | 0 | 2 | 0 | 0 | 0 |
| Troubleshooting Tools - Device Connectivity | 24 | 7 | 17 | 0 | 2 | 2 |
| Troubleshooting Tools - Device Group | 5 | 5 | 0 | 0 | 5 | 3 |
| Troubleshooting Tools - Diagnostics | 46 | 23 | 23 | 0 | 7 | 5 |
| Troubleshooting Tools - Network Wide Path Insight | 11 | 3 | 7 | 1 | 2 | 2 |
| Troubleshooting Tools - UMTS | 4 | 1 | 3 | 0 | 0 | 0 |
| Truststore Certificates | 6 | 2 | 4 | 0 | 1 | 1 |
| Umbrella | 5 | 4 | 1 | 0 | 4 | 0 |
| url monitor | 4 | 1 | 3 | 0 | 1 | 1 |
| Utility - Configuration DB | 4 | 4 | 0 | 0 | 2 | 2 |
| Utility - Logging | 7 | 4 | 3 | 0 | 4 | 4 |
| Utility - OLAP DB | 1 | 0 | 1 | 0 | 0 | 0 |
| Utility - Security | 1 | 0 | 1 | 0 | 0 | 0 |
| Wani Recommendations | 5 | 4 | 1 | 0 | 2 | 2 |
| Workflows - Controllers Upgrade | 6 | 3 | 3 | 0 | 1 | 1 |

## All operations

| Method | Path | operationId | Category | Access | Result | Detail |
|---|---|---|---|---|---|---|
| GET | `/dataservice/auditlog` | getStatDataRawAuditLogData | Administration - Audit Log | read | Read (needs input) | query: query |
| POST | `/dataservice/auditlog` | getRawPropertyData | Administration - Audit Log | read | Read (needs input) | query body |
| GET | `/dataservice/auditlog/aggregation` | getPropertyAggregationData | Administration - Audit Log | read | Read (needs input) | query: query |
| POST | `/dataservice/auditlog/aggregation` | getPostPropertyAggregationData | Administration - Audit Log | read | Read (needs input) | query body |
| GET | `/dataservice/auditlog/doccount` | getCount_AdministrationAuditLog_1803 | Administration - Audit Log | read | Read (needs input) | query: query |
| POST | `/dataservice/auditlog/doccount` | getCountPost_AdministrationAuditLog_1804 | Administration - Audit Log | read | Verified live | object |
| GET | `/dataservice/auditlog/fields` | getStatDataFields_AdministrationAuditLog_1603 | Administration - Audit Log | read | Verified live | object |
| GET | `/dataservice/auditlog/page` | getStatBulkRawPropertyData | Administration - Audit Log | read | Read (needs input) | query: query |
| POST | `/dataservice/auditlog/page` | getPostStatBulkRawPropertyData | Administration - Audit Log | read | Read (needs input) | query: count |
| GET | `/dataservice/auditlog/query/fields` | getStatQueryFields_AdministrationAuditLog_2203 | Administration - Audit Log | read | Verified live | 2 rows |
| GET | `/dataservice/auditlog/severity` | generateAuditLog | Administration - Audit Log | read | Read (needs input) | query: query |
| GET | `/dataservice/auditlog/severity/summary` | getAuditSeverityCustomHistogram | Administration - Audit Log | read | Read (needs input) | query: query |
| DELETE | `/dataservice/admin/aaa` | deleteAaaConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/aaa` | getAaaConfig | Administration - User and Group | read | Verified live | object |
| POST | `/dataservice/admin/aaa` | createAaaConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/aaa` | updateAaaConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/events/{sseSessionId}` | listenAuthEvents | Administration - User and Group | blocked | Blocked | Server-sent event stream; not usable over MCP request/response |
| DELETE | `/dataservice/admin/radius` | deleteRadiusConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/radius` | getRadiusConfig | Administration - User and Group | read | Verified live | object |
| POST | `/dataservice/admin/radius` | createRadiusConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/radius` | updateRadiusConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/admin/tacacs` | deleteTacacsConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/tacacs` | getTacacsConfig | Administration - User and Group | read | Verified live | object |
| POST | `/dataservice/admin/tacacs` | createTacacsConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/tacacs` | updateTacacsConfig | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/user` | findUsers_AdministrationUserGroup_1103 | Administration - User and Group | read | Verified live | 3 rows |
| POST | `/dataservice/admin/user` | createUser_AdministrationUserGroup_1104 | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/admin/user/{userName}` | deleteUser_AdministrationUserGroup_2206 | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/user/{userName}` | updateUser_AdministrationUserGroup_2203 | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/user/activeSessions` | getActiveSessions_AdministrationUserGroup_2603 | Administration - User and Group | read | Verified live | 15 rows |
| POST | `/dataservice/admin/user/admin/password` | updateAdminPassword_AdministrationUserGroup_2604 | Administration - User and Group | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| PUT | `/dataservice/admin/user/lockUser/{userName}` | lockUser | Administration - User and Group | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/user/password/{userName}` | updatePassword_AdministrationUserGroup_3103 | Administration - User and Group | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/admin/user/password/validate` | validatePassword_AdministrationUserGroup_2904 | Administration - User and Group | blocked (deprecated) | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| PUT | `/dataservice/admin/user/profile/locale` | updateProfileLocale_AdministrationUserGroup_2603 | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/user/profile/password` | updateProfilePassword_AdministrationUserGroup_2803 | Administration - User and Group | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| DELETE | `/dataservice/admin/user/removeSessions` | removeSessions_AdministrationUserGroup_2606 | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/admin/user/reset` | resetUser_AdministrationUserGroup_1704 | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/user/role` | findUserRole_AdministrationUserGroup_1603 | Administration - User and Group | read | Verified live | object |
| GET | `/dataservice/admin/user/userAuthType` | findUserAuthType_AdministrationUserGroup_2403 | Administration - User and Group | read | Verified live | object |
| GET | `/dataservice/admin/usergroup` | findUserGroups | Administration - User and Group | read | Verified live | 5 rows |
| POST | `/dataservice/admin/usergroup` | createUserGroup | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/admin/usergroup/{userGroupId}` | deleteUserGroup | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/usergroup/{userGroupId}` | updateUserGroup | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/admin/usergroup/definition` | createGroupGridColumns | Administration - User and Group | read | Verified live | 0 rows |
| GET | `/dataservice/admin/usergroup/keyvalue` | findUserGroupsAsKeyValue | Administration - User and Group | read | Verified live | 8 rows |
| GET | `/dataservice/admin/vpngroup` | getVpnGroups | Administration - User and Group | read | Verified live | 0 rows |
| POST | `/dataservice/admin/vpngroup` | createVpnGroup | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/admin/vpngroup/{id}` | deleteVpnGroup | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/admin/vpngroup/{id}` | editVpnGroup | Administration - User and Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/cci/authorize` | cciAuthorize | CCI Authorization Service  - CCI Registration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/cci/token` | cciToken | CCI Authorization Service - CCI Token | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| DELETE | `/dataservice/certificate/{uuid}` | deleteConfiguration | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/autorenewal/allowed` | getCertAutoRenewalAllowed | Certificate Management - Device | read | Verified live | 3 rows |
| POST | `/dataservice/certificate/certdetails` | getCertDetails | Certificate Management - Device | read | Read (needs input) | query body |
| POST | `/dataservice/certificate/controller/bulkcsr` | generateCSRforAllController | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/controller/certstatus` | getControllerCertStatus | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/controller/download/csr` | downloadControllerCSR | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/csr/details` | getCSRViewRightMenus | Certificate Management - Device | read | Verified live | 6 rows |
| GET | `/dataservice/certificate/data/controller/list` | getCertificateControllerListData | Certificate Management - Device | read | Verified live | 4 rows |
| GET | `/dataservice/certificate/data/vedge/list` | getCertificateVedgeListData | Certificate Management - Device | read | Verified live | 47 rows |
| GET | `/dataservice/certificate/device/details` | getDeviceViewRightMenus | Certificate Management - Device | read | Verified live | 2 rows |
| POST | `/dataservice/certificate/device/invalidate` | invalidateDevice | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/device/list` | getDevicesList | Certificate Management - Device | read | Verified live | 51 rows |
| POST | `/dataservice/certificate/device/stage` | stageDevice | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/forcesync/rootCert` | forceSyncRootCert | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/generate/controller/csr/async` | generateCSRAsync | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/generate/csr` | generateCSR | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/generate/csr/bulk/controller/async` | generateCSRBulkControllerAsync | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/generate/csr/bulk/edge/async` | generateCSRBulkEdgeAsync | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/generate/enterprise/csr/vedge` | generateEnterpriseCSR | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/generate/wanedge/csr` | generateEdgeDeviceCSR | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/getDeviceData/signedCerts` | getDeviceDataFromSignedCerts | Certificate Management - Device | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| POST | `/dataservice/certificate/install/signedCert` | installCertificate | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/install/upload/signedCerts` | installBulkSignedCerts | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/certificate/jks` | updateJks | Certificate Management - Device | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/list/status` | getListStatus | Certificate Management - Device | read | Verified live | object |
| GET | `/dataservice/certificate/mthub/list` | setvSmartMtHubList | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/pullDeviceList` | pullDeviceList | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/pullDeviceList/done` | pullDeviceListDone | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/quarantine/banner` | getQuarantineBanner | Certificate Management - Device | read | Verified live | object |
| GET | `/dataservice/certificate/record` | getCertificateData | Certificate Management - Device | read | Verified live | 4 rows |
| POST | `/dataservice/certificate/reschedule/certificate/job` | reScheduleCertificateJob | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/reset/rsa` | resetRSA | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/revoke/enterprise/certificate` | decommissionEnterpriseCSRForVedge | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/rootcertchains` | getRootCertChains | Certificate Management - Device | read | Read (needs input) | query: action |
| PUT | `/dataservice/certificate/rootcertchains` | saveRootCertChain | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/rootcertificate` | getRootCertificate | Certificate Management - Device | read | Verified live | object |
| GET | `/dataservice/certificate/rsakeylengthdefault` | rsaKeyLength2048ForAllDevices | Certificate Management - Device | read | Verified live | object |
| POST | `/dataservice/certificate/save/vedge/list` | saveVEdgeList | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/stagingCert/status` | stagingCertificateStatus | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/stats/detail` | getCertificateDetail | Certificate Management - Device | read | Verified live | 4 rows |
| GET | `/dataservice/certificate/stats/summary` | getCertificateStats | Certificate Management - Device | read | Verified live | 1 rows |
| GET | `/dataservice/certificate/syncvbond` | syncvBond | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/tokengeneratedlist` | getTokenList | Certificate Management - Device | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/certificate/update/controller/validity` | updateControllerValidity | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/vedge` | getInstalledCert | Certificate Management - Device | read | Read (needs input) | query: uuid |
| GET | `/dataservice/certificate/vedge/csr` | getvEdgeCSR | Certificate Management - Device | read | Read (needs input) | query: uuid |
| POST | `/dataservice/certificate/vedge/download/csr` | downloadVedgeCSR | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/vedge/list` | getvEdgeList | Certificate Management - Device | read | Verified live | 47 rows |
| POST | `/dataservice/certificate/vedge/list` | setvEdgeList | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/view` | getView | Certificate Management - Device | read | Verified live | 3 rows |
| GET | `/dataservice/certificate/vmanage/selfsignedcert` | getSelfSignedCert | Certificate Management - Device | read | Verified live | object |
| GET | `/dataservice/certificate/vsmart/list` | getvSmartList | Certificate Management - Device | read | Verified live | 4 rows |
| POST | `/dataservice/certificate/vsmart/list` | setvSmartList | Certificate Management - Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/certificate/enterprise/estclient/gencsr` | enterpriseESTClientGenCSR | Certificate Management - vManage | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/enterprise/estclient/getcsr` | enterpriseESTClientGetCSR | Certificate Management - vManage | read | Verified live | object |
| POST | `/dataservice/certificate/enterprise/estclient/install/signedCert` | enterpriseESTClientInstallCertificate | Certificate Management - vManage | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/certificate/orgname/from-config` | getOrgNameFromConfig | Certificate Management - vManage | read | Verified live | object |
| GET | `/dataservice/setting/configuration/webserver/certificate` | showInfo | Certificate Management - vManage | read | Verified live | object |
| POST | `/dataservice/setting/configuration/webserver/certificate` | getCSR_CertificateManagementVmanage_4404 | Certificate Management - vManage | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/setting/configuration/webserver/certificate` | importCertificate | Certificate Management - vManage | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/setting/configuration/webserver/certificate-signing-request` | getGeneratedAsync | Certificate Management - vManage | read | Verified live | object |
| POST | `/dataservice/setting/configuration/webserver/certificate-signing-request/async` | generateCSRASync | Certificate Management - vManage | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/setting/configuration/webserver/certificate/async` | importCertificateAsync | Certificate Management - vManage | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/setting/configuration/webserver/certificate/getcertificate` | getCertificate_CertificateManagementVmanage_5903 | Certificate Management - vManage | read | Verified live | object |
| POST | `/dataservice/setting/configuration/webserver/certificate/renew` | renewWebServerCertificate | Certificate Management - vManage | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/cisco-software/eula` | fetchEulaStatus | Cisco Software | read | Verified live | object |
| POST | `/dataservice/v1/cisco-software/imagemetadata` | getImageMetadataFromCCO | Cisco Software | read | Read (needs input) | query: imageType |
| GET | `/dataservice/v1/cisco-software/user` | getCiscoSoftwareUser | Cisco Software | read (deprecated) | Verified live | object |
| GET | `/dataservice/v1/device-authorize/authentication` | getAuthUrl | Cisco Software | read (deprecated) | Verified live | object |
| POST | `/dataservice/v1/device-authorize/token/{deviceCode}` | getAuthToken | Cisco Software | blocked (deprecated) | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/v1/device-authorize/validtoken` | getTokenValidity | Cisco Software | blocked (deprecated) | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/client/token` | getCsrfToken | Client - Security | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/client/server` | createServerInfo_ClientUi_1403 | Client - UI | read | Verified live | object |
| POST | `/dataservice/sdavc/cloud-sourced/compliance` | complianceWithExtendedApplications | Cloud Sourced Application Compliance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sdavc/cloud-sourced/compliance/application` | applicationComplianceWithExtendedApplications | Cloud Sourced Application Compliance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/cloud-sourced` | getExtendedApplications | Cloud Sourced Application Maintenance | read | Verified live | 10 rows |
| POST | `/dataservice/sdavc/cloud-sourced` | saveExtendedApplications | Cloud Sourced Application Maintenance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/cloud-sourced/apply/status/{uuid}` | getDeviceComplianceStatus_CloudSourcedApplicationMaintenance_4003 | Cloud Sourced Application Maintenance | read | Read (needs IDs) | path: uuid |
| POST | `/dataservice/sdavc/cloud-sourced/approve` | approveExtendedApplications | Cloud Sourced Application Maintenance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/clusterManagement/{tenantId}/connectedDevices/{vmanageIP}` | getConnectedDevicesPerTenant | Cluster Management | read | Read (needs IDs) | path: tenantId, vmanageIP |
| GET | `/dataservice/clusterManagement/clusterLocked` | checkIfClusterLocked | Cluster Management | read | Verified live | object |
| GET | `/dataservice/clusterManagement/clusterworkflow/version` | getClusterWorkflowVersion | Cluster Management | read | Verified live | object |
| POST | `/dataservice/clusterManagement/configure` | configureVmanage | Cluster Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/clusterManagement/connectedDevices/{vmanageIP}` | getConnectedDevices | Cluster Management | read | Read (needs IDs) | path: vmanageIP |
| GET | `/dataservice/clusterManagement/health/details` | healthDetails | Cluster Management | read | Verified live | 1 rows |
| GET | `/dataservice/clusterManagement/health/status` | healthStatusInfo | Cluster Management | read | Verified live | 2 rows |
| GET | `/dataservice/clusterManagement/health/summary` | healthSummary | Cluster Management | read | Verified live | 1 rows |
| GET | `/dataservice/clusterManagement/host/health/status` | hostHealthStatus | Cluster Management | read | Verified live | 2 rows |
| GET | `/dataservice/clusterManagement/iplist/{vmanageID}` | getConfiguredIPList | Cluster Management | read | Read (needs IDs) | path: vmanageID |
| GET | `/dataservice/clusterManagement/isready` | isClusterReady | Cluster Management | read (deprecated) | Verified live | object |
| GET | `/dataservice/clusterManagement/list` | listVmanages | Cluster Management | read | Verified live | 1 rows |
| GET | `/dataservice/clusterManagement/nodeProperties` | nodeProperties | Cluster Management | read | Verified live | object |
| POST | `/dataservice/clusterManagement/remove` | removeVmanage | Cluster Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/clusterManagement/replicateAndRebalance` | performReplicationAndRebalanceOfKafkaPartitions | Cluster Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/clusterManagement/setup` | addVmanage | Cluster Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/clusterManagement/setup` | editVmanage | Cluster Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/clusterManagement/tenancy/mode` | getTenancyMode | Cluster Management | read | Verified live | object |
| POST | `/dataservice/clusterManagement/tenancy/mode` | setTenancyMode | Cluster Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/clusterManagement/tenantList` | getTenantsList | Cluster Management | read | Verified live | 1 rows |
| POST | `/dataservice/clusterManagement/userCreds` | addOrUpdateUserCredentials | Cluster Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/clusterManagement/vManage/details/{vmanageIP}` | getVManageDetails | Cluster Management | read | Read (needs IDs) | path: vmanageIP |
| GET | `/dataservice/colocation/monitor/device/vnf` | getvnfByDeviceId | Colocation | read (deprecated) | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: Invalid deviceId |
| POST | `/dataservice/colocation/monitor/vnf/action` | vnfActions | Colocation | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/colocation/monitor/vnf/alarms` | getVNFEventsCountDetail | Colocation | read (deprecated) | Read (needs input) | query: user_group |
| GET | `/dataservice/colocation/monitor/vnf/alarms/count` | getVNFAlarmCount | Colocation | read (deprecated) | Read (needs input) | query: user_group |
| GET | `/dataservice/colocation/monitor/vnf/events` | getVNFEventsDetail | Colocation | read (deprecated) | Read (needs input) | query: vnfName |
| GET | `/dataservice/colocation/monitor/vnf/interface` | getVNFInterfaceDetail | Colocation | read (deprecated) | Read (needs input) | query: vnfName |
| GET | `/dataservice/device/bytenants` | getTenantsDevicesAndSites | Compliance - Device Details | read | Live error (rejected) | vManage rejected the session (401) |
| GET | `/dataservice/device/compliance` | getComplianceDetails | Compliance - Device Details | read | Verified live | object |
| GET | `/dataservice/device/compliance/summary` | getComplianceSummary | Compliance - Device Details | read | Verified live | object |
| POST | `/dataservice/device/initialize-version-compliance` | initializeVersionCompliance | Compliance - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/advancedinspectionprofile` | getDefinitions_ConfigurationAdvancedInspectionProfileDefinition_5303 | Configuration - Advanced Inspection Profile Definition | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/advancedinspectionprofile` | createPolicyDefinition_ConfigurationAdvancedInspectionProfileDefinition_5304 | Configuration - Advanced Inspection Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/advancedinspectionprofile/{id}` | deletePolicyDefinition_ConfigurationAdvancedInspectionProfileDefinition_5806 | Configuration - Advanced Inspection Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/advancedinspectionprofile/{id}` | getPolicyDefinition_ConfigurationAdvancedInspectionProfileDefinition_5803 | Configuration - Advanced Inspection Profile Definition | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/advancedinspectionprofile/{id}` | editPolicyDefinition_ConfigurationAdvancedInspectionProfileDefinition_5803 | Configuration - Advanced Inspection Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/advancedinspectionprofile/bulk` | savePolicyDefinitionInBulk_ConfigurationAdvancedInspectionProfileDefinition_5803 | Configuration - Advanced Inspection Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/advancedinspectionprofile/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationAdvancedInspectionProfileDefinition_6703 | Configuration - Advanced Inspection Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/advancedinspectionprofile/preview` | previewPolicyDefinition_ConfigurationAdvancedInspectionProfileDefinition_6104 | Configuration - Advanced Inspection Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/advancedinspectionprofile/preview/{id}` | previewPolicyDefinitionById_ConfigurationAdvancedInspectionProfileDefinition_6603 | Configuration - Advanced Inspection Profile Definition | read | Read (needs IDs) | path: id |
| GET | `/dataservice/app-registry/app` | getAllAppList | Configuration - App Registry | read | Verified live | 1568 rows |
| PUT | `/dataservice/app-registry/app/bulk/endpoint` | editAppInBulkByUuid | Configuration - App Registry | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/app-registry/app/category` | getAppListCategory | Configuration - App Registry | read | Verified live | object |
| GET | `/dataservice/app-registry/app/discoveredapps` | getNetworkDiscoveredApps | Configuration - App Registry | read | Verified live | 0 rows |
| GET | `/dataservice/app-registry/app/filtermap` | getAttributeMappingForApps | Configuration - App Registry | read | Verified live | 1 rows |
| GET | `/dataservice/app-registry/application/{app-uuid}` | getAppByUuid | Configuration - App Registry | read | Read (needs IDs) | path: app-uuid |
| GET | `/dataservice/app-registry/saasfeed` | getActiveSaasFeeds | Configuration - App Registry | read | Verified live | 34 rows |
| GET | `/dataservice/app-registry/saasfeed/app/{feedId}` | getAllSaasFeedForSelectedApp | Configuration - App Registry | read | Read (needs IDs) | path: feedId |
| PUT | `/dataservice/app-registry/saasfeed/app/configure` | disableorEnableSaasFeedForSelectedApp | Configuration - App Registry | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/networkdesign/circuit` | getCircuits | Configuration - Circuits | read (deprecated) | Verified live | 0 rows |
| POST | `/dataservice/networkdesign/circuit` | createCircuit | Configuration - Circuits | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/networkdesign/circuit/{id}` | deleteCircuit | Configuration - Circuits | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/cor/externalId` | getExternalId | Configuration - Cloud On Ramp | read (deprecated) | Verified live | object |
| GET | `/dataservice/v1/cloudonramp/saas` | getCloudOnRampSaasStatus | Configuration - Cloud On Ramp SaaS | read | Verified live | object |
| GET | `/dataservice/v1/cloudonramp/saas/appSettingsStatus` | getCorSaasAppSettingsStatus | Configuration - Cloud On Ramp SaaS | read | Verified live | 0 rows |
| PUT | `/dataservice/v1/cloudonramp/saas/appSettingsStatus` | putCorSaasAppSettingsStatus | Configuration - Cloud On Ramp SaaS | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/cloudonramp/saas/cloud_tunnels` | getCloudTunnelList | Configuration - Cloud On Ramp SaaS | read | Read (needs input) | query: deviceIp |
| GET | `/dataservice/v1/cloudonramp/saas/configuration` | getPolicyGroupsWithCorSaasApps | Configuration - Cloud On Ramp SaaS | read | Verified live | 1 rows |
| GET | `/dataservice/v1/cloudonramp/saas/devices` | getCorSitesPerDevice | Configuration - Cloud On Ramp SaaS | read | Verified live | object |
| GET | `/dataservice/v1/cloudonramp/saas/inactivesites` | getInactiveCorSaasSites | Configuration - Cloud On Ramp SaaS | read | Verified live | object |
| GET | `/dataservice/v1/cloudonramp/saas/legacydevicelist` | getLegacyDeviceList | Configuration - Cloud On Ramp SaaS | read | Verified live | object |
| GET | `/dataservice/v1/cloudonramp/saas/status` | getCorSaasStatusPerDevice | Configuration - Cloud On Ramp SaaS | read | Read (needs input) | query: deviceIp |
| GET | `/dataservice/v1/cloudonramp/saas/webexsyncstatus` | getWebexSyncStatus | Configuration - Cloud On Ramp SaaS | read | Verified live | object |
| DELETE | `/dataservice/cloudservices/app/webex` | deleteWebexPrefixLists | Configuration - CloudExpress | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/cloudservices/app/webex` | enableWebex_ConfigurationCloudexpress_2404 | Configuration - CloudExpress | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/cloudservices/app/webex` | enableWebex_ConfigurationCloudexpress_2403 | Configuration - CloudExpress | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/cloudx` | getCloudXStatus | Configuration - CloudExpress | read | Verified live | 0 rows |
| POST | `/dataservice/template/cloudx/addcloudx/{type}` | addCloudxType | Configuration - CloudExpress | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/cloudx/attachedclient` | getAttachedClientList | Configuration - CloudExpress | read | Verified live | 0 rows |
| GET | `/dataservice/template/cloudx/attacheddia` | getAttachedDiaList | Configuration - CloudExpress | read | Verified live | 0 rows |
| GET | `/dataservice/template/cloudx/attachedgateway` | getAttachedGatewayList | Configuration - CloudExpress | read | Verified live | 0 rows |
| GET | `/dataservice/template/cloudx/availableapps` | getCloudXAvailableApps | Configuration - CloudExpress | read | Verified live | 14 rows |
| GET | `/dataservice/template/cloudx/clientlist` | getSiteList | Configuration - CloudExpress | read | Verified live | 3 rows |
| GET | `/dataservice/template/cloudx/dialist` | getDiaList | Configuration - CloudExpress | read | Verified live | 3 rows |
| GET | `/dataservice/template/cloudx/gatewaylist` | getGatewayList | Configuration - CloudExpress | read | Verified live | 3 rows |
| POST | `/dataservice/template/cloudx/interfaces` | addCloudxInterfaces | Configuration - CloudExpress | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/cloudx/manage/apps` | getApps | Configuration - CloudExpress | read | Verified live | 0 rows |
| POST | `/dataservice/template/cloudx/manage/apps` | addApps | Configuration - CloudExpress | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/cloudx/manage/apps` | editApps | Configuration - CloudExpress | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/cloudx/status` | sitePerApp | Configuration - CloudExpress | read | Read (needs input) | query: appName |
| GET | `/dataservice/v1/config-group` | GetConfigGroupBySolution | Configuration - Configuration Group | read | Verified live | object |
| POST | `/dataservice/v1/config-group` | CreateConfigGroup | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/config-group/{configGroupId}` | DeleteConfigGroup | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/config-group/{configGroupId}` | GetConfigGroup | Configuration - Configuration Group | read | Read (needs IDs) | path: configGroupId |
| PUT | `/dataservice/v1/config-group/{configGroupId}` | EditConfigGroup | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/config-group/{configGroupId}/device/{deviceId}/preview` | getConfigGroupDeviceConfigurationPreview | Configuration - Configuration Group | read | Read (needs IDs) | path: configGroupId, deviceId |
| DELETE | `/dataservice/v1/config-group/{configGroupId}/device/associate` | DeleteConfigGroupAssociation | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/config-group/{configGroupId}/device/associate` | GetConfigGroupAssociation | Configuration - Configuration Group | read | Read (needs IDs) | path: configGroupId |
| POST | `/dataservice/v1/config-group/{configGroupId}/device/associate` | CreateConfigGroupAssociation | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/v1/config-group/{configGroupId}/device/associate` | UpdateConfigGroupAssociation | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/config-group/{configGroupId}/device/deploy` | deployConfigGroup | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/config-group/{configGroupId}/device/variables` | getConfigGroupDeviceVariables | Configuration - Configuration Group | read | Read (needs IDs) | path: configGroupId |
| POST | `/dataservice/v1/config-group/{configGroupId}/device/variables` | fetchConfigGroupDeviceVariables | Configuration - Configuration Group | read | Read (needs IDs) | path: configGroupId |
| PUT | `/dataservice/v1/config-group/{configGroupId}/device/variables` | createConfigGroupDeviceVariables | Configuration - Configuration Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/config-group/{configGroupId}/device/variables/schema` | getConfigGroupDeviceVariablesSchema | Configuration - Configuration Group | read | Read (needs IDs) | path: configGroupId |
| GET | `/dataservice/v1/config-group/{configGroupId}/rules` | getRuleAssociationByConfigGroupId | Configuration - Configuration Group | read | Read (needs IDs) | path: configGroupId |
| DELETE | `/dataservice/v1/control-component/devices/{deviceId}/settings` | deleteControlComponentDeviceSpecificSettings | Configuration - Control Component Setting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/control-component/devices/{deviceId}/settings` | getControlComponentDeviceSpecificSettings | Configuration - Control Component Setting | read | Read (needs IDs) | path: deviceId |
| POST | `/dataservice/v1/control-component/devices/{deviceId}/settings` | createControlComponentDeviceSpecificSettings | Configuration - Control Component Setting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/control-component/devices/{deviceId}/settings/config-to-settings` | controlComponentRunningConfigToDeviceSpecificSettings | Configuration - Control Component Setting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/control-component/devices/{deviceId}/settings/preview` | getPreviewCliForControlComponent | Configuration - Control Component Setting | read | Read (needs IDs) | path: deviceId |
| POST | `/dataservice/v1/control-component/devices/settings/deploy` | deployControlComponentSettingsToDevice | Configuration - Control Component Setting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/control-component/network-settings` | deleteControlComponentCommonSettings | Configuration - Control Component Setting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/control-component/network-settings` | getControlComponentCommonSettings | Configuration - Control Component Setting | read | Verified live | object |
| POST | `/dataservice/v1/control-component/network-settings` | createControlComponentCommonSettings | Configuration - Control Component Setting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/status/{processId}` | findStatus | Configuration - Dashboard Status | read | Read (needs IDs) | path: processId |
| POST | `/dataservice/device/action/status/cancel/{processId}` | cancelPendingTasks | Configuration - Dashboard Status | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/status/clean` | cleanStatus | Configuration - Dashboard Status | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/action/status/clear` | deleteStatus | Configuration - Dashboard Status | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/status/tasks` | findRunningTasks | Configuration - Dashboard Status | read | Verified live | object |
| GET | `/dataservice/device/action/status/tasks/activeCount` | getActiveTaskCount | Configuration - Dashboard Status | read | Verified live | object |
| GET | `/dataservice/device/action/status/tasks/clean` | getCleanStatus | Configuration - Dashboard Status | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/cancel` | processCancelTask | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/changepartition` | generateChangePartitionInfo | Configuration - Device Actions | read | Verified live | deviceId=<edge>: 1 rows |
| POST | `/dataservice/device/action/changepartition` | processChangePartition | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/deactivate` | generateDeactivateInfo | Configuration - Device Actions | read | Verified live | deviceId=<edge>: 1 rows |
| POST | `/dataservice/device/action/deactivate` | processDeactivateSmu | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/defaultpartition` | processDefaultPartition | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/filter/vpn` | createFilterVPNList | Configuration - Device Actions | read | Verified live | object |
| POST | `/dataservice/device/action/image-download` | initiateImageDownload | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/image-remove` | processRemoveSoftwareImage | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/install` | generateInstallInfo | Configuration - Device Actions | read | Verified live | deviceId=<edge>: 1 rows |
| POST | `/dataservice/device/action/install` | processInstall | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/install/devices/{deviceType}` | generateDeviceList | Configuration - Device Actions | read | Read (needs IDs) | path: deviceType |
| GET | `/dataservice/device/action/list` | generateDeviceActionList | Configuration - Device Actions | read | Verified live | object |
| POST | `/dataservice/device/action/lxcactivate` | processLxcActivate | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/lxcdelete` | processLxcDelete | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/lxcinstall` | processLxcInstall | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/lxcreload` | processLxcReload | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/lxcreset` | processLxcReset | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/lxcupgrade` | processLxcUpgrade | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/reboot` | generateRebootInfo | Configuration - Device Actions | read | Verified live | deviceId=<edge>: 1 rows |
| POST | `/dataservice/device/action/reboot` | processReboot | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/reboot/devices/{deviceType}` | generateRebootDeviceList | Configuration - Device Actions | read | Read (needs IDs) | path: deviceType |
| GET | `/dataservice/device/action/rediscover` | generateRediscoverInfo | Configuration - Device Actions | read | Verified live | 17 rows |
| POST | `/dataservice/device/action/rediscover` | reDiscoverDevices | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/rediscoverall` | reDiscoverAllDevice | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/removepartition` | generateRemovePartitionInfo | Configuration - Device Actions | read | Verified live | deviceId=<edge>: 1 rows |
| POST | `/dataservice/device/action/removepartition` | processRemovePartition | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/action/security/amp/apikey/{uuid}` | processDeleteAmpApiKey | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/security/amp/rekey` | processAmpApiReKey | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/security/apikey/{uuid}` | testApiKey | Configuration - Device Actions | read | Read (needs IDs) | path: uuid |
| GET | `/dataservice/device/action/startmonitor` | triggerPendingTasksMonitoring | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/test/ioxconfig/{deviceIP}` | testIoxConfig | Configuration - Device Actions | read (deprecated) | Read (needs IDs) | path: deviceIP |
| POST | `/dataservice/device/action/uniquevpnlist` | createUniqueVPNList | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/vnfinstall` | processVnfInstall | Configuration - Device Actions | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/vpn` | createVPNList | Configuration - Device Actions | read | Verified live | object |
| GET | `/dataservice/device/action/ztp/upgrade` | getZTPUpgradeConfig | Configuration - Device Actions | read | Verified live | object |
| POST | `/dataservice/device/action/ztp/upgrade` | postprocessZTPUpgradeConfigSetting | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/ztp/upgrade/setting` | getZTPUpgradeConfigSetting | Configuration - Device Actions | read | Verified live | 0 rows |
| POST | `/dataservice/device/action/ztp/upgrade/setting` | processZTPUpgradeConfigSetting | Configuration - Device Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/history` | getStatDataRawData_ConfigurationDeviceConfigHistory_1503 | Configuration - Device Config History | read | Verified live | 0 rows |
| POST | `/dataservice/device/history` | getStatsRawData_ConfigurationDeviceConfigHistory_1504 | Configuration - Device Config History | read | Read (needs input) | query body |
| GET | `/dataservice/device/history/aggregation` | getAggregationDataByQuery_ConfigurationDeviceConfigHistory_2703 | Configuration - Device Config History | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/device/history/aggregation` | getPostAggregationDataByQuery_ConfigurationDeviceConfigHistory_2704 | Configuration - Device Config History | read | Read (needs input) | query body |
| GET | `/dataservice/device/history/config` | getLastThousandConfigList | Configuration - Device Config History | read | Read (needs input) | query: query |
| GET | `/dataservice/device/history/config/{config_id}` | getDeviceConfig | Configuration - Device Config History | read | Read (needs IDs) | path: config_id |
| GET | `/dataservice/device/history/config/diff/list` | getConfigDiff | Configuration - Device Config History | read | Read (needs input) | query: config_id1 |
| GET | `/dataservice/device/history/csv` | getStatDataRawDataAsCSV_ConfigurationDeviceConfigHistory_1903 | Configuration - Device Config History | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/device/history/doccount` | getCount_ConfigurationDeviceConfigHistory_2403 | Configuration - Device Config History | read | Read (needs input) | query: query |
| POST | `/dataservice/device/history/doccount` | getCountPost_ConfigurationDeviceConfigHistory_2404 | Configuration - Device Config History | read | Verified live | object |
| GET | `/dataservice/device/history/fields` | getStatDataFields_ConfigurationDeviceConfigHistory_2203 | Configuration - Device Config History | read | Verified live | 5 rows |
| GET | `/dataservice/device/history/page` | getStatsPaginationRawData_ConfigurationDeviceConfigHistory_2003 | Configuration - Device Config History | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/device/history/page` | getPostStatsPaginationRawData_ConfigurationDeviceConfigHistory_2004 | Configuration - Device Config History | read | Read (needs input) | query body |
| GET | `/dataservice/device/history/query/fields` | getStatQueryFields_ConfigurationDeviceConfigHistory_2803 | Configuration - Device Config History | read | Verified live | 1 rows |
| GET | `/dataservice/device/action/firmware` | getFirmwareImages | Configuration - Device Firmware Update | read (deprecated) | Verified live | 0 rows |
| POST | `/dataservice/device/action/firmware-upgrade` | remoteFirmwareImageUpgrade | Configuration - Device Firmware Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/firmware-upgrade/devices` | getFirmwareDevices | Configuration - Device Firmware Update | read | Verified live | 0 rows |
| GET | `/dataservice/device/action/firmware-upgrade/remote` | getFirmwareRemoteImage | Configuration - Device Firmware Update | read | Verified live | 0 rows |
| POST | `/dataservice/device/action/firmware-upgrade/remote` | processFirmwareRemoteImage | Configuration - Device Firmware Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/action/firmware/{versionId}` | deleteFirmwareImage | Configuration - Device Firmware Update | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/firmware/{versionId}` | getFirmwareImageDetails | Configuration - Device Firmware Update | read (deprecated) | Read (needs IDs) | path: versionId |
| POST | `/dataservice/device/action/firmware/activate` | activateFirmwareImage | Configuration - Device Firmware Update | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/firmware/devices` | getDevicesFWUpgrade | Configuration - Device Firmware Update | read (deprecated) | Verified live | 0 rows |
| POST | `/dataservice/device/action/firmware/install` | installFirmwareImage | Configuration - Device Firmware Update | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/firmware/remove` | removeFirmwareImage | Configuration - Device Firmware Update | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/system/device` | createDevice | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/{deviceCategory}` | getDevicesDetails | Configuration - Device Inventory | read | Read (needs IDs) | path: deviceCategory |
| DELETE | `/dataservice/system/device/{uuid}` | deleteDevice_ConfigurationDeviceInventory_2106 | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/system/device/{uuid}` | editDevice | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/system/device/{uuid}/unlock` | unlockDevice | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/bootstrap/device/{uuid}` | generateBootstrapConfigForVedge | Configuration - Device Inventory | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/system/device/bootstrap/devices` | generateBootstrapConfigForVedges | Configuration - Device Inventory | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/system/device/bootstrap/download/{id}` | getBootstrapConfigZip | Configuration - Device Inventory | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/system/device/bootstrap/generic/devices` | generateGenericBootstrapConfigForVedges | Configuration - Device Inventory | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/system/device/claimDevices` | claimDevices | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/controllers/vedge/status` | getControllerVEdgeSyncStatus_ConfigurationDeviceInventory_3903 | Configuration - Device Inventory | read | Verified live | 1 rows |
| PUT | `/dataservice/system/device/decommission/{uuid}` | decommissionVedgeCloud | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/devicesWithoutSubjectSudi` | devicesWithoutSubjectSudi | Configuration - Device Inventory | read | Verified live | 0 rows |
| POST | `/dataservice/system/device/fileupload` | formPost | Configuration - Device Inventory | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| POST | `/dataservice/system/device/generate-payg` | validateUser | Configuration - Device Inventory | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| POST | `/dataservice/system/device/lifecycle/management/{uuid}` | setLifeCycle | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/management/systemip` | getManagementSystemIPInfo_ConfigurationDeviceInventory_3403 | Configuration - Device Inventory | read | Verified live | 51 rows |
| PUT | `/dataservice/system/device/migrateDevice/{uuid}` | migrateDevice | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/system/device/quickconnect/smartaccount/sync` | getSmartAccountDevices | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/system/device/reset/{uuid}` | resetVedgeCloud | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/rma/candidates/{deviceType}` | getRMACandidates | Configuration - Device Inventory | read | Read (needs IDs) | path: deviceType |
| GET | `/dataservice/system/device/rootcertchain/status` | getRootCertStatusAll | Configuration - Device Inventory | read | Read (needs input) | query: state |
| GET | `/dataservice/system/device/selfsignedcert/iscreated` | checkSelfSignedCert_ConfigurationDeviceInventory_3903 | Configuration - Device Inventory | read | Verified live | object |
| POST | `/dataservice/system/device/smartaccount/authenticate` | smartAccountAuthenticate | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/system/device/smartaccount/sync` | syncDevices | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/sync/rootcertchain` | syncRootCertChain | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/tenant/management/systemip` | getTenantManagementSystemIPs | Configuration - Device Inventory | read | Live error (HTTP 403) | vManage API error 403: Permission denied |
| GET | `/dataservice/system/device/type/{deviceCategory}` | getCloudDockDataBasedOnDeviceType | Configuration - Device Inventory | read (deprecated) | Read (needs IDs) | path: deviceCategory |
| GET | `/dataservice/system/device/type/{deviceCategory}/defaultConfig` | getCloudDockDefaultConfigBasedOnDeviceType | Configuration - Device Inventory | read (deprecated) | Read (needs IDs) | path: deviceCategory |
| GET | `/dataservice/system/device/unclaimedDevices` | getAllUnclaimedDevices | Configuration - Device Inventory | read | Verified live | 0 rows |
| PUT | `/dataservice/system/device/updateDeviceSubjectSUDI/{uuid}` | updateDeviceSubjectSUDI | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/device/vedgedetection` | checkvEdgeDevicePresence | Configuration - Device Inventory | read | Verified live | object |
| DELETE | `/dataservice/system/device/vmanagerootca/{uuid}` | invalidateVmanageRootCA | Configuration - Device Inventory | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/action/firmware-upgrade/{versionId}` | deleteFirmwareUpgardeRemoteImage | Configuration - Device Software Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/device/action/firmware-upgrade/remote/{versionId}` | editFirmwareUpgardeRemoteImage | Configuration - Device Software Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/software/package` | installPkg | Configuration - Device Software Update | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/device/action/software/package/{fileName}` | downloadPackageFile | Configuration - Device Software Update | read | Read (needs IDs) | path: fileName |
| POST | `/dataservice/device/action/software/package/{imageType}` | processSoftwareImage | Configuration - Device Software Update | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/device/action/software/package/{versionId}/metadata` | getImageMetadata | Configuration - Device Software Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/device/action/software/package/{versionId}/metadata` | editImageMetadata | Configuration - Device Software Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/software/package/imageCount` | getUploadImagesCount | Configuration - Device Software Update | read | Verified live | object |
| POST | `/dataservice/device/action/software/package/ngfwsignature/{type}/mode/manual` | addNgfwSecurityPackage | Configuration - Device Software Update | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| POST | `/dataservice/device/action/software/package/ngfwsignature/{type}/mode/remote` | addNgfwSecurityPackageRemote | Configuration - Device Software Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/software/package/signature/{utdsignature}` | generateUtdImageData | Configuration - Device Software Update | read | Read (needs IDs) | path: utdsignature |
| POST | `/dataservice/device/action/software/package/utdsignature/{type}/mode/auto` | addUtdRemoteImage | Configuration - Device Software Update | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/action/software/package/utdsignature/{type}/mode/manual` | uploadUtdImage | Configuration - Device Software Update | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/sslproxy/certificate` | getProxyCertOfEdge | Configuration - Device SSL Proxy Certificate Management | read | Verified live | deviceId=<edge>: object |
| PUT | `/dataservice/sslproxy/certificate` | updateCertificate | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sslproxy/certificate/wanedge/{deviceId}` | addWANEdge | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sslproxy/certificates` | uploadCertificiates | Configuration - Device SSL Proxy Certificate Management | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/sslproxy/csr` | getSslProxyCSR | Configuration - Device SSL Proxy Certificate Management | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: no CSR found for uuid <controller> |
| POST | `/dataservice/sslproxy/devicecertificates` | getAllDeviceCertificates | Configuration - Device SSL Proxy Certificate Management | read | Read (needs input) | query body |
| POST | `/dataservice/sslproxy/devicecsr` | getAllDeviceCSR | Configuration - Device SSL Proxy Certificate Management | read | Read (needs input) | query body |
| POST | `/dataservice/sslproxy/generate/csr/sslproxy` | generateSslProxyCSR | Configuration - Device SSL Proxy Certificate Management | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sslproxy/generate/vmanage/csr` | generateSSLProxyCSR | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sslproxy/list` | getSslProxyList | Configuration - Device SSL Proxy Certificate Management | read | Verified live | object |
| POST | `/dataservice/sslproxy/renew` | renewCertificate | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sslproxy/revoke` | revokeCertificate | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sslproxy/revokerenew` | revokeRenewCertificate | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sslproxy/settings/certificate` | getCertificateState | Configuration - Device SSL Proxy Certificate Management | read | Verified live | object |
| GET | `/dataservice/sslproxy/settings/enterprise/certificate` | getEnterpriseCertificate | Configuration - Device SSL Proxy Certificate Management | read | Verified live | object |
| POST | `/dataservice/sslproxy/settings/enterprise/certificate` | setEnterpriseCert | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sslproxy/settings/enterprise/rootca` | getVManageEnterpriseRootCertificate | Configuration - Device SSL Proxy Certificate Management | read | Verified live | object |
| POST | `/dataservice/sslproxy/settings/enterprise/rootca` | setEnterpriseRootCaCert | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sslproxy/settings/vmanage/certificate` | getvManageCertificate | Configuration - Device SSL Proxy Certificate Management | read | Verified live | 0 rows |
| POST | `/dataservice/sslproxy/settings/vmanage/certificate` | setvManageintermediateCert | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sslproxy/settings/vmanage/csr` | getvManageCSR | Configuration - Device SSL Proxy Certificate Management | read | Verified live | object |
| GET | `/dataservice/sslproxy/settings/vmanage/rootca` | getvManageRootCA | Configuration - Device SSL Proxy Certificate Management | read | Verified live | 0 rows |
| POST | `/dataservice/sslproxy/settings/vmanage/rootca` | setvManageRootCA | Configuration - Device SSL Proxy Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/config/attachBootStrap` | pushMasterTemplate_ConfigurationDeviceTemplate_3904 | Configuration - Device Template | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/template/device/config/attachcli` | pushCLITemplate | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/config/attachcloudx` | pushCloudxConfig | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/device/config/attachcloudx` | editCloudxConfig | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/device/config/attached/{masterTemplateId}` | getAttachedDeviceList | Configuration - Device Template | read | Read (needs IDs) | path: masterTemplateId |
| GET | `/dataservice/template/device/config/attachedconfig` | getAttachedConfigToDevice | Configuration - Device Template | read | Verified live | deviceId=<edge>: object |
| POST | `/dataservice/template/device/config/attachfeature` | pushMasterTemplate_ConfigurationDeviceTemplate_3704 | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/config/attachment` | attachDeviceTemplate | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/device/config/available/{masterTemplateId}` | getDeviceListByMasterTemplateId | Configuration - Device Template | read | Read (needs IDs) | path: masterTemplateId |
| POST | `/dataservice/template/device/config/config` | getDeviceConfigurationPreview | Configuration - Device Template | read | Read (needs input) | query body |
| POST | `/dataservice/template/device/config/detach` | detachDeviceTemplate | Configuration - Device Template | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/config/detachcloudx` | detachSites_ConfigurationDeviceTemplate_3604 | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/config/duplicateip` | getDevicesWithDuplicateIP | Configuration - Device Template | read | Read (needs input) | query body |
| POST | `/dataservice/template/device/config/duplicatelocationname` | getDevicesWithDuplicateLocationName | Configuration - Device Template | read | Read (needs input) | query body |
| POST | `/dataservice/template/device/config/exportcsv` | createInputWithoutDevice | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/config/input` | createDeviceInput | Configuration - Device Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/config/process/input/file` | processInputCommaSepFile | Configuration - Device Template | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| POST | `/dataservice/template/device/config/quickconnectvariable` | getQuickConnectVariables | Configuration - Device Template | read | Read (needs input) | query body |
| GET | `/dataservice/template/device/config/vbond` | checkVbond | Configuration - Device Template | read | Verified live | object |
| POST | `/dataservice/template/device/config/verify` | validateTemplate | Configuration - Device Template | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/activate` | activate | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/disasterrecovery/clusterInfo` | getClusterInfo | Configuration - Disaster Recovery | read | Verified live | object |
| GET | `/dataservice/disasterrecovery/dbrestorestatus` | getConfigDBRestoreStatus | Configuration - Disaster Recovery | read | Verified live | object |
| POST | `/dataservice/disasterrecovery/deleteLocalDataCenter` | deleteLocalDC | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/deleteRemoteDataCenter` | deleteDC | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/deleteRemoteDrDetails` | deleteDr | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/deregister` | delete | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/disasterrecovery/details` | getDetails | Configuration - Disaster Recovery | read | Verified live | object |
| GET | `/dataservice/disasterrecovery/drstatus` | getDisasterRecoveryStatus | Configuration - Disaster Recovery | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Illegal request. Please check the parameter name/value","code":"DR0001","details":"Failed to fet |
| GET | `/dataservice/disasterrecovery/history` | getHistory | Configuration - Disaster Recovery | read | Verified live | object |
| GET | `/dataservice/disasterrecovery/localdc` | getLocalDataCenterState | Configuration - Disaster Recovery | read | Verified live | 0 rows |
| GET | `/dataservice/disasterrecovery/localLatestHistory` | getLocalHistory | Configuration - Disaster Recovery | read | Verified live | object |
| POST | `/dataservice/disasterrecovery/password` | update_ConfigurationDisasterRecovery_2604 | Configuration - Disaster Recovery | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/disasterrecovery/pause` | pauseDR | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/pauseLocalArbitrator` | pauseLocalArbitrator | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/pauseLocalDC` | pauseLocalDCForDR | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/pauseLocalReplication` | pauseLocalDCReplication | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/pausereplication` | disasterRecoveryPauseReplication | Configuration - Disaster Recovery | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/register` | register | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/disasterrecovery/register` | update_ConfigurationDisasterRecovery_2603 | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/disasterrecovery/remoteDcState` | getRemoteDCMembersState | Configuration - Disaster Recovery | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Failed to fetch disaster recovery cluster details","code":"DR0005","details":"Failed to fetch lo |
| GET | `/dataservice/disasterrecovery/schedule` | getDisasterRecoveryLocalReplicationSchedule | Configuration - Disaster Recovery | read | Verified live | object |
| GET | `/dataservice/disasterrecovery/status` | getdrStatus | Configuration - Disaster Recovery | read | Verified live | object |
| POST | `/dataservice/disasterrecovery/unpause` | unpauseDR | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/unpauseLocalArbitrator` | unpauseLocalArbitrator | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/unpauseLocalDC` | unpauseLocalDCForDR | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/unpauseLocalReplication` | unpauseLocalDCReplication | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/unpausereplication` | disasterRecoveryUnPauseReplication | Configuration - Disaster Recovery | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/disasterrecovery/updateDRConfigOnArbitrator` | updateDrState | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/disasterrecovery/updateReplicationCheckEnabled` | updateReplicationCheckEnabled | Configuration - Disaster Recovery | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/disasterrecovery/usernames` | get | Configuration - Disaster Recovery | read | Verified live | 0 rows |
| GET | `/dataservice/device/downloadedImages` | createSoftwareList | Configuration - Downloaded Images | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/featurecertificate/certificate` | getDeviceCertificate | Configuration - Feature Certificate | read | Live error (HTTP 500) | deviceId=<controller>: vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| PUT | `/dataservice/featurecertificate/certificate` | installFeatureCertificate | Configuration - Feature Certificate | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/featurecertificate/devicecsr` | getDeviceCsr | Configuration - Feature Certificate | read | Live error (HTTP 500) | deviceId=<controller>: vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| PUT | `/dataservice/featurecertificate/devicecsr` | genDeviceCsr | Configuration - Feature Certificate | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/featurecertificate/revoke` | revokeFeatureCertificate | Configuration - Feature Certificate | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/featurecertificate/syslogconfig` | getFeatureCaState | Configuration - Feature Certificate | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/mobility/cli` | GetMobilityCliFeatureProfile | Configuration - Feature Profile (Mobility) | read | Verified live | 0 rows |
| GET | `/dataservice/v1/feature-profile/mobility/cli/{cliId}` | GetMobilityCliFeatureProfileByCliId | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: cliId |
| GET | `/dataservice/v1/feature-profile/mobility/cli/{cliId}/config` | GetAllConfigFeatureForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: cliId |
| POST | `/dataservice/v1/feature-profile/mobility/cli/{cliId}/config` | CreateConfigFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/cli/{cliId}/config/{configId}` | DeleteConfigFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/cli/{cliId}/config/{configId}` | GetConfigFeatureForMobilityByParcelId | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: cliId, configId |
| PUT | `/dataservice/v1/feature-profile/mobility/cli/{cliId}/config/{configId}` | EditConfigFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global` | GetMobilityGlobalFeatureProfile | Configuration - Feature Profile (Mobility) | read | Verified live | 0 rows |
| GET | `/dataservice/v1/feature-profile/mobility/global/{globalId}` | GetMobilityFeatureProfileByGlobalId | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: globalId |
| GET | `/dataservice/v1/feature-profile/mobility/global/{globalId}/qos` | GetQosFeatureForGlobal | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: globalId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{globalId}/qos` | CreateQosFeatureForGlobal | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{globalId}/qos/{qosId}` | DeleteQosFeatureForGlobal | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{globalId}/qos/{qosId}` | GetQosFeatureByParcelIdForGlobal | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: globalId, qosId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{globalId}/qos/{qosId}` | EditQosFeatureForGlobal | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/aaaservers` | GetAaaServersProfileParcelForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/aaaservers` | CreateAaaServersProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/aaaservers/{aaaserversId}` | DeleteAaaServersProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/aaaservers/{aaaserversId}` | GetAaaServersProfileParcelByParcelIdForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, aaaserversId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/aaaservers/{aaaserversId}` | EditAaaServersProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/basic` | GetBasicProfileParcelForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/basic` | CreateBasicProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/basic/{parcelId}` | DeleteBasicProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/basic/{parcelId}` | GetBasicProfileParcelByParcelIdForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, parcelId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/basic/{parcelId}` | EditBasicProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/cellular` | GetCellularProfileParcelListForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/cellular` | CreateCellularProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/cellular/{cellularId}` | DeleteACellularProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/cellular/{cellularId}` | GetCellularProfileParcelForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, cellularId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/cellular/{cellularId}` | EditCellularProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/esimcellular` | GetEsimCellularProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/esimcellular` | CreateEsimCellularProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/esimcellular/{esimCellularId}` | DeleteEsimCellularProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/esimcellular/{esimCellularId}` | GetEsimCellularProfileFeatureByEsimCellularIdForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, esimCellularId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/esimcellular/{esimCellularId}` | EditEsimCellularProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/ethernet` | GetEthernetProfileParcels | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/ethernet` | CreateEthernetProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/ethernet/{ethernetId}` | DeleteEthernetProfileParcelForSystem | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/ethernet/{ethernetId}` | GetEthernetProfileParcel | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/ethernet/{ethernetId}` | EditEthernetProfileParcelForSystem | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/logging` | GetLoggingProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/logging` | CreateLoggingProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/logging/{loggingId}` | DeleteLoggingProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/logging/{loggingId}` | GetLoggingProfileFeatureByFeatureIdForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, loggingId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/logging/{loggingId}` | EditLoggingProfileFeatureForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/networkProtocol` | GetNetworkProtocolProfileParcelListForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/networkProtocol` | CreateNetworkProtocolProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/networkProtocol/{networkProtocolId}` | DeleteNetworkProtocolProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/networkProtocol/{networkProtocolId}` | GetNetworkProtocolProfileParcelForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, networkProtocolId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/networkProtocol/{networkProtocolId}` | EditNetworkProtocolProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/securityPolicy` | GetSecurityPolicyProfileParcelListForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/securityPolicy` | CreateSecurityPolicyProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/securityPolicy/{securityPolicyId}` | DeleteSecurityPolicyProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/securityPolicy/{securityPolicyId}` | GetSecurityPolicyProfileParcelForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, securityPolicyId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/securityPolicy/{securityPolicyId}` | EditSecurityPolicyProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/vpn` | GetVpnProfileParcelForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/vpn` | CreateVpnProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/vpn/{vpnId}` | DeleteVpnProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/vpn/{vpnId}` | GetVpnProfileParcelByParcelIdForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, vpnId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/vpn/{vpnId}` | EditVpnProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/wifi` | GetWifiProfileParcelListForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId |
| POST | `/dataservice/v1/feature-profile/mobility/global/{profileId}/wifi` | CreateWifiProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/mobility/global/{profileId}/wifi/{wifiId}` | DeleteWifiProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/{profileId}/wifi/{wifiId}` | GetWifiProfileParcelForMobility | Configuration - Feature Profile (Mobility) | read | Read (needs IDs) | path: profileId, wifiId |
| PUT | `/dataservice/v1/feature-profile/mobility/global/{profileId}/wifi/{wifiId}` | EditWifiProfileParcelForMobility | Configuration - Feature Profile (Mobility) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/mobility/global/basic/schema` | GetMobilityGlobalBasicParcelSchemaBySchemaType | Configuration - Feature Profile (Mobility) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/nfvirtual/cli` | GetAllNfvirtualCLIFeatureProfiles | Configuration - Feature Profile (NFVirtual) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/nfvirtual/cli` | CreateNfvirtualCLIFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/cli/{cliId}` | DeleteNfvirtualCLIFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/cli/{cliId}` | GetNfvirtualCLIFeatureProfileByid | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: cliId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/cli/{cliId}` | EditNfvirtualCLIFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/cli/{cliId}/config` | CreateNfvirtualCLIParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/cli/{cliId}/config/{configId}` | DeleteNfvirtualCLIParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/cli/{cliId}/config/{configId}` | getNfvirtualCLIParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: cliId, configId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/cli/{cliId}/config/{configId}` | EditNfvirtualCLIParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks` | GetAllNfvirtualNetworksFeatureProfiles | Configuration - Feature Profile (NFVirtual) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks` | CreateNfvirtualNetworksFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networkId}` | DeleteNfvirtualNetworksFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networkId}` | GetNfvirtualNetworksFeatureProfileByProfileId | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networkId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networkId}` | EditNfvirtualNetworksFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/lan` | CreateNfvirtualLANParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/lan/{lanId}` | DeleteNfvirtualLANParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/lan/{lanId}` | GetNfvirtualLANParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networksId, lanId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/lan/{lanId}` | EditNfvirtualLANParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/ovsnetwork` | CreateNfvirtualOVSNetworkParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/ovsnetwork/{ovsNetworkId}` | DeleteNfvirtualOVSNetworkParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/ovsnetwork/{ovsNetworkId}` | GetNfvirtualOVSNetworkParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networksId, ovsNetworkId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/ovsnetwork/{ovsNetworkId}` | EditNfvirtualOVSNetworkParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/routes` | CreateNfvirtualRoutesParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/routes/{routesId}` | DeleteNfvirtualRoutesParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/routes/{routesId}` | GetNfvirtualRoutesParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networksId, routesId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/routes/{routesId}` | EditNfvirtualRoutesParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/switch` | CreateNfvirtualSwitchParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/switch/{switchId}` | DeleteNfvirtualSwitchParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/switch/{switchId}` | GetNfvirtualSwitchParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networksId, switchId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/switch/{switchId}` | EditNfvirtualSwitchParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes` | CreateNfvirtualVNFAttributesParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes/{vnfAttributesId}` | DeleteNfvirtualVNFAttributesParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes/{vnfAttributesId}` | GetNfvirtualVNFAttributesParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networksId, vnfAttributesId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes/{vnfAttributesId}` | EditNfvirtualVNFAttributesParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes/{vnfAttributesId}/vnf` | CreateNfvirtualVNFParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes/{vnfAttributesId}/vnf/{vnfId}` | DeleteNfvirtualVNFParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes/{vnfAttributesId}/vnf/{vnfId}` | GetNfvirtualVNFParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networksId, vnfAttributesId, vnfId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/vnf-attributes/{vnfAttributesId}/vnf/{vnfId}` | EditNfvirtualVNFParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/wan` | CreateNfvirtualWanParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/wan/{wanId}` | DeleteNfvirtualWANParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/wan/{wanId}` | GetNfvirtualWANParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networksId, wanId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/networks/{networksId}/wan/{wanId}` | EditNfvirtualWANParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/networks/ovsnetwork/{networkId}` | GetAllNfvirtualOvsNetworksFeatureProfileByProfileId | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: networkId |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system` | GetAllNfvirtualSystemFeatureProfiles | Configuration - Feature Profile (NFVirtual) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/nfvirtual/system` | CreateNfvirtualSystemFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}` | DeleteNfvirtualSystemFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}` | GetNfvirtualSystemFeatureProfileByProfileId | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: systemId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}` | EditNfvirtualSystemFeatureProfile | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/aaa` | CreateNfvirtualAAAParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/aaa/{aaaId}` | DeleteNfvirtualAAAParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/aaa/{aaaId}` | GetNfvirtualAAAParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: systemId, aaaId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/aaa/{aaaId}` | EditNfvirtualAAAParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/banner` | CreateNfvirtualBannerParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/banner/{bannerId}` | DeleteNfvirtualBannerParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/banner/{bannerId}` | GetNfvirtualBannerParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: systemId, bannerId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/banner/{bannerId}` | EditNfvirtualBannerParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/logging` | CreateNfvirtualLoggingParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/logging/{loggingId}` | DeleteNfvirtualLoggingParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/logging/{loggingId}` | GetNfvirtualLoggingParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: systemId, loggingId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/logging/{loggingId}` | EditNfvirtualLoggingParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/ntp` | CreateNfvirtualNTPParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/ntp/{ntpId}` | DeleteNfvirtualNTPParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/ntp/{ntpId}` | GetNfvirtualNTPParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: systemId, ntpId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/ntp/{ntpId}` | EditNfvirtualNTPParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/snmp` | CreateNfvirtualSNMPParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/snmp/{snmpId}` | DeleteNfvirtualSNMPParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/snmp/{snmpId}` | GetNfvirtualSNMPParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: systemId, snmpId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/snmp/{snmpId}` | EditNfvirtualSNMPParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/system-settings` | CreateNfvirtualSystemSettingsParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/system-settings/{systemSettingsId}` | DeleteNfvirtualSystemSettingsParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/system-settings/{systemSettingsId}` | GetNfvirtualSystemSettingsParcel | Configuration - Feature Profile (NFVirtual) | read | Read (needs IDs) | path: systemId, systemSettingsId |
| PUT | `/dataservice/v1/feature-profile/nfvirtual/system/{systemId}/system-settings/{systemSettingsId}` | EditNfvirtualSystemSettingsParcel | Configuration - Feature Profile (NFVirtual) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing` | GetSdroutingFeatureProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 1 rows |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli` | GetSdroutingCliFeatureProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sd-routing/cli` | CreateSdroutingCliFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}` | DeleteSdroutingCliFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}` | GetSdroutingCliFeatureProfile | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: cliId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}` | EditSdroutingCliFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/config` | GetSdroutingCLIAddOnFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: cliId |
| POST | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/config` | CreateSdroutingCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/config/{configId}` | DeleteSdroutingCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/config/{configId}` | GetSdroutingCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: cliId, configId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/config/{configId}` | EditSdroutingCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/full-config` | GetSdroutingCliConfigGroupFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: cliId |
| POST | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/full-config` | CreateSdroutingCliConfigGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/full-config/{fullConfigId}` | DeleteSdroutingCliConfigGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/full-config/{fullConfigId}` | GetSdroutingCliConfigGroupFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: cliId, fullConfigId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/full-config/{fullConfigId}` | EditSdroutingCliConfigGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/ios-config` | GetSdroutingIosCLassicCLIAddOnFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: cliId |
| POST | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/ios-config` | CreateSdroutingIosClassicCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/ios-config/{iosConfigId}` | DeleteSdroutingIosClassicCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/ios-config/{iosConfigId}` | GetSdroutingIosClassicCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: cliId, iosConfigId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/cli/{cliId}/ios-config/{iosConfigId}` | EditSdroutingIosClassicCLIAddOnFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/cli/features` | Get | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| GET | `/dataservice/v1/feature-profile/sd-routing/embedded-security` | GetSdRoutingEmbeddedSecurityFeatureProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sd-routing/embedded-security` | CreateSdRoutingEmbeddedSecurityFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{embeddedSecurityId}` | DeleteSdRoutingEmbeddedSecurityFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{embeddedSecurityId}` | GetSdRoutingEmbeddedSecurityFeatureProfileByProfileId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: embeddedSecurityId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{embeddedSecurityId}` | EditSdRoutingEmbeddedSecurityFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/policy` | GetSecurityFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: securityId |
| POST | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/policy` | CreateEmbeddedSecurityFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/policy/{securityProfileParcelId}` | DeleteSecurityFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/policy/{securityProfileParcelId}` | GetSecurityFeatureByFeatureId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: securityId, securityProfileParcelId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/policy/{securityProfileParcelId}` | EditSecurityFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/unified/ngfirewall` | GetNgfirewallFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: securityId |
| POST | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/unified/ngfirewall` | CreateNgfirewallFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/unified/ngfirewall/{securityProfileParcelId}` | DeleteNgfirewallFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/unified/ngfirewall/{securityProfileParcelId}` | GetNgfirewallFeatureByFeatureId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: securityId, securityProfileParcelId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/embedded-security/{securityId}/unified/ngfirewall/{securityProfileParcelId}` | EditNgfirewallFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/other/{otherId}/cybervision` | GetCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdRouting_5803 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: otherId |
| POST | `/dataservice/v1/feature-profile/sd-routing/other/{otherId}/cybervision` | CreateCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdRouting_5804 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/other/{otherId}/cybervision/{cybervisionId}` | DeleteCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdRouting_7406 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/other/{otherId}/cybervision/{cybervisionId}` | GetCybervisionProfileFeatureByFeatureIdForOther_ConfigurationFeatureProfileSdRouting_7403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: otherId, cybervisionId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/other/{otherId}/cybervision/{cybervisionId}` | EditCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdRouting_7403 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service` | GetSdroutingServiceFeatureProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sd-routing/service` | CreateSdroutingServiceFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}` | DeleteSdroutingServiceFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}` | GetSdroutingServiceFeatureProfile | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}` | EditSdroutingServiceFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/dhcp-server` | GetSdroutingDhcpServerProfileParcels | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/dhcp-server` | CreateSdroutingDhcpServerProfileParcel | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/dhcp-server/{dhcpServerId}` | DeleteSdroutingDhcpServerProfileParcel | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/dhcp-server/{dhcpServerId}` | GetSdroutingDhcpServerProfileParcel | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, dhcpServerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/dhcp-server/{dhcpServerId}` | EditSdroutingDhcpServerProfileParcel | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipsec-profile` | GetSdroutingServiceIpsecProfileFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipsec-profile` | CreateSdroutingServiceIpsecProfileFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipsec-profile/{ipsecProfileId}` | DeleteSdroutingServiceIpsecProfileFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipsec-profile/{ipsecProfileId}` | GetSdroutingServiceIpsecProfileFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, ipsecProfileId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipsec-profile/{ipsecProfileId}` | EditSdroutingServiceIpsecProfileFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipv4-acl` | GetSdroutingServiceIpv4AclFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipv4-acl` | CreateSdroutingServiceIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipv4-acl/{ipv4AclId}` | DeleteSdroutingServiceIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipv4-acl/{ipv4AclId}` | GetSdroutingServiceIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, ipv4AclId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/ipv4-acl/{ipv4AclId}` | EditSdroutingServiceIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/multicloud-connection` | GetListOfProfileParcels | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/multicloud-connection` | CreateMultiCloudConnection_ConfigurationFeatureProfileSdRouting_7204 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/multicloud-connection/{multiCloudConnectionId}` | DeleteMultiCloudConnectionParcelForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/multicloud-connection/{multiCloudConnectionId}` | GetMultiCloudConnection | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, multiCloudConnectionId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/multicloud-connection/{multiCloudConnectionId}` | EditMultiCloudConnection_ConfigurationFeatureProfileSdRouting_9703 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttracker` | GetSdroutingServiceObjectTrackerFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttracker` | CreateSdroutingServiceObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttracker/{objectTrackerId}` | DeleteSdroutingServiceObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttracker/{objectTrackerId}` | GetSdroutingServiceObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, objectTrackerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttracker/{objectTrackerId}` | EditSdroutingServiceObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttrackergroup` | GetSdroutingServiceObjectTrackerGroupFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttrackergroup` | CreateSdroutingServiceObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttrackergroup/{objectTrackerGroupId}` | DeleteSdroutingServiceObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttrackergroup/{objectTrackerGroupId}` | GetSdroutingServiceObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, objectTrackerGroupId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/objecttrackergroup/{objectTrackerGroupId}` | EditSdroutingServiceObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/route-policy` | GetSdroutingServiceRoutePolicyFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/route-policy` | CreateSdroutingServiceRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/route-policy/{routePolicyId}` | DeleteSdroutingServiceRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/route-policy/{routePolicyId}` | GetSdroutingServiceRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, routePolicyId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/route-policy/{routePolicyId}` | EditSdroutingServiceRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospf` | GetSdroutingServiceVrfOspfFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospf` | CreateSdroutingServiceVrfOspfFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospf/{ospfId}` | DeleteSdroutingServiceVrfOspfFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospf/{ospfId}` | GetSdroutingServiceVrfOspfFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospf/{ospfId}` | EditSdroutingServiceVrfOspfFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv4` | GetSdroutingServiceVrfOspfv3Ipv4Features | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv4` | CreateSdroutingServiceVrfOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteSdroutingServiceVrfOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetSdroutingServiceVrfOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditSdroutingServiceVrfOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv6` | GetSdroutingServiceVrfOspfv3Ipv6Features | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv6` | CreateSdroutingServiceVrfOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteSdroutingServiceVrfOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetSdroutingServiceVrfOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditSdroutingServiceVrfOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf` | GetSdroutingServiceVRFFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf` | CreateSdroutingServiceVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}` | DeleteSdroutingServiceVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}` | GetSdroutingServiceVRFFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}` | EditSdroutingServiceVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/dmvpn-tunnel` | GetSdroutingServiceVRFDmvpnTunnelFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/dmvpn-tunnel` | CreateSdroutingServiceVRFDmvpnTunnelFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/dmvpn-tunnel/{tunnelId}` | DeleteSdroutingServiceVRFDmvpnTunnelFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/dmvpn-tunnel/{tunnelId}` | GetSdroutingServiceVRFDmvpnTunnelFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, tunnelId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/dmvpn-tunnel/{tunnelId}` | EditSdroutingServiceVRFDmvpnTunnelFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet` | GetSdroutingServiceVrfInterfaceEthernetFeaturesForService | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet` | CreateSdroutingServiceVrfInterfaceEthernetFeatureForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}` | DeleteSdroutingServiceVrfInterfaceEthernetFeatureForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}` | GetSdroutingServiceVrfInterfaceEthernetFeatureByFeatureIdForService | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}` | EditSdroutingServiceVrfInterfaceEthernetFeatureForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}/dhcp-server` | GetVrfInterfaceEthernetAssociatedDhcpServerParcelsForService | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, ethernetId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}/dhcp-server` | CreateVrfInterfaceEthernetAndDhcpServerParcelAssociationForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}/dhcp-server/{dhcpServerId}` | DeleteVrfInterfaceEthernetAndDhcpServerAssociationForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}/dhcp-server/{dhcpServerId}` | GetVrfInterfaceEthernetAssociatedDhcpServerParcelByFeatureIdForService | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, ethernetId, dhcpServerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ethernet/{ethernetId}/dhcp-server/{dhcpServerId}` | EditVrfInterfaceEthernetAndDhcpServerParcelAssociationForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ipsec` | GetSdroutingServiceVrfInterfaceIpsecFeaturesForService | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ipsec` | CreateSdroutingServiceVrfInterfaceIpsecFeatureForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ipsec/{ipsecId}` | DeleteSdroutingServiceVrfInterfaceIpsecFeatureForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ipsec/{ipsecId}` | GetSdroutingServiceVrfInterfaceIpsecFeatureByFeatureIdForService | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, ipsecId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/interface/ipsec/{ipsecId}` | EditSdroutingServiceVrfInterfaceIpsecFeatureForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/bgp` | GetServiceVrfAssociatedRoutingBgpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/bgp` | CreateServiceVrfAndRoutingBgpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/bgp/{bgpId}` | DeleteServiceVrfAndRoutingBgpAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/bgp/{bgpId}` | GetServiceVrfAssociatedRoutingBgpParcelByParcelId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/bgp/{bgpId}` | EditServiceVrfAndRoutingBgpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/eigrp` | GetServiceVrfAssociatedRoutingEigrpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/eigrp` | CreateServiceVrfAndRoutingEigrpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/eigrp/{eigrpId}` | DeleteServiceVrfAndRoutingEigrpAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/eigrp/{eigrpId}` | GetServiceVrfAssociatedRoutingEigrpFeatureByFeatureId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, eigrpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/eigrp/{eigrpId}` | EditServiceVrfAndRoutingEigrpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospf` | GetServiceVrfAssociatedRoutingOspfFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospf` | CreateServiceVrfAndRoutingOspfParcelAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospf/{ospfId}` | DeleteServiceVrfAndRoutingOspfAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospf/{ospfId}` | GetServiceVrfAssociatedRoutingOspfFeatureById | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospf/{ospfId}` | EditServiceVrfAndRoutingOspfFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv4` | GetServiceVrfAssociatedRoutingOspfv3Ipv4Features | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv4` | CreateServiceVrfAndRoutingOspfv3Ipv4FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteServiceVrfAndRoutingOspfv3Ipv4Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetServiceVrfAssociatedRoutingOspfv3Ipv4FeatureById | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditServiceVrfAndRoutingOspfv3Ipv4FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv6` | GetServiceVrfAssociatedRoutingOspfv3Ipv6Parcels | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv6` | CreateServiceVrfAndRoutingOspfv3Ipv6FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteServiceVrfAndRoutingOspfv3Ipv6Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetServiceVrfAssociatedRoutingOspfv3Ipv6FeatureById | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditServiceVrfAndRoutingOspfv3Ipv6FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/lan/{vrfId}/raw-socket` | GetRawSocketParcelsForServiceVrfLan | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/lan/{vrfId}/raw-socket` | CreateVrfLanRawSocketParcelForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/lan/{vrfId}/raw-socket/{rawSocketId}` | DeleteVrfLanRawSocketForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/lan/{vrfId}/raw-socket/{rawSocketId}` | GetVrfLanRawSocketParcelByParcelIdForService | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, vrfId, rawSocketId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/lan/{vrfId}/raw-socket/{rawSocketId}` | EditVrfLanRawSocketParcelForService | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/bgp` | GetSdroutingServiceVrfBgpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/bgp` | CreateSdroutingServiceVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/bgp/{bgpId}` | DeleteSdroutingServiceVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/bgp/{bgpId}` | GetSdroutingServiceVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/bgp/{bgpId}` | EditSdroutingServiceVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/eigrp` | GetSdroutingServiceVrfEigrpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/eigrp` | CreateSdroutingServiceVrfEigrpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/eigrp/{eigrpId}` | DeleteSdroutingServiceVrfEigrpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/eigrp/{eigrpId}` | GetSdroutingServiceVrfEigrpFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: serviceId, eigrpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/service/{serviceId}/vrf/routing/eigrp/{eigrpId}` | EditSdroutingServiceVrfEigrpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse` | GetSdRoutingSseFeatureProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sd-routing/sse` | CreateSdRoutingSseFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse-spa` | GetSdRoutingSseSpaProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sd-routing/sse-spa` | CreateSdRoutingSseSpaProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}` | DeleteSdRoutingSseSpaProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}` | GetSdRoutingSseSpaProfileByProfileId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: sseSpaId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}` | EditSdRoutingSseSpaProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}/spa-configuration` | GetSpaConfigurationsForsseSpa | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: sseSpaId |
| POST | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}/spa-configuration` | CreateSpaConfigurationForsseSpa | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}/spa-configuration/{spaConfigurationId}` | DeleteSpaConfigurationForsseSpa | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}/spa-configuration/{spaConfigurationId}` | GetSpaConfigurationByIdForsseSpa | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: sseSpaId, spaConfigurationId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/sse-spa/{sseSpaId}/spa-configuration/{spaConfigurationId}` | EditSpaConfigurationForsseSpa | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse-spa/spa-configuration/schema` | GetSdRoutingsseSpaSpaConfigurationSchemaBySchemaType | Configuration - Feature Profile (SD-Routing) | read | Verified live | object |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}` | DeleteSdRoutingSseFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}` | GetSdRoutingSseFeatureProfileByProfileId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: sseId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}` | EditSdRoutingSseFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}/cisco` | GetCiscoSseFeatureForSse | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: sseId |
| POST | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}/cisco` | CreateCiscoSseFeatureForSse | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}/cisco/{ciscoSseId}` | DeleteCiscoSseFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}/cisco/{ciscoSseId}` | GetCiscoSseFeatureByFeatureIdForSSE | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: sseId, ciscoSseId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/sse/{sseId}/cisco/{ciscoSseId}` | EditCiscoSseFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system` | GetSdroutingSystemFeatureProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sd-routing/system` | CreateSdroutingSystemFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}` | DeleteSdroutingSystemFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}` | GetSdroutingSystemFeatureProfile | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}` | EditSdroutingSystemFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/aaa` | GetSdroutingAaaFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/aaa` | CreateSdroutingAaaFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/aaa/{aaaId}` | DeleteSdroutingAaaFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/aaa/{aaaId}` | GetSdroutingAaaFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, aaaId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/aaa/{aaaId}` | EditSdroutingAaaFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/banner` | GetSdroutingBannerFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/banner` | CreateSdroutingBannerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/banner/{bannerId}` | DeleteSdroutingBannerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/banner/{bannerId}` | GetSdroutingBannerFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, bannerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/banner/{bannerId}` | EditSdroutingBannerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/certificate` | GetSdroutingCertificateFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/certificate` | CreateSdroutingCertificateFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/certificate/{certificateId}` | DeleteSdroutingCertificateFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/certificate/{certificateId}` | GetSdroutingCertificateFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, certificateId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/certificate/{certificateId}` | EditSdroutingCertificateFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/flexible-port-speed` | GetSdroutingFlexiblePortSpeedFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/flexible-port-speed` | CreateSdroutingFlexiblePortSpeedFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/flexible-port-speed/{flexiblePortSpeedId}` | DeleteSdroutingFlexiblePortSpeedFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/flexible-port-speed/{flexiblePortSpeedId}` | GetSdroutingFlexiblePortSpeedFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, flexiblePortSpeedId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/flexible-port-speed/{flexiblePortSpeedId}` | EditSdroutingFlexiblePortSpeedFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/global` | GetSdroutingGlobalSettingFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/global` | CreateSdroutingGlobalSettingFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/global/{globalId}` | DeleteSdroutingGlobalSettingFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/global/{globalId}` | GetSdroutingGlobalSettingFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, globalId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/global/{globalId}` | EditSdroutingGlobalSettingFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ignition` | GetIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdRouting_5703 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ignition` | CreateIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdRouting_5704 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ignition/{ignitionId}` | DeleteIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdRouting_7006 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ignition/{ignitionId}` | GetIgnitionProfileParcelByParcelIdForSystem_ConfigurationFeatureProfileSdRouting_7003 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, ignitionId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ignition/{ignitionId}` | EditIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdRouting_7003 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/logging` | GetSdroutingLoggingFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/logging` | CreateSdroutingLoggingFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/logging/{loggingId}` | DeleteSdroutingLoggingFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/logging/{loggingId}` | GetSdroutingLoggingFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, loggingId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/logging/{loggingId}` | EditSdroutingLoggingFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ntp` | GetSdroutingNtpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ntp` | CreateSdroutingNtpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ntp/{ntpId}` | DeleteSdroutingNtpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ntp/{ntpId}` | GetSdroutingNtpFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, ntpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/ntp/{ntpId}` | EditSdroutingNtpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/snmp` | GetSdroutingSnmpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/snmp` | CreateSdroutingSnmpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/snmp/{snmpId}` | DeleteSdroutingSnmpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/snmp/{snmpId}` | GetSdroutingSnmpFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: systemId, snmpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/system/{systemId}/snmp/{snmpId}` | EditSdroutingSnmpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport` | GetSdroutingTransportFeatureProfiles | Configuration - Feature Profile (SD-Routing) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport` | CreateSdroutingTransportFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}` | DeleteSdroutingTransportFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}` | GetSdroutingTransportFeatureProfile | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}` | EditSdroutingTransportFeatureProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/{cellularControllerId}/dying-gasp/{dyingGaspId}` | EditCellularControllerAndDyingGaspParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_10203 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/{cellularControllerId}/gps/{gpsId}` | EditCellularControllerAndGpsParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_8903 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-bandselect` | GetCellularBandselectProfileFeatureForSdroutingTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-bandselect` | CreateBandSelectFeatureForSdroutingTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-bandselect/{bandSelectId}` | DeleteCellulaBandselectFeatureForSdroutingTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-bandselect/{bandSelectId}` | GetCellularBandselectProfileFeatureByFeatureIdForSdroutingTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, bandSelectId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-bandselect/{bandSelectId}` | EditBandSelectFeatureForTransportSdrouting | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller` | GetCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_7403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller` | CreateCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_7404 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}` | DeleteCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_9706 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}` | GetCellularControllerProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_9703 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}` | EditCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_9703 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile` | GetCellularControllerAssociatedCellularProfileParcelsForTransport_ConfigurationFeatureProfileSdRouting_11403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile` | CreateCellularControllerAndCellularProfileParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_11404 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile/{cellularProfileId}` | DeleteCellularControllerAndCellularProfileAssociationForTransport_ConfigurationFeatureProfileSdRouting_13406 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile/{cellularProfileId}` | GetCellularControllerAssociatedCellularProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_13403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularControllerId, cellularProfileId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile/{cellularProfileId}` | EditCellularControllerAndCellularProfileParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_13403 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp` | GetCellularControllerAssociatedDyingGaspParcelsForTransport_ConfigurationFeatureProfileSdRouting_10803 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp` | CreateCellularControllerAndDyingGaspParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_10804 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp/{dyingGaspId}` | DeleteCellularControllerAndDyingGaspAssociationForTransport_ConfigurationFeatureProfileSdRouting_12206 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp/{dyingGaspId}` | GetCellularControllerAssociatedDyingGaspParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_12203 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularControllerId, dyingGaspId |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/gps` | GetCellularControllerAssociatedGpsParcelsForTransport_ConfigurationFeatureProfileSdRouting_10103 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/gps` | CreateCellularControllerAndGpsParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_10104 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/gps/{gpsId}` | DeleteCellularControllerAndGpsAssociationForTransport_ConfigurationFeatureProfileSdRouting_10906 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/gps/{gpsId}` | GetCellularControllerAssociatedGpsParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_10903 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularControllerId, gpsId |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-profile` | GetCellularProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-profile` | CreateCellularProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-profile/{cellularProfileId}` | DeleteCellularProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-profile/{cellularProfileId}` | GetCellularProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, cellularProfileId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-profile/{cellularProfileId}` | EditCellularProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/dying-gasp` | GetDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_6503 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/dying-gasp` | CreateDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_6504 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/dying-gasp/{dyingGaspId}` | DeleteDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_7906 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/dying-gasp/{dyingGaspId}` | GetDyingGaspProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_7903 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, dyingGaspId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/dying-gasp/{dyingGaspId}` | EditDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_7903 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf` | GetSdroutingTransportGlobalVRFFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf` | CreateSdroutingTransportGlobalVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}` | DeleteSdroutingTransportGlobalVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}` | GetSdroutingTransportGlobalVRFFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}` | EditSdroutingTransportGlobalVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular` | GetGlobalVRFInterfaceCellularParcelsForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular` | CreateGlobalVRFInterfaceCellularParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/tracker` | GetGlobalVRFInterfaceCellularAssociatedTrackerParcelsForTransport_ConfigurationFeatureProfileSdRouting_11303 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, cellularId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/tracker` | CreateGlobalVRFInterfaceCellularAndTrackerParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_11304 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/tracker/{trackerId}` | DeleteGlobalVRFInterfaceCellularAndTrackerAssociationForTransport_ConfigurationFeatureProfileSdRouting_12506 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/tracker/{trackerId}` | GetGlobalVRFInterfaceCellularAssociatedTrackerParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_12503 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, cellularId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/tracker/{trackerId}` | EditGlobalVRFInterfaceCellularAndTrackerParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_12503 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/trackergroup` | GetGlobalVRFInterfaceCellularAssociatedTrackerParcelsForTransport_ConfigurationFeatureProfileSdRouting_11803 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, cellularId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/trackergroup` | CreateGlobalVRFInterfaceCellularAndTrackerParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_11804 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/trackergroup/{trackerId}` | DeleteGlobalVRFInterfaceCellularAndTrackerAssociationForTransport_ConfigurationFeatureProfileSdRouting_13006 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/trackergroup/{trackerId}` | GetGlobalVRFInterfaceCellularAssociatedTrackerParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_13003 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, cellularId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{cellularId}/trackergroup/{trackerId}` | EditGlobalVRFInterfaceCellularAndTrackerParcelAssociationForTransport_ConfigurationFeatureProfileSdRouting_13003 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{intfId}` | DeleteGlobalVRFInterfaceCellularForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{intfId}` | GetGlobalVRFInterfaceCellularParcelByParcelIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, intfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/cellular/{intfId}` | EditGlobalVRFInterfaceCellularParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ethernet` | GetSdroutingTransportGlobalVrfInterfaceEthernetParcelsForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ethernet` | CreateSdroutingTransportGlobalVrfInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ethernet/{ethernetId}` | DeleteSdroutingTransportGlobalVrfInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ethernet/{ethernetId}` | GetSdroutingTransportGlobalVrfInterfaceEthernetParcelByParcelIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ethernet/{ethernetId}` | EditSdroutingTransportGlobalVrfInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ipsec` | GetSdroutingTransportGlobalVrfInterfaceIpsecFeaturesForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ipsec` | CreateSdroutingTransportGlobalVrfInterfaceIpsecFeatureForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ipsec/{ipsecId}` | DeleteSdroutingTransportGlobalVrfInterfaceIpsecFeatureForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ipsec/{ipsecId}` | GetSdroutingTransportGlobalVrfInterfaceIpsecFeatureByFeatureIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ipsecId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/interface/ipsec/{ipsecId}` | EditSdroutingTransportGlobalVrfInterfaceIpsecFeatureForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/multicloud-connection` | CreateTransportGlobalVrfAndMulticloudConnectionParcelAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/bgp` | GetTransportVrfAssociatedRoutingBgpFeatures_ConfigurationFeatureProfileSdRouting_8503 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/bgp` | CreateTransportGlobalVrfAndRoutingBgpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/bgp/{bgpId}` | DeleteTransportGlobalVrfAndRoutingBgpAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/bgp/{bgpId}` | GetVrfAssociatedRoutingBgpFeatureById | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/bgp/{bgpId}` | EditTransportGlobalVrfAndRoutingBgpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospf` | GetTransportVrfAssociatedRoutingOspfFeatures_ConfigurationFeatureProfileSdRouting_8603 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospf` | CreateTransportGlobalVrfAndRoutingOspfParcelAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospf/{ospfId}` | DeleteTransportGlobalVrfAndRoutingOspfAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospf/{ospfId}` | GetVrfAssociatedRoutingOspfParcelByFeatureId | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospf/{ospfId}` | EditTransportGlobalVrfAndRoutingOspfFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv4` | GetTransportVrfAssociatedRoutingOspfv3Ipv4Features_ConfigurationFeatureProfileSdRouting_9303 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv4` | CreateTransportGlobalVrfAndRoutingOspfv3Ipv4FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteTransportGlobalVrfAndRoutingOspfv3Ipv4Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetVrfAssociatedRoutingOspfv3Ipv4FeatureById_ConfigurationFeatureProfileSdRouting_10403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditTransportGlobalVrfAndRoutingOspfv3Ipv4FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv6` | GetTransportVrfAssociatedRoutingOspfv3Ipv6Features_ConfigurationFeatureProfileSdRouting_9303 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv6` | CreateTransportGlobalVrfAndRoutingOspfv3Ipv6ParcelAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteTransportGlobalVrfAndRoutingOspfv3Ipv6Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetVrfAssociatedRoutingOspfv3Ipv6FeatureById_ConfigurationFeatureProfileSdRouting_10403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditTransportGlobalVrfAndRoutingOspfv3Ipv6FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/routing/bgp` | GetSdroutingTransportGlobalVrfBgpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/routing/bgp` | CreateSdroutingTransportGlobalVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/routing/bgp/{bgpId}` | DeleteSdroutingTransportGlobalVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/routing/bgp/{bgpId}` | GetSdroutingTransportGlobalVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/routing/bgp/{bgpId}` | EditSdroutingTransportGlobalVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/wan/{vrfId}/raw-socket` | GetRawSocketParcelsForTransportGlobalVrfWan | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/wan/{vrfId}/raw-socket` | CreateGlobalVrfWanRawSocketParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/wan/{vrfId}/raw-socket/{rawSocketId}` | DeleteGlobalVrfWanRawSocketForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/wan/{vrfId}/raw-socket/{rawSocketId}` | GetGlobalVrfWanRawSocketParcelByParcelIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, rawSocketId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/global-vrf/wan/{vrfId}/raw-socket/{rawSocketId}` | EditGlobalVrfWanRawSocketParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/gps` | GetGPSProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/gps` | CreateGPSProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/gps/{gpsId}` | DeleteGPSProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/gps/{gpsId}` | GetGPSProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, gpsId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/gps/{gpsId}` | EditGPSProfileParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/ipv4-acl` | GetSdroutingTransportIpv4AclFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/ipv4-acl` | CreateSdroutingTransportIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/ipv4-acl/{ipv4AclId}` | DeleteSdroutingTransportIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/ipv4-acl/{ipv4AclId}` | GetSdroutingTransportIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, ipv4AclId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/ipv4-acl/{ipv4AclId}` | EditSdroutingTransportIpv4AclFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf` | GetSdroutingManagementVRFFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf` | CreateSdroutingManagementVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}` | DeleteSdroutingManagementVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}` | GetSdroutingManagementVRFFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}` | EditSdroutingManagementVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}/interface/ethernet` | GetSdroutingManagementVrfInterfaceEthernetParcelsForTransportProfile | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}/interface/ethernet` | CreateSdroutingManagementVrfInterfaceEthernetParcelForTransportProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}/interface/ethernet/{ethernetId}` | DeleteSdroutingManagementVrfInterfaceEthernetParcelForTransportProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}/interface/ethernet/{ethernetId}` | GetSdroutingManagementVrfInterfaceEthernetParcelByParcelIdForTransportProfile | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/management-vrf/{vrfId}/interface/ethernet/{ethernetId}` | EditSdroutingManagementVrfInterfaceEthernetParcelForTransportProfile | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/multicloud-connection` | GetLanVpnProfileParcelForService_ConfigurationFeatureProfileSdRouting_7603 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/multicloud-connection` | CreateMultiCloudConnection_ConfigurationFeatureProfileSdRouting_7604 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/multicloud-connection/{multiCloudConnectionId}` | DeleteMultiCloudConnectionParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/multicloud-connection/{multiCloudConnectionId}` | GetLanVpnProfileParcelByParcelIdForService_ConfigurationFeatureProfileSdRouting_10103 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, multiCloudConnectionId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/multicloud-connection/{multiCloudConnectionId}` | EditMultiCloudConnection_ConfigurationFeatureProfileSdRouting_10103 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttracker` | GetSdroutingTransportObjectTrackerFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttracker` | CreateSdroutingTransportObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttracker/{objectTrackerId}` | DeleteSdroutingTransportObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttracker/{objectTrackerId}` | GetSdroutingTransportObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, objectTrackerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttracker/{objectTrackerId}` | EditSdroutingTransportObjectTrackerFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttrackergroup` | GetSdroutingTransportObjectTrackerGroupFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttrackergroup` | CreateSdroutingTransportObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttrackergroup/{objectTrackerGroupId}` | DeleteSdroutingTransportObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttrackergroup/{objectTrackerGroupId}` | GetSdroutingTransportObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, objectTrackerGroupId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/objecttrackergroup/{objectTrackerGroupId}` | EditSdroutingTransportObjectTrackerGroupFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/route-policy` | GetSdroutingTransportRoutePolicyFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/route-policy` | CreateSdroutingTransportRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/route-policy/{routePolicyId}` | DeleteSdroutingTransportRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/route-policy/{routePolicyId}` | GetSdroutingTransportRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, routePolicyId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/route-policy/{routePolicyId}` | EditSdroutingTransportRoutePolicyFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospf` | GetSdroutingTransportRoutingOspfFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospf` | CreateSdroutingTransportRoutingOspfFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospf/{ospfId}` | DeleteSdroutingTransportRoutingOspfFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospf/{ospfId}` | GetSdroutingTransportRoutingOspfFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospf/{ospfId}` | EditSdroutingTransportRoutingOspfFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv4` | GetSdroutingTransportRoutingOspfv3Ipv4Features | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv4` | CreateSdroutingTransportRoutingOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteSdroutingTransportRoutingOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetSdroutingTransportRoutingOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditSdroutingTransportRoutingOspfv3Ipv4Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv6` | GetSdroutingTransportRoutingOspfv3Ipv6Features | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv6` | CreateSdroutingTransportRoutingOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteSdroutingTransportRoutingOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetSdroutingTransportRoutingOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditSdroutingTransportRoutingOspfv3Ipv6Feature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/tracker` | GetTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_6203 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/tracker` | CreateTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_6204 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/tracker/{trackerId}` | DeleteTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_7406 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/tracker/{trackerId}` | GetTrackerProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_7403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/tracker/{trackerId}` | EditTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_7403 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/trackergroup` | GetTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_6703 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/trackergroup` | CreateTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_6704 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/trackergroup/{trackergroupId}` | DeleteTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_8406 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/trackergroup/{trackergroupId}` | GetTrackerGroupProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdRouting_8403 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/trackergroup/{trackergroupId}` | EditTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdRouting_8403 | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf` | GetSdroutingTransportVRFFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf` | CreateSdroutingTransportVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}` | DeleteSdroutingTransportVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}` | GetSdroutingTransportVRFFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}` | EditSdroutingTransportVRFFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ethernet` | GetSdroutingTransportVrfInterfaceEthernetParcelsForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ethernet` | CreateSdroutingTransportVrfInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ethernet/{ethernetId}` | DeleteSdroutingTransportVrfInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ethernet/{ethernetId}` | GetSdroutingTransportVrfInterfaceEthernetParcelByParcelIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ethernet/{ethernetId}` | EditSdroutingTransportVrfInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ipsec` | GetSdroutingTransportVrfInterfaceIpsecFeaturesForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ipsec` | CreateSdroutingTransportVrfInterfaceIpsecFeatureForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ipsec/{ipsecId}` | DeleteSdroutingTransportVrfInterfaceIpsecFeatureForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ipsec/{ipsecId}` | GetSdroutingTransportVrfInterfaceIpsecFeatureByFeatureIdForTransport | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ipsecId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/interface/ipsec/{ipsecId}` | EditSdroutingTransportVrfInterfaceIpsecFeatureForTransport | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/bgp` | GetTransportVrfAssociatedRoutingBgpFeatures_ConfigurationFeatureProfileSdRouting_7803 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/bgp` | CreateTransportVrfAndRoutingBgpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/bgp/{bgpId}` | DeleteTransportVrfAndRoutingBgpAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/bgp/{bgpId}` | GetTransportVrfAssociatedRoutingBgpById | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/bgp/{bgpId}` | EditTransportVrfAndRoutingBgpFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospf` | GetTransportVrfAssociatedRoutingOspfFeatures_ConfigurationFeatureProfileSdRouting_7903 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospf` | CreateTransportVrfAndRoutingOspfAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospf/{ospfId}` | DeleteTransportVrfAndRoutingOspfAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospf/{ospfId}` | GetVrfAssociatedRoutingOspfById | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospf/{ospfId}` | EditTransportVrfAndRoutingOspfFeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv4` | GetTransportVrfAssociatedRoutingOspfv3Ipv4Features_ConfigurationFeatureProfileSdRouting_8603 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv4` | CreateTransportVrfAndRoutingOspfv3Ipv4Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteTransportVrfAndRoutingOspfv3Ipv4Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetVrfAssociatedRoutingOspfv3Ipv4FeatureById_ConfigurationFeatureProfileSdRouting_9703 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditTransportVrfAndRoutingOspfv3Ipv4Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv6` | GetTransportVrfAssociatedRoutingOspfv3Ipv6Features_ConfigurationFeatureProfileSdRouting_8603 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv6` | CreateTransportVrfAndRoutingOspfv3Ipv6FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteTransportVrfAndRoutingOspfv3Ipv6Association | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetVrfAssociatedRoutingOspfv3Ipv6FeatureById_ConfigurationFeatureProfileSdRouting_9703 | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, vrfId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/{vrfId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditTransportVrfAndRoutingOspfv3Ipv6FeatureAssociation | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/routing/bgp` | GetSdroutingTransportVrfBgpFeatures | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/routing/bgp` | CreateSdroutingTransportVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/routing/bgp/{bgpId}` | DeleteSdroutingTransportVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/routing/bgp/{bgpId}` | GetSdroutingTransportVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | read | Read (needs IDs) | path: transportId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/vrf/routing/bgp/{bgpId}` | EditSdroutingTransportVrfBgpFeature | Configuration - Feature Profile (SD-Routing) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect` | GetCellularControllerAssociatedCellularBandSelectForTransportSdrouting | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect` | CreateCellularControllerAndCellularBandSelectAssociationForTransportSdrouting | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect/{cellularBandSelectId}` | DeleteCellularControllerAndCellularBandSelectAssociationForTransportSdrouting | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect/{cellularBandSelectId}` | GetCellularControllerAssociatedCellularBandSelectByIdForTransportSdrouting | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId, cellularBandSelectId |
| PUT | `/dataservice/v1/feature-profile/sd-routing/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect/{cellularBandSelectId}` | EditCellularControllerAndCellularBandSelectAssociationForTransportSdrouting | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan` | GetSdwanFeatureProfileBySdwanFamily | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/cloud-probe/{cloudProbeId}` | GetCloudProbeProfileParcelByParcelIdForapplication-priority | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: applicationPriorityId, cloudProbeId |
| POST | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/qos-policy` | createPolicyApplicationProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/qos-policy/{qosPolicyId}` | deletePolicyApplicationProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/qos-policy/{qosPolicyId}` | getPolicyApplicationProfileParcel | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: applicationPriorityId, qosPolicyId |
| PUT | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/qos-policy/{qosPolicyId}` | editPolicyApplicationProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/traffic-policy` | CreateTrafficPolicyProfileParcelForapplication-priority | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/traffic-policy/{trafficPolicyId}` | DeleteTrafficPolicyProfileParcelForapplication-priority | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/traffic-policy/{trafficPolicyId}` | GetTrafficPolicyProfileParcelByParcelIdForapplication-priority | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: applicationPriorityId, trafficPolicyId |
| PUT | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/traffic-policy/{trafficPolicyId}` | EditTrafficPolicyProfileParcelForapplication-priority | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/vpn-qos-policy` | createProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/vpn-qos-policy/{vpnQosPolicyId}` | deleteProfileParcel_ConfigurationFeatureProfileSdwan_10206 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/vpn-qos-policy/{vpnQosPolicyId}` | getProfileParcelByParcelId_ConfigurationFeatureProfileSdwan_10203 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: applicationPriorityId, vpnQosPolicyId |
| PUT | `/dataservice/v1/feature-profile/sdwan/application-priority/{applicationPriorityId}/vpn-qos-policy/{vpnQosPolicyId}` | editProfileParcel_ConfigurationFeatureProfileSdwan_10203 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/cli` | GetSdwanFeatureProfilesByFamilyAndType_ConfigurationFeatureProfileSdwan_2903 | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| POST | `/dataservice/v1/feature-profile/sdwan/cli` | CreateSdwanFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}` | DeleteSdwanFeatureProfileForCli | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}` | GetSdwanFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: cliId |
| PUT | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}` | EditSdwanFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}/config` | GetConfigProfileParcelForCLI | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: cliId |
| POST | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}/config` | CreateSdwanConfigProfileParcelForCli | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}/config/{configId}` | DeleteConfigProfileParcelForCLI | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}/config/{configId}` | GetConfigProfileParcelByParcelIdForCLI | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: cliId, configId |
| PUT | `/dataservice/v1/feature-profile/sdwan/cli/{cliId}/config/{configId}` | EditConfigProfileParcelForCLI | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/cli/config/schema` | GetSdwanCliConfigFeatureSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/cli/features` | GetSdwanFeatureProfilesByFamilyAndType_ConfigurationFeatureProfileSdwan_3803 | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/dns-security` | GetSdwanDnsSecurityFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/dns-security` | CreateSdwanDnsSecurityFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}` | DeleteSdwanDnsSecurityFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}` | GetSdwanDnsSecurityFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: dnsSecurityId |
| PUT | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}` | EditSdwanDnsSecurityFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}/dns` | GetDnsSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: dnsSecurityId |
| POST | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}/dns` | CreateDnsSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}/dns/{dnsSecurityProfileParcelId}` | DeleteDnsSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}/dns/{dnsSecurityProfileParcelId}` | GetDnsSecurityProfileParcelByParcelId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: dnsSecurityId, dnsSecurityProfileParcelId |
| PUT | `/dataservice/v1/feature-profile/sdwan/dns-security/{dnsSecurityId}/dns/{dnsSecurityProfileParcelId}` | EditDnsSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/policy` | GetSdwanSecurityFeature_ConfigurationFeatureProfileSdwan_6303 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: securityId |
| POST | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/policy` | CreateSdwanEmbeddedSecurityFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/policy/{securityProfileParcelId}` | DeleteSdwanSecurityFeature_ConfigurationFeatureProfileSdwan_8906 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/policy/{securityProfileParcelId}` | GetSdwanSecurityFeatureByFeatureId_ConfigurationFeatureProfileSdwan_8903 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: securityId, securityProfileParcelId |
| PUT | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/policy/{securityProfileParcelId}` | EditSdwanSecurityFeature_ConfigurationFeatureProfileSdwan_8903 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/unified/ngfirewall` | GetSdwanNgfirewallFeature | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: securityId |
| POST | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/unified/ngfirewall` | CreateSdwanNgfirewallFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/unified/ngfirewall/{securityProfileParcelId}` | DeleteSdwanNgfirewallFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/unified/ngfirewall/{securityProfileParcelId}` | GetSdwanNgfirewallFeatureByFeatureId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: securityId, securityProfileParcelId |
| PUT | `/dataservice/v1/feature-profile/sdwan/embedded-security/{securityId}/unified/ngfirewall/{securityProfileParcelId}` | EditSdwanNgfirewallFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other` | GetSdwanOtherFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 2 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/other` | CreateSDWANOtherFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/other/{otherId}` | DeleteSdwanOtherFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}` | GetSdwanOtherFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId |
| PUT | `/dataservice/v1/feature-profile/sdwan/other/{otherId}` | EditSdwanOtherFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/cybervision` | GetCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdwan_5303 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId |
| POST | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/cybervision` | CreateCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdwan_5304 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/cybervision/{cybervisionId}` | DeleteCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdwan_6906 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/cybervision/{cybervisionId}` | GetCybervisionProfileFeatureByFeatureIdForOther_ConfigurationFeatureProfileSdwan_6903 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId, cybervisionId |
| PUT | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/cybervision/{cybervisionId}` | EditCybervisionProfileFeatureForOther_ConfigurationFeatureProfileSdwan_6903 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/thousandeyes` | GetThousandeyesProfileParcelForOther | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId |
| POST | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/thousandeyes` | CreateThousandeyesProfileParcelForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/thousandeyes/{thousandeyesId}` | DeleteThousandeyesProfileParcelForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/thousandeyes/{thousandeyesId}` | GetThousandeyesProfileParcelByParcelIdForOther | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId, thousandeyesId |
| PUT | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/thousandeyes/{thousandeyesId}` | EditThousandeyesProfileParcelForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/trustsec` | GetTrustSecProfileParcelForOther | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId |
| POST | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/trustsec` | CreateTrustSecProfileParcelForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/trustsec/{trustsecId}` | DeleteTrustSecProfileParcelForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/trustsec/{trustsecId}` | GetTrustSecProfileParcelByParcelIdForOther | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId, trustsecId |
| PUT | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/trustsec/{trustsecId}` | EditTrustSecProfileParcelForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/ucse` | GetUcseProfileFeatureForOther | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId |
| POST | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/ucse` | CreateUcseProfileFeatureForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/ucse/{ucseId}` | DeleteUcseProfileFeatureForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/ucse/{ucseId}` | GetUcseProfileFeatureByIdFFeatureForOther | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: otherId, ucseId |
| PUT | `/dataservice/v1/feature-profile/sdwan/other/{otherId}/ucse/{ucseId}` | EditUcseProfileFeatureForOther | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/other/thousandeyes/schema` | GetSdwanOtherThousandeyesParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/{policyObjectListType}` | GetDataPrefixProfileParcelForPolicyObject | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: policyObjectId, policyObjectListType |
| POST | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/{policyObjectListType}` | CreateDataPrefixProfileParcelForSecurityPolicyObject | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/{policyObjectListType}/{listObjectId}` | DeleteDataPrefixProfileParcelForPolicyObject | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/{policyObjectListType}/{listObjectId}` | GetDataPrefixProfileParcelByParcelIdForPolicyObject | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: policyObjectId, policyObjectListType, listObjectId |
| PUT | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/{policyObjectListType}/{listObjectId}` | EditDataPrefixProfileParcelForPolicyObject | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/{policyObjectListType}/{listObjectId}/referenced-by` | GetPolicyObjectProfileParcelWithReferencedByDetailsByParcelId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: policyObjectId, policyObjectListType, listObjectId |
| GET | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/unified/{securityProfileParcelType}` | GetSdwanSecurityFeature_ConfigurationFeatureProfileSdwan_9203 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: policyObjectId, securityProfileParcelType |
| POST | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/unified/{securityProfileParcelType}` | CreateSdwanSecurityFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/unified/{securityProfileParcelType}/{securityProfileParcelId}` | DeleteSdwanSecurityFeature_ConfigurationFeatureProfileSdwan_11806 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/unified/{securityProfileParcelType}/{securityProfileParcelId}` | GetSdwanSecurityFeatureByFeatureId_ConfigurationFeatureProfileSdwan_11803 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: policyObjectId, securityProfileParcelType, securityProfileParcelId |
| PUT | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/unified/{securityProfileParcelType}/{securityProfileParcelId}` | EditSdwanSecurityFeature_ConfigurationFeatureProfileSdwan_11803 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectId}/unified/{securityProfileParcelType}/{securityProfileParcelId}/referenced-by` | GetSdwanSecurityFeatureWithReferencedByDetailsByFeatureId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: policyObjectId, securityProfileParcelType, securityProfileParcelId |
| GET | `/dataservice/v1/feature-profile/sdwan/policy-object/{policyObjectListType}/schema` | GetSdwanPolicyObjectDataPrefixParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: policyObjectListType |
| GET | `/dataservice/v1/feature-profile/sdwan/service` | GetSdwanServiceFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 5 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/service` | CreateSdwanServiceFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}` | DeleteSdwanServiceFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}` | GetSdwanServiceFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}` | EditSdwanServiceFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/appqoe` | GetAppqoeProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/appqoe` | CreateAppqoeProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/appqoe/{appqoeId}` | DeleteAppqoeProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/appqoe/{appqoeId}` | GetAppqoeProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, appqoeId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/appqoe/{appqoeId}` | EditAppqoeProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/dhcp-server` | GetDhcpServerProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/dhcp-server` | CreateDhcpServerProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/dhcp-server/{dhcpServerId}` | DeleteDhcpServerProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/dhcp-server/{dhcpServerId}` | GetDhcpServerProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, dhcpServerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/dhcp-server/{dhcpServerId}` | EditDhcpServerProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/ios-ipv4-acl` | GetSdwanServiceIosIpv4AclFeatures | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/ios-ipv4-acl` | CreateSdwanServiceIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/ios-ipv4-acl/{iosIpv4AclId}` | DeleteSdwanServiceIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/ios-ipv4-acl/{iosIpv4AclId}` | GetSdwanServiceIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, iosIpv4AclId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/ios-ipv4-acl/{iosIpv4AclId}` | EditSdwanServiceIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn` | GetLanVpnProfileParcelForService_ConfigurationFeatureProfileSdwan_5303 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn` | CreateLanVpnProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}` | DeleteLanVpnProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}` | GetLanVpnProfileParcelByParcelIdForService_ConfigurationFeatureProfileSdwan_6103 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}` | EditLanVpnProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet` | GetInterfaceEthernetParcelsForServiceLanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet` | CreateLanVpnInterfaceEthernetParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}` | DeleteLanVpnInterfaceEthernetForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}` | GetLanVpnInterfaceEthernetParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}` | EditLanVpnInterfaceEthernetParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/dhcp-server` | GetLanVpnInterfaceEthernetAssociatedDhcpServerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ethernetId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/dhcp-server/{dhcpServerId}` | DeleteLanVpnInterfaceEthernetAndDhcpServerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/dhcp-server/{dhcpServerId}` | GetLanVpnInterfaceEthernetAssociatedDhcpServerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ethernetId, dhcpServerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/dhcp-server/{dhcpServerId}` | EditLanVpnInterfaceEthernetAndDhcpServerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker` | GetLanVpnInterfaceEthernetAssociatedTrackerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ethernetId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker/{trackerId}` | DeleteLanVpnInterfaceEthernetAndTrackerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker/{trackerId}` | GetLanVpnInterfaceEthernetAssociatedTrackerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ethernetId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker/{trackerId}` | EditLanVpnInterfaceEthernetAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup` | GetLanVpnInterfaceEthernetAssociatedTrackerGroupParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ethernetId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup/{trackergroupId}` | DeleteLanVpnInterfaceEthernetAndTrackerGroupAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup/{trackergroupId}` | GetLanVpnInterfaceEthernetAssociatedTrackerGroupParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ethernetId, trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup/{trackergroupId}` | EditLanVpnInterfaceEthernetAndTrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/gre` | GetInterfaceGresForServiceLanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/gre` | CreateLanVpnInterfaceGreForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/gre/{greId}` | DeleteLanVpnInterfaceGreForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/gre/{greId}` | GetLanVpnInterfaceGreByIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, greId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/gre/{greId}` | EditLanVpnInterfaceGreForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec` | getListOfProfileParcels_ConfigurationFeatureProfileSdwan_7703 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec` | createIpSecProfileParcel_ConfigurationFeatureProfileSdwan_7704 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec/{ipsecId}` | deleteProfileParcel_ConfigurationFeatureProfileSdwan_8706 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec/{ipsecId}` | getProfileParcelByParcelId_ConfigurationFeatureProfileSdwan_8703 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ipsecId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec/{ipsecId}` | editProfileParcel_ConfigurationFeatureProfileSdwan_8703 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec/{ipsecId}/dhcp-server` | GetLanVpnInterfaceIpsecAssociatedDhcpServerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ipsecId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec/{ipsecId}/dhcp-server/{dhcpServerId}` | DeleteLanVpnInterfaceIpsecAndDhcpServerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec/{ipsecId}/dhcp-server/{dhcpServerId}` | GetLanVpnInterfaceIpsecAssociatedDhcpServerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ipsecId, dhcpServerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/ipsec/{ipsecId}/dhcp-server/{dhcpServerId}` | EditLanVpnInterfaceIpsecAndDhcpServerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi` | GetInterfaceSviParcelsForServiceLanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi` | CreateLanVpnInterfaceSviParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi/{sviId}` | DeleteLanVpnInterfaceSviForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi/{sviId}` | GetLanVpnInterfaceSviParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, sviId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi/{sviId}` | EditLanVpnInterfaceSviParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi/{sviId}/dhcp-server` | GetLanVpnInterfaceSviAssociatedDhcpServerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, sviId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi/{sviId}/dhcp-server/{dhcpServerId}` | DeleteLanVpnInterfaceSviAndDhcpServerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi/{sviId}/dhcp-server/{dhcpServerId}` | GetLanVpnInterfaceSviAssociatedDhcpServerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, sviId, dhcpServerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/interface/svi/{sviId}/dhcp-server/{dhcpServerId}` | EditLanVpnInterfaceSviAndDhcpServerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/raw-socket` | GetRawSocketParcelsForServiceLanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/raw-socket` | CreateLanVpnRawSocketParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/raw-socket/{rawSocketId}` | DeleteLanVpnRawSocketForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/raw-socket/{rawSocketId}` | GetLanVpnRawSocketParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, rawSocketId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/raw-socket/{rawSocketId}` | EditLanVpnRawSocketParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/bgp` | GetLanVpnAssociatedRoutingBgpParcelsForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/bgp` | CreateLanVpnAndRoutingBgpParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/bgp/{bgpId}` | DeleteLanVpnAndRoutingBgpAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/bgp/{bgpId}` | GetLanVpnAssociatedRoutingBgpParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/bgp/{bgpId}` | EditLanVpnAndRoutingBgpParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/eigrp` | GetLanVpnAssociatedRoutingEigrpParcelsForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/eigrp` | CreateLanVpnAndRoutingEigrpParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/eigrp/{eigrpId}` | DeleteLanVpnAndRoutingEigrpAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/eigrp/{eigrpId}` | GetLanVpnAssociatedRoutingEigrpParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, eigrpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/eigrp/{eigrpId}` | EditLanVpnAndRoutingEigrpParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/multicast` | GetLanVpnAssociatedRoutingMulticastParcelsForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/multicast` | CreateLanVpnAndRoutingMulticastParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/multicast/{multicastId}` | DeleteLanVpnAndRoutingMulticastAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/multicast/{multicastId}` | GetLanVpnAssociatedRoutingMulticastParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, multicastId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/multicast/{multicastId}` | EditLanVpnAndRoutingMulticastParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospf` | GetLanVpnAssociatedRoutingOspfParcelsForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospf` | CreateLanVpnAndRoutingOspfParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospf/{ospfId}` | DeleteLanVpnAndRoutingOspfAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospf/{ospfId}` | GetLanVpnAssociatedRoutingOspfParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospf/{ospfId}` | EditLanVpnAndRoutingOspfParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv4` | GetLanVpnAssociatedRoutingOspfv3IPv4ParcelsForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv4` | CreateLanVpnAndRoutingOspfv3IPv4ParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteLanVpnAndRoutingOspfv3Ipv4AssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetLanVpnAssociatedRoutingOspfv3IPv4ParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditLanVpnAndRoutingOspfv3IPv4ParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv6` | GetLanVpnAssociatedRoutingOspfv3IPv6ParcelsForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv6` | CreateLanVpnAndRoutingOspfv3IPv6ParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteLanVpnAndRoutingOspfv3Ipv6AssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetLanVpnAssociatedRoutingOspfv3IPv6ParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, vpnId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditLanVpnAndRoutingOspfv3IPv6ParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnParcelId}/interface/ethernet/{ethernetId}/dhcp-server` | CreateLanVpnInterfaceEthernetAndDhcpServerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnParcelId}/interface/ethernet/{ethernetId}/tracker` | CreateLanVpnInterfaceEthernetAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnParcelId}/interface/ethernet/{ethernetId}/trackergroup` | CreateLanVpnInterfaceEthernetAndTrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnParcelId}/interface/ipsec/{ipsecId}/dhcp-server` | CreateLanVpnInterfaceIpsecAndDhcpServerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/lan/vpn/{vpnParcelId}/interface/svi/{sviId}/dhcp-server` | CreateLanVpnInterfaceSviAndDhcpServerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/bgp` | GetRoutingBgpProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/bgp` | CreateRoutingBgpProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/bgp/{bgpId}` | DeleteRoutingBgpProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/bgp/{bgpId}` | GetRoutingBgpProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/bgp/{bgpId}` | EditRoutingBgpProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/eigrp` | GetRoutingEigrpProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/eigrp` | CreateRoutingEigrpProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/eigrp/{eigrpId}` | DeleteRoutingEigrpProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/eigrp/{eigrpId}` | GetRoutingEigrpProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, eigrpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/eigrp/{eigrpId}` | EditRoutingEigrpProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/multicast` | GetRoutingMulticastProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/multicast` | CreateRoutingMulticastProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/multicast/{multicastId}` | DeleteRoutingMulticastProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/multicast/{multicastId}` | GetRoutingMulticastProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, multicastId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/multicast/{multicastId}` | EditRoutingMulticastProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospf` | GetRoutingOspfProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospf` | CreateRoutingOspfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospf/{ospfId}` | DeleteRoutingOspfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospf/{ospfId}` | GetRoutingOspfProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospf/{ospfId}` | EditRoutingOspfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv4` | GetRoutingOspfv3Ipv4AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv4` | CreateRoutingOspfv3Ipv4AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteRoutingOspfv3IPv4AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetRoutingOspfv3IPv4AfProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditRoutingOspfv3IPv4AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv6` | GetRoutingOspfv3Ipv6AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv6` | CreateRoutingOspfv3Ipv6AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteRoutingOspfv3IPv6AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetRoutingOspfv3IPv6AfProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditRoutingOspfv3IPv6AfProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/switchport` | GetSwitchportParcelsForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/switchport` | CedgeServiceProfileSwitchportParcelRestfulResource | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/switchport/{switchportId}` | DeleteSwitchportProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/switchport/{switchportId}` | GetSwitchportParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, switchportId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/switchport/{switchportId}` | EditSwitchportParcelAssociationForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/tracker` | GetTrackerProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/tracker` | CreateTrackerProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/tracker/{trackerId}` | DeleteTrackerProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/tracker/{trackerId}` | GetTrackerProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/tracker/{trackerId}` | EditTrackerProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/trackergroup` | GetTrackerGroupProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/trackergroup` | CreateTrackerGroupProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/trackergroup/{trackergroupId}` | DeleteTrackerGroupProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/trackergroup/{trackergroupId}` | GetTrackerGroupProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/trackergroup/{trackergroupId}` | EditTrackerGroupProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/wirelesslan` | GetWirelesslanProfileParcelForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId |
| POST | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/wirelesslan` | CreateWirelesslanProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/wirelesslan/{wirelesslanId}` | DeleteWirelesslanProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/wirelesslan/{wirelesslanId}` | GetWirelesslanProfileParcelByParcelIdForService | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: serviceId, wirelesslanId |
| PUT | `/dataservice/v1/feature-profile/sdwan/service/{serviceId}/wirelesslan/{wirelesslanId}` | EditWirelesslanProfileParcelForService | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/service/dhcp-server/schema` | GetSdwanServiceDhcpServerParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/lan/vpn/interface/ethernet/schema` | GetSdwanServiceLanVpnInterfaceEthernetParcelSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/lan/vpn/interface/gre/schema` | GetCedgeServiceLanVpnInterfaceGreSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/lan/vpn/interface/ipsec/schema` | getSdwanProfileParcelSchema_ConfigurationFeatureProfileSdwan_6403 | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/lan/vpn/interface/svi/schema` | GetCedgeServiceLanVpnInterfaceSviParcelSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/lan/vpn/schema` | GetSdwanServiceLanVpnParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/routing/bgp/schema` | GetSdwanServiceRoutingBgpParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/routing/multicast/schema` | GetSdwanServiceRoutingMulticastParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/switchport/schema` | GetCedgeServiceSwitchportParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/tracker/schema` | GetSdwanServiceTrackerParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/trackergroup/schema` | GetCedgeServiceTrackerGroupParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/service/wirelesslan/schema` | GetSdwanServiceWirelesslanParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/sig-security` | GetSdwanSigSecurityFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/sig-security` | CreateSdwanSigSecurityFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}` | DeleteSdwanSigSecurityFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}` | GetSdwanSigSecurityFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sigSecurityId |
| PUT | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}` | EditSdwanSigSecurityFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}/sig` | GetSigSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sigSecurityId |
| POST | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}/sig` | CreateSigSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}/sig/{sigSecurityProfileParcelId}` | DeleteSigSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}/sig/{sigSecurityProfileParcelId}` | GetSigSecurityProfileParcelByParcelId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sigSecurityId, sigSecurityProfileParcelId |
| PUT | `/dataservice/v1/feature-profile/sdwan/sig-security/{sigSecurityId}/sig/{sigSecurityProfileParcelId}` | EditSigSecurityProfileParcel | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-sbc` | GetSdwanSseSbcFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/sse-sbc` | CreateSdwanSseSbcFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}` | DeleteSdwanSseSbcFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}` | GetSdwanSseSbcFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sseSbcId |
| PUT | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}` | EditSdwanSseSbcFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}/sbc-configuration` | GetSbcConfigurationsForSseSbc | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sseSbcId |
| POST | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}/sbc-configuration` | CreateSbcConfigurationForSseSbc | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}/sbc-configuration/{sbcConfigurationId}` | DeleteSbcConfigurationForSseSbc | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}/sbc-configuration/{sbcConfigurationId}` | GetSbcConfigurationByIdForSseSbc | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sseSbcId, sbcConfigurationId |
| PUT | `/dataservice/v1/feature-profile/sdwan/sse-sbc/{sseSbcId}/sbc-configuration/{sbcConfigurationId}` | EditSbcConfigurationForSseSbc | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-sbc/sbc-configuration/schema` | GetSdwanSseSbcConfigurationSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-spa` | GetSdwanSseSpaFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 0 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/sse-spa` | CreateSdwanSseSpaFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}` | DeleteSdwanSseSpaFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}` | GetSdwanSseSpaFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sseSpaId |
| PUT | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}` | EditSdwanSseSpaFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}/spa-configuration` | GetSpaConfigurationsForSseSpa | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sseSpaId |
| POST | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}/spa-configuration` | CreateSpaConfigurationForSseSpa | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}/spa-configuration/{spaConfigurationId}` | DeleteSpaConfigurationForSseSpa | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}/spa-configuration/{spaConfigurationId}` | GetSpaConfigurationByIdForSseSpa | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: sseSpaId, spaConfigurationId |
| PUT | `/dataservice/v1/feature-profile/sdwan/sse-spa/{sseSpaId}/spa-configuration/{spaConfigurationId}` | EditSpaConfigurationForSseSpa | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/sse-spa/spa-configuration/schema` | GetSdwanSseSpaSpaConfigurationSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system` | GetSdwanSystemFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 2 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/system` | CreateSdwanSystemFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}` | DeleteSdwanSystemFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}` | GetSdwanSystemFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}` | EditSdwanSystemFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/aaa` | GetAaaProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/aaa` | CreateAaaProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/aaa/{aaaId}` | DeleteAaaProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/aaa/{aaaId}` | GetAaaProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, aaaId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/aaa/{aaaId}` | EditAaaProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/banner` | GetBannerProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/banner` | CreateBannerProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/banner/{bannerId}` | DeleteBannerProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/banner/{bannerId}` | GetBannerProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, bannerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/banner/{bannerId}` | EditBannerProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/basic` | GetBasicProfileFeatureForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/basic` | CreateBasicProfileFeatureForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/basic/{basicId}` | DeleteBasicProfileFeatureForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/basic/{basicId}` | GetBasicProfileFeatureByFeatureIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, basicId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/basic/{basicId}` | EditBasicProfileFeatureForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/bfd` | GetBfdProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/bfd` | CreateBfdProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/bfd/{bfdId}` | DeleteBfdProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/bfd/{bfdId}` | GetBfdProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, bfdId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/bfd/{bfdId}` | EditBfdProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/global` | GetGlobalProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/global` | CreateGlobalProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/global/{globalId}` | DeleteGlobalProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/global/{globalId}` | GetGlobalProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, globalId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/global/{globalId}` | EditGlobalProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ignition` | GetIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdwan_5203 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ignition` | CreateIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdwan_5204 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ignition/{ignitionId}` | DeleteIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdwan_6506 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ignition/{ignitionId}` | GetIgnitionProfileParcelByParcelIdForSystem_ConfigurationFeatureProfileSdwan_6503 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, ignitionId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ignition/{ignitionId}` | EditIgnitionProfileParcelForSystem_ConfigurationFeatureProfileSdwan_6503 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/logging` | GetLoggingProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/logging` | CreateLoggingProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/logging/{loggingId}` | DeleteLoggingProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/logging/{loggingId}` | GetLoggingProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, loggingId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/logging/{loggingId}` | EditLoggingProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/mrf` | GetMrfProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/mrf` | CreateMrfProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/mrf/{mrfId}` | DeleteMrfProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/mrf/{mrfId}` | GetMrfProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, mrfId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/mrf/{mrfId}` | EditMrfProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ntp` | GetNtpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ntp` | CreateNtpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ntp/{ntpId}` | DeleteNtpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ntp/{ntpId}` | GetNtpProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, ntpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/ntp/{ntpId}` | EditNtpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/omp` | GetOmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/omp` | CreateOmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/omp/{ompId}` | DeleteOmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/omp/{ompId}` | GetOmpProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, ompId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/omp/{ompId}` | EditOmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/security` | GetSecurityForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/security` | CreateSecurityForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/security/{securityId}` | DeleteSecurityForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/security/{securityId}` | GetSecurityBySecurityIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, securityId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/security/{securityId}` | EditSecurityForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/snmp` | GetSnmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId |
| POST | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/snmp` | CreateSnmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/snmp/{snmpId}` | DeleteSnmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/snmp/{snmpId}` | GetSnmpProfileParcelByParcelIdForSystem | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: systemId, snmpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/system/{systemId}/snmp/{snmpId}` | EditSnmpProfileParcelForSystem | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/system/aaa/schema` | GetSdwanSystemAaaParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/banner/schema` | GetSdwanSystemBannerParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/basic/schema` | GetSdwanSystemBasicFeatureSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/bfd/schema` | GetSdwanSystemBfdParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/global/schema` | GetCedgeSystemGlobalParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/logging/schema` | GetSdwanSystemLoggingParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/mrf/schema` | GetCedgeSystemMrfParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/ntp/schema` | GetSdwanSystemNtpParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/omp/schema` | GetSdwanSystemOmpParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/system/snmp/schema` | GetSdwanSystemSnmpParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport` | GetSdwanTransportFeatureProfiles | Configuration - Feature Profile (SDWAN) | read | Verified live | 4 rows |
| POST | `/dataservice/v1/feature-profile/sdwan/transport` | CreateSdwanTransportFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}` | DeleteSdwanTransportFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}` | GetSdwanTransportFeatureProfileByProfileId | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}` | EditSdwanTransportFeatureProfile | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-bandselect` | GetCellular-bandselectProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-bandselect` | CreateBandSelectFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-bandselect/{bandSelectId}` | DeleteCellular-bandselectFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-bandselect/{bandSelectId}` | GetCellular-bandselectProfileFeatureByFeatureIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, bandSelectId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-bandselect/{bandSelectId}` | EditBandSelectFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller` | GetCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6903 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller` | CreateCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6904 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}` | DeleteCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_9206 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}` | GetCellularControllerProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdwan_9203 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}` | EditCellularControllerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_9203 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect` | GetCellularControllerAssociatedCellularBandSelectForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect` | CreateCellularControllerAndCellularBandSelectAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect/{cellularBandSelectId}` | DeleteCellularControllerAndCellularBandSelectAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect/{cellularBandSelectId}` | GetCellularControllerAssociatedCellularBandSelectByIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId, cellularBandSelectId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-bandselect/{cellularBandSelectId}` | EditCellularControllerAndCellularBandSelectAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile` | GetCellularControllerAssociatedCellularProfileParcelsForTransport_ConfigurationFeatureProfileSdwan_10903 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile` | CreateCellularControllerAndCellularProfileParcelAssociationForTransport_ConfigurationFeatureProfileSdwan_10904 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile/{cellularProfileId}` | DeleteCellularControllerAndCellularProfileAssociationForTransport_ConfigurationFeatureProfileSdwan_12906 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile/{cellularProfileId}` | GetCellularControllerAssociatedCellularProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdwan_12903 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId, cellularProfileId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/cellular-profile/{cellularProfileId}` | EditCellularControllerAndCellularProfileParcelAssociationForTransport_ConfigurationFeatureProfileSdwan_12903 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp` | GetCellularControllerAssociatedDyingGaspParcelsForTransport_ConfigurationFeatureProfileSdwan_10303 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp` | CreateCellularControllerAndDyingGaspParcelAssociationForTransport_ConfigurationFeatureProfileSdwan_10304 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp/{dyingGaspId}` | DeleteCellularControllerAndDyingGaspAssociationForTransport_ConfigurationFeatureProfileSdwan_11706 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp/{dyingGaspId}` | GetCellularControllerAssociatedDyingGaspParcelByParcelIdForTransport_ConfigurationFeatureProfileSdwan_11703 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId, dyingGaspId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/dying-gasp/{dyingGaspId}` | EditCellularControllerAndDyingGaspParcelAssociationForTransport_ConfigurationFeatureProfileSdwan_11703 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/gps` | GetCellularControllerAssociatedGpsParcelsForTransport_ConfigurationFeatureProfileSdwan_9603 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/gps` | CreateCellularControllerAndGpsParcelAssociationForTransport_ConfigurationFeatureProfileSdwan_9604 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/gps/{gpsId}` | DeleteCellularControllerAndGpsAssociationForTransport_ConfigurationFeatureProfileSdwan_10406 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/gps/{gpsId}` | GetCellularControllerAssociatedGpsParcelByParcelIdForTransport_ConfigurationFeatureProfileSdwan_10403 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularControllerId, gpsId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-controller/{cellularControllerId}/gps/{gpsId}` | EditCellularControllerAndGpsParcelAssociationForTransport_ConfigurationFeatureProfileSdwan_10403 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-profile` | GetCellularProfileProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-profile` | CreateCellularProfileProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-profile/{cellularProfileId}` | DeleteCellularProfileProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-profile/{cellularProfileId}` | GetCellularProfileProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, cellularProfileId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/cellular-profile/{cellularProfileId}` | EditCellularProfileProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/dying-gasp` | GetDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6003 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/dying-gasp` | CreateDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6004 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/dying-gasp/{dyingGaspId}` | DeleteDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdwan_7406 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/dying-gasp/{dyingGaspId}` | GetDyingGaspProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdwan_7403 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, dyingGaspId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/dying-gasp/{dyingGaspId}` | EditDyingGaspProfileParcelForTransport_ConfigurationFeatureProfileSdwan_7403 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-controller` | GetEsimCellularControllerProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-controller` | CreateEsimCellularControllerProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-controller/{esimCellularControllerId}` | DeleteEsimCellularControllerProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-controller/{esimCellularControllerId}` | GetEsimCellularControllerProfileFeatureByFeatureIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, esimCellularControllerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-controller/{esimCellularControllerId}` | EditEsimCellularControllerProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-profile` | GetEsimCellularProfileProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-profile` | CreateEsimCellularProfileProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-profile/{esimCellularProfileId}` | DeleteEsimCellularProfileProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-profile/{esimCellularProfileId}` | GetEsimCellularProfileByFeatureIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, esimCellularProfileId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/esimcellular-profile/{esimCellularProfileId}` | EditEsimCellularProfileProfileFeatureForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/gps` | GetGpsProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/gps` | CreateGpsProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/gps/{gpsId}` | DeleteGpsProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/gps/{gpsId}` | GetGpsProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, gpsId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/gps/{gpsId}` | EditGpsProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ios-ipv4-acl` | GetSdwanTransportIosIpv4AclFeatures | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ios-ipv4-acl` | CreateSdwanTransportIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ios-ipv4-acl/{iosIpv4AclId}` | DeleteSdwanTransportIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ios-ipv4-acl/{iosIpv4AclId}` | GetSdwanTransportIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, iosIpv4AclId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ios-ipv4-acl/{iosIpv4AclId}` | EditSdwanTransportIosIpv4AclFeature | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-tracker` | GetIpv6TrackerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-tracker` | CreateIpv6TrackerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-tracker/{ipv6-trackerId}` | DeleteIpv6TrackerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-tracker/{ipv6-trackerId}` | GetIpv6TrackerProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, ipv6-trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-tracker/{ipv6-trackerId}` | EditIpv6TrackerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-trackergroup` | GetIpv6TrackerGroupProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-trackergroup` | CreateIpv6TrackerGroupProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-trackergroup/{ipv6-trackergroupId}` | DeleteIpv6TrackerGroupProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-trackergroup/{ipv6-trackergroupId}` | GetIpv6TrackerGroupProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, ipv6-trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/ipv6-trackergroup/{ipv6-trackergroupId}` | EditIpv6TrackerGroupProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn` | GetManagementVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn` | CreateManagementVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}` | DeleteManagementVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}` | GetManagementVpnProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}` | EditManagementVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}/interface/ethernet` | GetInterfaceEthernetParcelsForTransportManagementVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}/interface/ethernet` | CreateManagementVpnInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}/interface/ethernet/{ethernetId}` | DeleteManagementVpnInterfaceEthernetForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}/interface/ethernet/{ethernetId}` | GetManagementVpnInterfaceEthernetParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/management/vpn/{vpnId}/interface/ethernet/{ethernetId}` | EditManagementVpnInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/bgp` | GetRoutingBgpProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/bgp` | CreateRoutingBgpProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/bgp/{bgpId}` | DeleteRoutingBgpProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/bgp/{bgpId}` | GetRoutingBgpProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/bgp/{bgpId}` | EditRoutingBgpProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospf` | GetRoutingOspfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospf` | CreateRoutingOspfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospf/{ospfId}` | DeleteRoutingOspfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospf/{ospfId}` | GetRoutingOspfProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospf/{ospfId}` | EditRoutingOspfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv4` | GetRoutingOspfv3Ipv4AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv4` | CreateRoutingOspfv3Ipv4AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteRoutingOspfv3Ipv4AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetRoutingOspfv3Ipv4AfProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditRoutingOspfv3Ipv4AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv6` | GetRoutingOspfv3Ipv6AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv6` | CreateRoutingOspfv3Ipv6AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteRoutingOspfv3Ipv6AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetRoutingOspfv3Ipv6AfProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditRoutingOspfv3Ipv6AfProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/t1-e1-controller` | GetT1e1controllerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/t1-e1-controller` | CreateT1e1controllerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/t1-e1-controller/{t1e1controllerId}` | DeleteT1e1controllerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/t1-e1-controller/{t1e1controllerId}` | GetT1e1controllerProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, t1e1controllerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/t1-e1-controller/{t1e1controllerId}` | EditT1e1controllerProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/tracker` | GetTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_5703 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/tracker` | CreateTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_5704 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/tracker/{trackerId}` | DeleteTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6906 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/tracker/{trackerId}` | GetTrackerProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdwan_6903 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/tracker/{trackerId}` | EditTrackerProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6903 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/trackergroup` | GetTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6203 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/trackergroup` | CreateTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdwan_6204 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/trackergroup/{trackergroupId}` | DeleteTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdwan_7906 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/trackergroup/{trackergroupId}` | GetTrackerGroupProfileParcelByParcelIdForTransport_ConfigurationFeatureProfileSdwan_7903 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/trackergroup/{trackergroupId}` | EditTrackerGroupProfileParcelForTransport_ConfigurationFeatureProfileSdwan_7903 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn` | GetWanVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn` | CreateWanVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}` | DeleteWanVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}` | GetWanVpnProfileParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}` | EditWanVpnProfileParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular` | GetInterfaceCellularParcelsForTransportWanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular` | CreateWanVpnInterfaceCellularParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-tracker` | GetWanVpnInterfaceCellularAssociatedIpv6TrackerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-tracker/{ipv6-trackerId}` | DeleteWanVpnInterfaceCellularAndIpv6TrackerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-tracker/{ipv6-trackerId}` | GetWanVpnInterfaceCellularAssociatedIpv6TrackerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId, ipv6-trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-tracker/{ipv6-trackerId}` | EditWanVpnInterfaceCellularAndIpv6TrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-trackergroup` | GetWanVpnInterfaceCellularAssociatedIpv6TrackerGroupParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-trackergroup/{ipv6-trackergroupId}` | DeleteWanVpnInterfaceCellularAndIpv6TrackerGroupAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-trackergroup/{ipv6-trackergroupId}` | GetWanVpnInterfaceCellularAssociatedIpv6TrackerGroupParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId, ipv6-trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/ipv6-trackergroup/{ipv6-trackergroupId}` | EditWanVpnInterfaceCellularAndIpv6TrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/tracker` | GetWanVpnInterfaceCellularAssociatedTrackerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/tracker/{trackerId}` | DeleteWanVpnInterfaceCellularAndTrackerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/tracker/{trackerId}` | GetWanVpnInterfaceCellularAssociatedTrackerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/tracker/{trackerId}` | EditWanVpnInterfaceCellularAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/trackergroup` | GetWanVpnInterfaceCellularAssociatedTrackerGroupParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/trackergroup/{trackerGroupId}` | DeleteWanVpnInterfaceCellularAndTrackerGroupAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/trackergroup/{trackerGroupId}` | GetWanVpnInterfaceCellularAssociatedTrackerGroupParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, cellularId, trackerGroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{cellularId}/trackergroup/{trackerGroupId}` | EditWanVpnInterfaceCellularAndTrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{intfId}` | DeleteWanVpnInterfaceCellularForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{intfId}` | GetWanVpnInterfaceCellularParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, intfId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/cellular/{intfId}` | EditWanVpnInterfaceCellularParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet` | GetInterfaceEthernetParcelsForTransportWanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet` | CreateWanVpnInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}` | DeleteWanVpnInterfaceEthernetForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}` | GetWanVpnInterfaceEthernetParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}` | EditWanVpnInterfaceEthernetParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-tracker` | GetWanVpnInterfaceEthernetAssociatedIpv6TrackerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-tracker/{ipv6-trackerId}` | DeleteWanVpnInterfaceEthernetAndIpv6TrackerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-tracker/{ipv6-trackerId}` | GetWanVpnInterfaceEthernetAssociatedIpv6TrackerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId, ipv6-trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-tracker/{ipv6-trackerId}` | EditWanVpnInterfaceEthernetAndIpv6TrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-trackergroup` | GetWanVpnInterfaceEthernetAssociatedIpv6TrackerGroupParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-trackergroup/{ipv6-trackergroupId}` | DeleteWanVpnInterfaceEthernetAndIpv6TrackerGroupAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-trackergroup/{ipv6-trackergroupId}` | GetWanVpnInterfaceEthernetAssociatedIpv6TrackerGroupParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId, ipv6-trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/ipv6-trackergroup/{ipv6-trackergroupId}` | EditWanVpnInterfaceEthernetAndIpv6TrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker` | GetWanVpnInterfaceEthernetAssociatedTrackerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker/{trackerId}` | DeleteWanVpnInterfaceEthernetAndTrackerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker/{trackerId}` | GetWanVpnInterfaceEthernetAssociatedTrackerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/tracker/{trackerId}` | EditWanVpnInterfaceEthernetAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup` | GetWanVpnInterfaceEthernetAssociatedTrackerGroupParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup/{trackergroupId}` | DeleteWanVpnInterfaceEthernetAndTrackerGroupAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup/{trackergroupId}` | GetWanVpnInterfaceEthernetAssociatedTrackerGroupParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ethernetId, trackergroupId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ethernet/{ethernetId}/trackergroup/{trackergroupId}` | EditWanVpnInterfaceEthernetAndTrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre` | GetInterfaceGreParcelsForTransportWanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre` | CreateWanVpnInterfaceGreParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}` | DeleteWanVpnInterfaceGreForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}` | GetWanVpnInterfaceGreParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, greId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}` | EditWanVpnInterfaceGreParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}/tracker` | GetWanVpnInterfaceGreAssociatedTrackerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, greId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}/tracker` | CreateWanVpnInterfaceGreAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}/tracker/{trackerId}` | DeleteWanVpnInterfaceGreAndTrackerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}/tracker/{trackerId}` | GetWanVpnInterfaceGreAssociatedTrackerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, greId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/gre/{greId}/tracker/{trackerId}` | EditWanVpnInterfaceGreAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec` | getListOfProfileParcels_ConfigurationFeatureProfileSdwan_8103 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec` | createIpSecProfileParcel_ConfigurationFeatureProfileSdwan_8104 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec/{ipsecId}` | deleteProfileParcel_ConfigurationFeatureProfileSdwan_9106 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec/{ipsecId}` | getProfileParcelByParcelId_ConfigurationFeatureProfileSdwan_9103 | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ipsecId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec/{ipsecId}` | editProfileParcel_ConfigurationFeatureProfileSdwan_9103 | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec/{ipsecId}/tracker` | GetWanVpnInterfaceIpsecAssociatedTrackerParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ipsecId |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec/{ipsecId}/tracker/{trackerId}` | DeleteWanVpnInterfaceIpsecAndTrackerAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec/{ipsecId}/tracker/{trackerId}` | GetWanVpnInterfaceIpsecAssociatedTrackerParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ipsecId, trackerId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/ipsec/{ipsecId}/tracker/{trackerId}` | EditWanVpnInterfaceIpsecAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/serial` | GetInterfaceSerialParcelsForTransportWanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/serial` | CreateWanVpnInterfaceSerialParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/serial/{serialId}` | DeleteWanVpnInterfaceSerialForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/serial/{serialId}` | GetWanVpnInterfaceSerialParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, serialId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/interface/serial/{serialId}` | EditWanVpnInterfaceSerialParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/raw-socket` | GetRawSocketParcelsForTransportWanVpn | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/raw-socket` | CreateWanVpnRawSocketParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/raw-socket/{rawSocketId}` | DeleteWanVpnRawSocketForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/raw-socket/{rawSocketId}` | GetWanVpnRawSocketParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, rawSocketId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/raw-socket/{rawSocketId}` | EditWanVpnRawSocketParcelForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/bgp` | GetWanVpnAssociatedRoutingBgpParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/bgp` | CreateWanVpnAndRoutingBgpParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/bgp/{bgpId}` | DeleteWanVpnAndRoutingBgpAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/bgp/{bgpId}` | GetWanVpnAssociatedRoutingBgpParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, bgpId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/bgp/{bgpId}` | EditWanVpnAndRoutingBgpParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospf` | GetWanVpnAssociatedRoutingOspfParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospf` | CreateWanVpnAndRoutingOspfParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospf/{ospfId}` | DeleteWanVpnAndRoutingOspfAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospf/{ospfId}` | GetWanVpnAssociatedRoutingOspfParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ospfId |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospf/{ospfId}` | EditWanVpnAndRoutingOspfParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv4` | GetWanVpnAssociatedRoutingOspfv3IPv4AfParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv4` | CreateWanVpnAndRoutingOspfv3Ipv4AfParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv4/{ospfv3Id}` | DeleteWanVpnAndRoutingOspfv3IPv4AssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv4/{ospfv3Id}` | GetWanVpnAssociatedRoutingOspfv3IPv4AfParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv4/{ospfv3Id}` | EditWanVpnAndRoutingOspfv3IPv4AfParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv6` | GetWanVpnAssociatedRoutingOspfv3IPv6AfParcelsForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv6` | CreateWanVpnAndRoutingOspfv3Ipv6AfParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv6/{ospfv3Id}` | DeleteWanVpnAndRoutingOspfv3IPv6AssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv6/{ospfv3Id}` | GetWanVpnAssociatedRoutingOspfv3IPv6AfParcelByParcelIdForTransport | Configuration - Feature Profile (SDWAN) | read | Read (needs IDs) | path: transportId, vpnId, ospfv3Id |
| PUT | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnId}/routing/ospfv3/ipv6/{ospfv3Id}` | EditWanVpnAndRoutingOspfv3IPv6AfParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/cellular/{cellularId}/ipv6-tracker` | CreateWanVpnInterfaceCellularAndIpv6TrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/cellular/{cellularId}/ipv6-trackergroup` | CreateWanVpnInterfaceCellularAndIpv6TrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/cellular/{cellularId}/tracker` | CreateWanVpnInterfaceCellularAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/cellular/{cellularId}/trackergroup` | CreateWanVpnInterfaceCellularAndTrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/ethernet/{ethernetId}/ipv6-tracker` | CreateWanVpnInterfaceEthernetAndIpv6TrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/ethernet/{ethernetId}/ipv6-trackergroup` | CreateWanVpnInterfaceEthernetAndIpv6TrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/ethernet/{ethernetId}/tracker` | CreateWanVpnInterfaceEthernetAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/ethernet/{ethernetId}/trackergroup` | CreateWanVpnInterfaceEthernetAndTrackerGroupParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/feature-profile/sdwan/transport/{transportId}/wan/vpn/{vpnParcelId}/interface/ipsec/{ipsecId}/tracker` | CreateWanVpnInterfaceIpsecAndTrackerParcelAssociationForTransport | Configuration - Feature Profile (SDWAN) | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/cellular-controller/schema` | GetSdwanTransportCellularControllerParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/cellular-profile/schema` | GetSdwanTransportCellularProfileParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/ipv6-tracker/schema` | GetSdwanTransportIpv6TrackerParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/ipv6-trackergroup/schema` | GetCedgeTransportIpv6TrackerGroupParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/management/vpn/interface/ethernet/schema` | GetSdwanTransportManagementVpnInterfaceEthernetParcelSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/management/vpn/schema` | GetSdwanTransportManagementVpnParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/routing/bgp/schema` | GetSdwanTransportRoutingBgpParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/t1-e1-controller/schema` | GetCedgeTransportT1e1controllerParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/tracker/schema` | GetSdwanTransportTrackerParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/trackergroup/schema` | GetCedgeTransportTrackerGroupParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/wan/vpn/interface/cellular/schema` | GetSdwanTransportWanVpnCellularInterfaceParcelSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/wan/vpn/interface/ethernet/schema` | GetSdwanTransportWanVpnInterfaceEthernetParcelSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/wan/vpn/interface/gre/schema` | GetCedgeTransportWanVpnInterfaceGreParcelSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/wan/vpn/interface/ipsec/schema` | getSdwanProfileParcelSchema_ConfigurationFeatureProfileSdwan_6603 | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/wan/vpn/interface/serial/schema` | GetCedgeTransportWanVpnInterfaceSerialParcelSchemaBySchema | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| GET | `/dataservice/v1/feature-profile/sdwan/transport/wan/vpn/schema` | GetSdwanTransportWanVpnParcelSchemaBySchemaType | Configuration - Feature Profile (SDWAN) | read | Verified live | object |
| DELETE | `/dataservice/template/policy/list/fqdn` | deletePolicyListsWithInfoTag_ConfigurationFqdnListBuilder_2606 | Configuration - FQDN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/fqdn` | getPolicyLists_ConfigurationFqdnListBuilder_2603 | Configuration - FQDN List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/fqdn` | createPolicyList_ConfigurationFqdnListBuilder_2604 | Configuration - FQDN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/fqdn/{id}` | deletePolicyList_ConfigurationFqdnListBuilder_3106 | Configuration - FQDN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/fqdn/{id}` | getListsById_ConfigurationFqdnListBuilder_3103 | Configuration - FQDN List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/fqdn/{id}` | editPolicyList_ConfigurationFqdnListBuilder_3103 | Configuration - FQDN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/fqdn/filtered` | getPolicyListsWithInfoTag_ConfigurationFqdnListBuilder_3503 | Configuration - FQDN List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/fqdn/preview` | previewPolicyList_ConfigurationFqdnListBuilder_3404 | Configuration - FQDN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/fqdn/preview/{id}` | previewPolicyListById_ConfigurationFqdnListBuilder_3903 | Configuration - FQDN List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/feature` | generateFeatureTemplateList | Configuration - General Template | read | Verified live | 137 rows |
| POST | `/dataservice/template/feature` | createFeatureTemplate | Configuration - General Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/feature/{deviceType}` | generateTemplateByDeviceType | Configuration - General Template | read | Read (needs IDs) | path: deviceType |
| DELETE | `/dataservice/template/feature/{templateId}` | deleteGeneralTemplate | Configuration - General Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/feature/{templateId}` | editFeatureTemplate | Configuration - General Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/feature/clone` | cloneTemplate | Configuration - General Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/feature/default/networkinterface` | getNetworkInterface | Configuration - General Template | read | Verified live | 1 rows |
| GET | `/dataservice/template/feature/default/networks` | getDefaultNetworks | Configuration - General Template | read | Verified live | 31 rows |
| GET | `/dataservice/template/feature/definition/{templateId}` | getTemplateDefinition | Configuration - General Template | read | Read (needs IDs) | path: templateId |
| GET | `/dataservice/template/feature/devicetemplates/{templateId}` | getDeviceTemplatesAttachedToFeature | Configuration - General Template | read | Read (needs IDs) | path: templateId |
| GET | `/dataservice/template/feature/li` | listLITemplate | Configuration - General Template | read | Live error (HTTP 403) | vManage API error 403: Access forbidden: role not allowed |
| POST | `/dataservice/template/feature/li` | createLITemplate | Configuration - General Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/feature/li/{templateId}` | editLITemplate | Configuration - General Template | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/feature/master/{type_name}` | generateMasterTemplateDefinition | Configuration - General Template | read | Read (needs IDs) | path: type_name |
| GET | `/dataservice/template/feature/migration` | getTemplateForMigration | Configuration - General Template | read | Verified live | 0 rows |
| GET | `/dataservice/template/feature/object/{templateId}` | getGeneralTemplate | Configuration - General Template | read | Read (needs IDs) | path: templateId |
| POST | `/dataservice/template/feature/resource-group/{resourceGroupName}/{templateId}` | changeTemplateResourceGroup_ConfigurationGeneralTemplate_6504 | Configuration - General Template | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/feature/types` | generateTemplateTypes | Configuration - General Template | read | Verified live | 97 rows |
| GET | `/dataservice/template/feature/types/definition/{type_name}/{version}` | generateTemplateTypeDefinition | Configuration - General Template | read | Read (needs IDs) | path: type_name, version |
| POST | `/dataservice/template/security/encryptText/encrypt` | getEncryptedString | Configuration - General Template | read | Read (needs input) | query body |
| GET | `/dataservice/ise/connect` | connect_ConfigurationIseServer_1203 | Configuration - Ise Server | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/ise/credentials` | getIseServerCredentials | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/ise/credentials` | addIseServerCredentials | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| PUT | `/dataservice/ise/credentials` | updateIseServerCredentials | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| DELETE | `/dataservice/ise/credentials/iseandpxgrid` | deleteIseAndPxGridAccount | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| DELETE | `/dataservice/ise/credentials/pxgrid` | deletePxGrid | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/ise/credentials/pxgrid` | getPxGridAccount | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/ise/credentials/pxgrid/cert` | getPxgridCert | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/ise/credentials/vsmart/sync` | syncVsmart | Configuration - Ise Server | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/ise/pxgrid/activate` | accountActivate | Configuration - Ise Server | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/ise/pxgrid/approve` | approve | Configuration - Ise Server | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/ise/pxgrid/create` | accountCreate | Configuration - Ise Server | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/ise/identity/deleteAllLists` | deleteAllLists | Configuration - Ise Server | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/ise/identity/referenced/{listType}` | getListReference | Configuration - Ise Server | read | Read (needs IDs) | path: listType |
| GET | `/dataservice/template/policy/ise/identity/sgt` | sgts | Configuration - Ise Server | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Failed to fetch Scalable Group Tags","code":"ISEERRORR0025","details":"Failed to Fetch SGTs"}} |
| POST | `/dataservice/template/policy/ise/identity/usergroups` | getIdentityUserGroups | Configuration - Ise Server | read | Read (needs input) | query body |
| POST | `/dataservice/template/policy/ise/identity/users` | getIdentityUsers | Configuration - Ise Server | read | Read (needs input) | query body |
| GET | `/dataservice/device/action/status/mw` | getMaintenanceWindowFlag | Configuration - Maintenance window flag | read | Verified live | object |
| POST | `/dataservice/device/action/status/mw` | updateMaintenanceWindowFlag | Configuration - Maintenance window flag | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/mdp/attachDevices/{nmsId}` | getMappedDevices | Configuration - Multidomain Policy | read | Read (needs IDs) | path: nmsId |
| POST | `/dataservice/mdp/attachDevices/{nmsId}` | attachDevices | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/mdp/attachDevices/{nmsId}` | updateAttachedDevices | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/mdp/detachDevices/{nmsId}` | detachDevices | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/mdp/devices/{nmsId}` | getDevices_ConfigurationMultidomainPolicy_2003 | Configuration - Multidomain Policy | read | Read (needs IDs) | path: nmsId |
| GET | `/dataservice/mdp/disconnect/{nmsId}` | disconnectMDP | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/mdp/onboard` | onboardMDP | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/mdp/onboard/{nmsId}` | deleteOnboardingPayload | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/mdp/onboard/{nmsId}` | updateOnboardingPayload | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/mdp/onboard/status` | getOnboardingPayload | Configuration - Multidomain Policy | read | Verified live | object |
| GET | `/dataservice/mdp/policies/{nmsId}` | getPolicies | Configuration - Multidomain Policy | read | Read (needs IDs) | path: nmsId |
| PUT | `/dataservice/mdp/policies/{nmsId}` | updatePolicyStatus | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/mdp/policies/mdpconfig` | addInternalPolicy | Configuration - Multidomain Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/mdp/policies/mdpconfig/{deviceId}` | getMdpConfig | Configuration - Multidomain Policy | read | Read (needs IDs) | path: deviceId |
| GET | `/dataservice/networkdesign` | getNetworkDesign | Configuration - Network Design | read (deprecated) | Verified live | 0 rows |
| POST | `/dataservice/networkdesign` | createNetworkDesign | Configuration - Network Design | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/networkdesign` | editNetworkDesign | Configuration - Network Design | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/networkdesign/attachment` | pushNetworkDesign | Configuration - Network Design | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/networkdesign/global/parameters` | getGlobalParameters | Configuration - Network Design | read (deprecated) | Verified live | 15 rows |
| POST | `/dataservice/networkdesign/lock/edit` | acquireEditLock | Configuration - Network Design | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/networkdesign/mytest/{name}` | runMyTest | Configuration - Network Design | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/networkdesign/profile/attachment/{profileId}` | pushDeviceProfileTemplate | Configuration - Network Design | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/networkdesign/profile/lock/{profileId}` | acquireAttachLock | Configuration - Network Design | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/networkdesign/profile/status` | getDeviceProfileConfigStatus | Configuration - Network Design | read (deprecated) | Verified live | 0 rows |
| GET | `/dataservice/networkdesign/profile/status/{profileId}` | getDeviceProfileConfigStatusByProfileId | Configuration - Network Design | read (deprecated) | Read (needs IDs) | path: profileId |
| GET | `/dataservice/networkdesign/profile/task/count` | getDeviceProfileTaskCount | Configuration - Network Design | read (deprecated) | Verified live | object |
| GET | `/dataservice/networkdesign/profile/task/status` | getDeviceProfileTaskStatus | Configuration - Network Design | read (deprecated) | Verified live | 0 rows |
| GET | `/dataservice/networkdesign/profile/task/status/{profileId}` | getDeviceProfileTaskStatusByProfileId | Configuration - Network Design | read (deprecated) | Read (needs IDs) | path: profileId |
| GET | `/dataservice/networkdesign/serviceProfileConfig/{profileId}` | getServiceProfileConfig | Configuration - Network Design | read (deprecated) | Read (needs IDs) | path: profileId |
| GET | `/dataservice/networkdesign/global/template/{templateId}` | getGlobalTemplate | Configuration - Network Design Templates | read (deprecated) | Read (needs IDs) | path: templateId |
| PUT | `/dataservice/networkdesign/global/template/{templateId}` | editGlobalTemplate | Configuration - Network Design Templates | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/networkdesign/profile/feature` | getDeviceProfileFeatureTemplateList | Configuration - Network Design Templates | read (deprecated) | Verified live | 146 rows |
| GET | `/dataservice/networkdesign/profile/template` | generateProfileTemplateList | Configuration - Network Design Templates | read (deprecated) | Verified live | 0 rows |
| GET | `/dataservice/networkdesign/profile/template/{templateId}` | getDeviceProfileTemplate | Configuration - Network Design Templates | read (deprecated) | Read (needs IDs) | path: templateId |
| PUT | `/dataservice/networkdesign/profile/template/{templateId}` | editDeviceProfileTemplate | Configuration - Network Design Templates | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/acl` | getDefinitions_ConfigurationPolicyAccessListDefinitionBuilder_3103 | Configuration - Policy Access List Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/acl` | createPolicyDefinition_ConfigurationPolicyAccessListDefinitionBuilder_3104 | Configuration - Policy Access List Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/acl/{id}` | deletePolicyDefinition_ConfigurationPolicyAccessListDefinitionBuilder_3606 | Configuration - Policy Access List Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/acl/{id}` | getPolicyDefinition_ConfigurationPolicyAccessListDefinitionBuilder_3603 | Configuration - Policy Access List Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/acl/{id}` | editPolicyDefinition_ConfigurationPolicyAccessListDefinitionBuilder_3603 | Configuration - Policy Access List Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/acl/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyAccessListDefinitionBuilder_3603 | Configuration - Policy Access List Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/acl/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyAccessListDefinitionBuilder_4503 | Configuration - Policy Access List Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/acl/preview` | previewPolicyDefinition_ConfigurationPolicyAccessListDefinitionBuilder_3904 | Configuration - Policy Access List Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/acl/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyAccessListDefinitionBuilder_4403 | Configuration - Policy Access List Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/advancedMalwareProtection` | getDefinitions_ConfigurationPolicyAmpDefinitionBuilder_5303 | Configuration - Policy AMP Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/advancedMalwareProtection` | createPolicyDefinition_ConfigurationPolicyAmpDefinitionBuilder_5304 | Configuration - Policy AMP Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/advancedMalwareProtection/{id}` | deletePolicyDefinition_ConfigurationPolicyAmpDefinitionBuilder_5806 | Configuration - Policy AMP Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/advancedMalwareProtection/{id}` | getPolicyDefinition_ConfigurationPolicyAmpDefinitionBuilder_5803 | Configuration - Policy AMP Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/advancedMalwareProtection/{id}` | editPolicyDefinition_ConfigurationPolicyAmpDefinitionBuilder_5803 | Configuration - Policy AMP Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/advancedMalwareProtection/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyAmpDefinitionBuilder_5803 | Configuration - Policy AMP Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/advancedMalwareProtection/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyAmpDefinitionBuilder_6703 | Configuration - Policy AMP Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/advancedMalwareProtection/preview` | previewPolicyDefinition_ConfigurationPolicyAmpDefinitionBuilder_6104 | Configuration - Policy AMP Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/advancedMalwareProtection/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyAmpDefinitionBuilder_6603 | Configuration - Policy AMP Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/appprobe` | deletePolicyListsWithInfoTag_ConfigurationPolicyAppProbeClassListBuilder_3006 | Configuration - Policy App Probe Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/appprobe` | getPolicyLists_ConfigurationPolicyAppProbeClassListBuilder_3003 | Configuration - Policy App Probe Class List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/appprobe` | createPolicyList_ConfigurationPolicyAppProbeClassListBuilder_3004 | Configuration - Policy App Probe Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/appprobe/{id}` | deletePolicyList_ConfigurationPolicyAppProbeClassListBuilder_3506 | Configuration - Policy App Probe Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/appprobe/{id}` | getListsById_ConfigurationPolicyAppProbeClassListBuilder_3503 | Configuration - Policy App Probe Class List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/appprobe/{id}` | editPolicyList_ConfigurationPolicyAppProbeClassListBuilder_3503 | Configuration - Policy App Probe Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/appprobe/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyAppProbeClassListBuilder_3903 | Configuration - Policy App Probe Class List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/appprobe/preview` | previewPolicyList_ConfigurationPolicyAppProbeClassListBuilder_3804 | Configuration - Policy App Probe Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/appprobe/preview/{id}` | previewPolicyListById_ConfigurationPolicyAppProbeClassListBuilder_4303 | Configuration - Policy App Probe Class List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/app-registry/applications` | getAppList | Configuration - Policy App Registry | read | Verified live | object |
| PUT | `/dataservice/app-registry/applications` | editAppDetails | Configuration - Policy App Registry | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/app-registry/applications/{appId}` | editAppDetailsWithUUID | Configuration - Policy App Registry | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/app` | deletePolicyListsWithInfoTag_ConfigurationPolicyApplicationListBuilder_2506 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/app` | getPolicyLists_ConfigurationPolicyApplicationListBuilder_2503 | Configuration - Policy Application List Builder | read | Verified live | 22 rows |
| POST | `/dataservice/template/policy/list/app` | createPolicyList_ConfigurationPolicyApplicationListBuilder_2504 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/app/{id}` | deletePolicyList_ConfigurationPolicyApplicationListBuilder_3006 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/app/{id}` | getListsById_ConfigurationPolicyApplicationListBuilder_3003 | Configuration - Policy Application List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/app/{id}` | editPolicyList_ConfigurationPolicyApplicationListBuilder_3003 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/app/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyApplicationListBuilder_3403 | Configuration - Policy Application List Builder | read | Verified live | 22 rows |
| POST | `/dataservice/template/policy/list/app/preview` | previewPolicyList_ConfigurationPolicyApplicationListBuilder_3304 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/app/preview/{id}` | previewPolicyListById_ConfigurationPolicyApplicationListBuilder_3803 | Configuration - Policy Application List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/localapp` | deletePolicyListsWithInfoTag_ConfigurationPolicyApplicationListBuilder_3006 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localapp` | getPolicyLists_ConfigurationPolicyApplicationListBuilder_3003 | Configuration - Policy Application List Builder | read | Verified live | 3 rows |
| POST | `/dataservice/template/policy/list/localapp` | createPolicyList_ConfigurationPolicyApplicationListBuilder_3004 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/localapp/{id}` | deletePolicyList_ConfigurationPolicyApplicationListBuilder_3506 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localapp/{id}` | getListsById_ConfigurationPolicyApplicationListBuilder_3503 | Configuration - Policy Application List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/localapp/{id}` | editPolicyList_ConfigurationPolicyApplicationListBuilder_3503 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localapp/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyApplicationListBuilder_3903 | Configuration - Policy Application List Builder | read | Verified live | 3 rows |
| POST | `/dataservice/template/policy/list/localapp/preview` | previewPolicyList_ConfigurationPolicyApplicationListBuilder_3804 | Configuration - Policy Application List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localapp/preview/{id}` | previewPolicyListById_ConfigurationPolicyApplicationListBuilder_4303 | Configuration - Policy Application List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/approute` | getDefinitions_ConfigurationPolicyApprouteDefinitionBuilder_3603 | Configuration - Policy AppRoute Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/approute` | createPolicyDefinition_ConfigurationPolicyApprouteDefinitionBuilder_3604 | Configuration - Policy AppRoute Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/approute/{id}` | deletePolicyDefinition_ConfigurationPolicyApprouteDefinitionBuilder_4106 | Configuration - Policy AppRoute Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/approute/{id}` | getPolicyDefinition_ConfigurationPolicyApprouteDefinitionBuilder_4103 | Configuration - Policy AppRoute Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/approute/{id}` | editPolicyDefinition_ConfigurationPolicyApprouteDefinitionBuilder_4103 | Configuration - Policy AppRoute Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/approute/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyApprouteDefinitionBuilder_4103 | Configuration - Policy AppRoute Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/approute/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyApprouteDefinitionBuilder_5003 | Configuration - Policy AppRoute Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/approute/preview` | previewPolicyDefinition_ConfigurationPolicyApprouteDefinitionBuilder_4404 | Configuration - Policy AppRoute Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/approute/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyApprouteDefinitionBuilder_4903 | Configuration - Policy AppRoute Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/aspath` | deletePolicyListsWithInfoTag_ConfigurationPolicyAspathListBuilder_2806 | Configuration - Policy ASPath List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/aspath` | getPolicyLists_ConfigurationPolicyAspathListBuilder_2803 | Configuration - Policy ASPath List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/aspath` | createPolicyList_ConfigurationPolicyAspathListBuilder_2804 | Configuration - Policy ASPath List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/aspath/{id}` | deletePolicyList_ConfigurationPolicyAspathListBuilder_3306 | Configuration - Policy ASPath List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/aspath/{id}` | getListsById_ConfigurationPolicyAspathListBuilder_3303 | Configuration - Policy ASPath List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/aspath/{id}` | editPolicyList_ConfigurationPolicyAspathListBuilder_3303 | Configuration - Policy ASPath List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/aspath/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyAspathListBuilder_3703 | Configuration - Policy ASPath List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/aspath/preview` | previewPolicyList_ConfigurationPolicyAspathListBuilder_3604 | Configuration - Policy ASPath List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/aspath/preview/{id}` | previewPolicyListById_ConfigurationPolicyAspathListBuilder_4103 | Configuration - Policy ASPath List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/cflowd` | getDefinitions_ConfigurationPolicyCflowdDefinitionBuilder_3403 | Configuration - Policy Cflowd Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/cflowd` | createPolicyDefinition_ConfigurationPolicyCflowdDefinitionBuilder_3404 | Configuration - Policy Cflowd Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/cflowd/{id}` | deletePolicyDefinition_ConfigurationPolicyCflowdDefinitionBuilder_3906 | Configuration - Policy Cflowd Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/cflowd/{id}` | getPolicyDefinition_ConfigurationPolicyCflowdDefinitionBuilder_3903 | Configuration - Policy Cflowd Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/cflowd/{id}` | editPolicyDefinition_ConfigurationPolicyCflowdDefinitionBuilder_3903 | Configuration - Policy Cflowd Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/cflowd/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyCflowdDefinitionBuilder_3903 | Configuration - Policy Cflowd Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/cflowd/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyCflowdDefinitionBuilder_4803 | Configuration - Policy Cflowd Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/cflowd/preview` | previewPolicyDefinition_ConfigurationPolicyCflowdDefinitionBuilder_4204 | Configuration - Policy Cflowd Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/cflowd/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyCflowdDefinitionBuilder_4703 | Configuration - Policy Cflowd Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/clouddiscoveredapp` | getCloudDiscoveredApps | Configuration - Policy Cloud Application Builder | read | Verified live | 0 rows |
| DELETE | `/dataservice/template/policy/list/color` | deletePolicyListsWithInfoTag_ConfigurationPolicyColorListBuilder_2706 | Configuration - Policy Color List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/color` | getPolicyLists_ConfigurationPolicyColorListBuilder_2703 | Configuration - Policy Color List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/color` | createPolicyList_ConfigurationPolicyColorListBuilder_2704 | Configuration - Policy Color List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/color/{id}` | deletePolicyList_ConfigurationPolicyColorListBuilder_3206 | Configuration - Policy Color List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/color/{id}` | getListsById_ConfigurationPolicyColorListBuilder_3203 | Configuration - Policy Color List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/color/{id}` | editPolicyList_ConfigurationPolicyColorListBuilder_3203 | Configuration - Policy Color List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/color/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyColorListBuilder_3603 | Configuration - Policy Color List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/color/preview` | previewPolicyList_ConfigurationPolicyColorListBuilder_3504 | Configuration - Policy Color List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/color/preview/{id}` | previewPolicyListById_ConfigurationPolicyColorListBuilder_4003 | Configuration - Policy Color List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/community` | deletePolicyListsWithInfoTag_ConfigurationPolicyCommunityListBuilder_3106 | Configuration - Policy Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/community` | getPolicyLists_ConfigurationPolicyCommunityListBuilder_3103 | Configuration - Policy Community List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/community` | createPolicyList_ConfigurationPolicyCommunityListBuilder_3104 | Configuration - Policy Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/community/{id}` | deletePolicyList_ConfigurationPolicyCommunityListBuilder_3606 | Configuration - Policy Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/community/{id}` | getListsById_ConfigurationPolicyCommunityListBuilder_3603 | Configuration - Policy Community List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/community/{id}` | editPolicyList_ConfigurationPolicyCommunityListBuilder_3603 | Configuration - Policy Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/community/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyCommunityListBuilder_4003 | Configuration - Policy Community List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/community/preview` | previewPolicyList_ConfigurationPolicyCommunityListBuilder_3904 | Configuration - Policy Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/community/preview/{id}` | previewPolicyListById_ConfigurationPolicyCommunityListBuilder_4403 | Configuration - Policy Community List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/control` | getDefinitions_ConfigurationPolicyControlDefinitionBuilder_3503 | Configuration - Policy Control Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/control` | createPolicyDefinition_ConfigurationPolicyControlDefinitionBuilder_3504 | Configuration - Policy Control Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/control/{id}` | deletePolicyDefinition_ConfigurationPolicyControlDefinitionBuilder_4006 | Configuration - Policy Control Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/control/{id}` | getPolicyDefinition_ConfigurationPolicyControlDefinitionBuilder_4003 | Configuration - Policy Control Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/control/{id}` | editPolicyDefinition_ConfigurationPolicyControlDefinitionBuilder_4003 | Configuration - Policy Control Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/control/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyControlDefinitionBuilder_4003 | Configuration - Policy Control Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/control/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyControlDefinitionBuilder_4903 | Configuration - Policy Control Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/control/preview` | previewPolicyDefinition_ConfigurationPolicyControlDefinitionBuilder_4304 | Configuration - Policy Control Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/control/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyControlDefinitionBuilder_4803 | Configuration - Policy Control Definition Builder | read | Read (needs IDs) | path: id |
| POST | `/dataservice/template/policy/clouddiscoveredapp` | MapTrafficProfiles | Configuration - Policy Custom Application Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/customapp` | getCustomApps | Configuration - Policy Custom Application Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/customapp` | createCustomApplication | Configuration - Policy Custom Application Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/customapp/{id}` | deleteCustomApp | Configuration - Policy Custom Application Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/customapp/{id}` | getCustomAppById | Configuration - Policy Custom Application Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/customapp/{id}` | updateCustomApplication | Configuration - Policy Custom Application Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/data` | getDefinitions_ConfigurationPolicyDataDefinitionBuilder_3203 | Configuration - Policy Data Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/data` | createPolicyDefinition_ConfigurationPolicyDataDefinitionBuilder_3204 | Configuration - Policy Data Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/data/{id}` | deletePolicyDefinition_ConfigurationPolicyDataDefinitionBuilder_3706 | Configuration - Policy Data Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/data/{id}` | getPolicyDefinition_ConfigurationPolicyDataDefinitionBuilder_3703 | Configuration - Policy Data Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/data/{id}` | editPolicyDefinition_ConfigurationPolicyDataDefinitionBuilder_3703 | Configuration - Policy Data Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/data/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyDataDefinitionBuilder_3703 | Configuration - Policy Data Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/data/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyDataDefinitionBuilder_4603 | Configuration - Policy Data Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/data/preview` | previewPolicyDefinition_ConfigurationPolicyDataDefinitionBuilder_4004 | Configuration - Policy Data Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/data/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyDataDefinitionBuilder_4503 | Configuration - Policy Data Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/dataipv6prefix` | deletePolicyListsWithInfoTag_ConfigurationPolicyDataIpv6PrefixListBuilder_3606 | Configuration - Policy Data IPV6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataipv6prefix` | getPolicyLists_ConfigurationPolicyDataIpv6PrefixListBuilder_3603 | Configuration - Policy Data IPV6 Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/dataipv6prefix` | createPolicyList_ConfigurationPolicyDataIpv6PrefixListBuilder_3604 | Configuration - Policy Data IPV6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/dataipv6prefix/{id}` | deletePolicyList_ConfigurationPolicyDataIpv6PrefixListBuilder_4106 | Configuration - Policy Data IPV6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataipv6prefix/{id}` | getListsById_ConfigurationPolicyDataIpv6PrefixListBuilder_4103 | Configuration - Policy Data IPV6 Prefix List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/dataipv6prefix/{id}` | editPolicyList_ConfigurationPolicyDataIpv6PrefixListBuilder_4103 | Configuration - Policy Data IPV6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataipv6prefix/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyDataIpv6PrefixListBuilder_4503 | Configuration - Policy Data IPV6 Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/dataipv6prefix/preview` | previewPolicyList_ConfigurationPolicyDataIpv6PrefixListBuilder_4404 | Configuration - Policy Data IPV6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataipv6prefix/preview/{id}` | previewPolicyListById_ConfigurationPolicyDataIpv6PrefixListBuilder_4903 | Configuration - Policy Data IPV6 Prefix List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/dataprefixall` | deletePolicyListsWithInfoTag_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_3506 | Configuration - Policy Data Prefix All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixall` | getListsForAllDataPrefixes | Configuration - Policy Data Prefix All Types Of Lists Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/dataprefixall` | createPolicyList_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_3504 | Configuration - Policy Data Prefix All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/dataprefixall/{id}` | deletePolicyList_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_4006 | Configuration - Policy Data Prefix All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixall/{id}` | getListsById_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_4003 | Configuration - Policy Data Prefix All Types Of Lists Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/dataprefixall/{id}` | editPolicyList_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_4003 | Configuration - Policy Data Prefix All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixall/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_4403 | Configuration - Policy Data Prefix All Types Of Lists Builder | read | Verified live | 33 rows |
| POST | `/dataservice/template/policy/list/dataprefixall/preview` | previewPolicyList_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_4304 | Configuration - Policy Data Prefix All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixall/preview/{id}` | previewPolicyListById_ConfigurationPolicyDataPrefixAllTypesOfListsBuilder_4803 | Configuration - Policy Data Prefix All Types Of Lists Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/dataprefixfqdn` | deletePolicyListsWithInfoTag_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_3606 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixfqdn` | getAllDataPrefixAndFQDNLists | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/dataprefixfqdn` | createPolicyList_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_3604 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/dataprefixfqdn/{id}` | deletePolicyList_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_4106 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixfqdn/{id}` | getListsById_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_4103 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/dataprefixfqdn/{id}` | editPolicyList_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_4103 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixfqdn/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_4503 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | read | Verified live | 33 rows |
| POST | `/dataservice/template/policy/list/dataprefixfqdn/preview` | previewPolicyList_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_4404 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefixfqdn/preview/{id}` | previewPolicyListById_ConfigurationPolicyDataPrefixFqdnAllTypesOfListsBuilder_4903 | Configuration - Policy Data Prefix and FQDN All Types Of Lists Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/dataprefix` | deletePolicyListsWithInfoTag_ConfigurationPolicyDataPrefixListBuilder_3206 | Configuration - Policy Data Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefix` | getPolicyLists_ConfigurationPolicyDataPrefixListBuilder_3203 | Configuration - Policy Data Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/dataprefix` | createPolicyList_ConfigurationPolicyDataPrefixListBuilder_3204 | Configuration - Policy Data Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/dataprefix/{id}` | deletePolicyList_ConfigurationPolicyDataPrefixListBuilder_3706 | Configuration - Policy Data Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefix/{id}` | getListsById_ConfigurationPolicyDataPrefixListBuilder_3703 | Configuration - Policy Data Prefix List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/dataprefix/{id}` | editPolicyList_ConfigurationPolicyDataPrefixListBuilder_3703 | Configuration - Policy Data Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefix/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyDataPrefixListBuilder_4103 | Configuration - Policy Data Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/dataprefix/preview` | previewPolicyList_ConfigurationPolicyDataPrefixListBuilder_4004 | Configuration - Policy Data Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/dataprefix/preview/{id}` | previewPolicyListById_ConfigurationPolicyDataPrefixListBuilder_4503 | Configuration - Policy Data Prefix List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/deviceaccesspolicy` | getDefinitions_ConfigurationPolicyDeviceAccessDefinitionBuilder_4603 | Configuration - Policy Device Access Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/deviceaccesspolicy` | createPolicyDefinition_ConfigurationPolicyDeviceAccessDefinitionBuilder_4604 | Configuration - Policy Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/deviceaccesspolicy/{id}` | deletePolicyDefinition_ConfigurationPolicyDeviceAccessDefinitionBuilder_5106 | Configuration - Policy Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/deviceaccesspolicy/{id}` | getPolicyDefinition_ConfigurationPolicyDeviceAccessDefinitionBuilder_5103 | Configuration - Policy Device Access Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/deviceaccesspolicy/{id}` | editPolicyDefinition_ConfigurationPolicyDeviceAccessDefinitionBuilder_5103 | Configuration - Policy Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/deviceaccesspolicy/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyDeviceAccessDefinitionBuilder_5103 | Configuration - Policy Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/deviceaccesspolicy/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyDeviceAccessDefinitionBuilder_6003 | Configuration - Policy Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/deviceaccesspolicy/preview` | previewPolicyDefinition_ConfigurationPolicyDeviceAccessDefinitionBuilder_5404 | Configuration - Policy Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/deviceaccesspolicy/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyDeviceAccessDefinitionBuilder_5903 | Configuration - Policy Device Access Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/dialpeer` | getDefinitions_ConfigurationPolicyDialpeerDefinitionBuilder_3603 | Configuration - Policy DialPeer Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/dialpeer` | createPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_3604 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/dialpeer/{id}` | deletePolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4106 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/dialpeer/{id}` | getPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4103 | Configuration - Policy DialPeer Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/dialpeer/{id}` | editPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4103 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/dialpeer/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyDialpeerDefinitionBuilder_4103 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/dialpeer/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_5003 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/dialpeer/preview` | previewPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4404 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/dialpeer/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyDialpeerDefinitionBuilder_4903 | Configuration - Policy DialPeer Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/srstphoneprofile` | getDefinitions_ConfigurationPolicyDialpeerDefinitionBuilder_4403 | Configuration - Policy DialPeer Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/srstphoneprofile` | createPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4404 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/srstphoneprofile/{id}` | deletePolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4906 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/srstphoneprofile/{id}` | getPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4903 | Configuration - Policy DialPeer Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/srstphoneprofile/{id}` | editPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_4903 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/srstphoneprofile/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyDialpeerDefinitionBuilder_4903 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/srstphoneprofile/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_5803 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/srstphoneprofile/preview` | previewPolicyDefinition_ConfigurationPolicyDialpeerDefinitionBuilder_5204 | Configuration - Policy DialPeer Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/srstphoneprofile/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyDialpeerDefinitionBuilder_5703 | Configuration - Policy DialPeer Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/expandedcommunity` | deletePolicyListsWithInfoTag_ConfigurationPolicyExpEdCommunityListBuilder_3906 | Configuration - Policy Expanded Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/expandedcommunity` | getPolicyLists_ConfigurationPolicyExpEdCommunityListBuilder_3903 | Configuration - Policy Expanded Community List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/expandedcommunity` | createPolicyList_ConfigurationPolicyExpEdCommunityListBuilder_3904 | Configuration - Policy Expanded Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/expandedcommunity/{id}` | deletePolicyList_ConfigurationPolicyExpEdCommunityListBuilder_4406 | Configuration - Policy Expanded Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/expandedcommunity/{id}` | getListsById_ConfigurationPolicyExpEdCommunityListBuilder_4403 | Configuration - Policy Expanded Community List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/expandedcommunity/{id}` | editPolicyList_ConfigurationPolicyExpEdCommunityListBuilder_4403 | Configuration - Policy Expanded Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/expandedcommunity/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyExpEdCommunityListBuilder_4803 | Configuration - Policy Expanded Community List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/expandedcommunity/preview` | previewPolicyList_ConfigurationPolicyExpEdCommunityListBuilder_4704 | Configuration - Policy Expanded Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/expandedcommunity/preview/{id}` | previewPolicyListById_ConfigurationPolicyExpEdCommunityListBuilder_5203 | Configuration - Policy Expanded Community List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/extcommunity` | deletePolicyListsWithInfoTag_ConfigurationPolicyExtendedCommunityListBuilder_3406 | Configuration - Policy Extended Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/extcommunity` | getPolicyLists_ConfigurationPolicyExtendedCommunityListBuilder_3403 | Configuration - Policy Extended Community List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/extcommunity` | createPolicyList_ConfigurationPolicyExtendedCommunityListBuilder_3404 | Configuration - Policy Extended Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/extcommunity/{id}` | deletePolicyList_ConfigurationPolicyExtendedCommunityListBuilder_3906 | Configuration - Policy Extended Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/extcommunity/{id}` | getListsById_ConfigurationPolicyExtendedCommunityListBuilder_3903 | Configuration - Policy Extended Community List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/extcommunity/{id}` | editPolicyList_ConfigurationPolicyExtendedCommunityListBuilder_3903 | Configuration - Policy Extended Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/extcommunity/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyExtendedCommunityListBuilder_4303 | Configuration - Policy Extended Community List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/extcommunity/preview` | previewPolicyList_ConfigurationPolicyExtendedCommunityListBuilder_4204 | Configuration - Policy Extended Community List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/extcommunity/preview/{id}` | previewPolicyListById_ConfigurationPolicyExtendedCommunityListBuilder_4703 | Configuration - Policy Extended Community List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/faxprotocol` | deletePolicyListsWithInfoTag_ConfigurationPolicyFaxProtocolListBuilder_3306 | Configuration - Policy Fax Protocol List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/faxprotocol` | getPolicyLists_ConfigurationPolicyFaxProtocolListBuilder_3303 | Configuration - Policy Fax Protocol List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/faxprotocol` | createPolicyList_ConfigurationPolicyFaxProtocolListBuilder_3304 | Configuration - Policy Fax Protocol List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/faxprotocol/{id}` | deletePolicyList_ConfigurationPolicyFaxProtocolListBuilder_3806 | Configuration - Policy Fax Protocol List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/faxprotocol/{id}` | getListsById_ConfigurationPolicyFaxProtocolListBuilder_3803 | Configuration - Policy Fax Protocol List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/faxprotocol/{id}` | editPolicyList_ConfigurationPolicyFaxProtocolListBuilder_3803 | Configuration - Policy Fax Protocol List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/faxprotocol/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyFaxProtocolListBuilder_4203 | Configuration - Policy Fax Protocol List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/faxprotocol/preview` | previewPolicyList_ConfigurationPolicyFaxProtocolListBuilder_4104 | Configuration - Policy Fax Protocol List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/faxprotocol/preview/{id}` | previewPolicyListById_ConfigurationPolicyFaxProtocolListBuilder_4603 | Configuration - Policy Fax Protocol List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/class` | deletePolicyListsWithInfoTag_ConfigurationPolicyForwardingClassListBuilder_2706 | Configuration - Policy Forwarding Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/class` | getPolicyLists_ConfigurationPolicyForwardingClassListBuilder_2703 | Configuration - Policy Forwarding Class List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/class` | createPolicyList_ConfigurationPolicyForwardingClassListBuilder_2704 | Configuration - Policy Forwarding Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/class/{id}` | deletePolicyList_ConfigurationPolicyForwardingClassListBuilder_3206 | Configuration - Policy Forwarding Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/class/{id}` | getListsById_ConfigurationPolicyForwardingClassListBuilder_3203 | Configuration - Policy Forwarding Class List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/class/{id}` | editPolicyList_ConfigurationPolicyForwardingClassListBuilder_3203 | Configuration - Policy Forwarding Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/class/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyForwardingClassListBuilder_3603 | Configuration - Policy Forwarding Class List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/class/preview` | previewPolicyList_ConfigurationPolicyForwardingClassListBuilder_3504 | Configuration - Policy Forwarding Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/class/preview/{id}` | previewPolicyListById_ConfigurationPolicyForwardingClassListBuilder_4003 | Configuration - Policy Forwarding Class List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/fxoport` | getDefinitions_ConfigurationPolicyFxoPortDefinitionBuilder_3503 | Configuration - Policy FXO Port Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/fxoport` | createPolicyDefinition_ConfigurationPolicyFxoPortDefinitionBuilder_3504 | Configuration - Policy FXO Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/fxoport/{id}` | deletePolicyDefinition_ConfigurationPolicyFxoPortDefinitionBuilder_4006 | Configuration - Policy FXO Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/fxoport/{id}` | getPolicyDefinition_ConfigurationPolicyFxoPortDefinitionBuilder_4003 | Configuration - Policy FXO Port Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/fxoport/{id}` | editPolicyDefinition_ConfigurationPolicyFxoPortDefinitionBuilder_4003 | Configuration - Policy FXO Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/fxoport/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyFxoPortDefinitionBuilder_4003 | Configuration - Policy FXO Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/fxoport/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyFxoPortDefinitionBuilder_4903 | Configuration - Policy FXO Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/fxoport/preview` | previewPolicyDefinition_ConfigurationPolicyFxoPortDefinitionBuilder_4304 | Configuration - Policy FXO Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/fxoport/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyFxoPortDefinitionBuilder_4803 | Configuration - Policy FXO Port Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/fxsport` | getDefinitions_ConfigurationPolicyFxsPortDefinitionBuilder_3503 | Configuration - Policy FXS Port Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/fxsport` | createPolicyDefinition_ConfigurationPolicyFxsPortDefinitionBuilder_3504 | Configuration - Policy FXS Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/fxsport/{id}` | deletePolicyDefinition_ConfigurationPolicyFxsPortDefinitionBuilder_4006 | Configuration - Policy FXS Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/fxsport/{id}` | getPolicyDefinition_ConfigurationPolicyFxsPortDefinitionBuilder_4003 | Configuration - Policy FXS Port Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/fxsport/{id}` | editPolicyDefinition_ConfigurationPolicyFxsPortDefinitionBuilder_4003 | Configuration - Policy FXS Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/fxsport/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyFxsPortDefinitionBuilder_4003 | Configuration - Policy FXS Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/fxsport/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyFxsPortDefinitionBuilder_4903 | Configuration - Policy FXS Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/fxsport/preview` | previewPolicyDefinition_ConfigurationPolicyFxsPortDefinitionBuilder_4304 | Configuration - Policy FXS Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/fxsport/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyFxsPortDefinitionBuilder_4803 | Configuration - Policy FXS Port Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/fxsdidport` | getDefinitions_ConfigurationPolicyFxsdidPortDefinitionBuilder_3803 | Configuration - Policy FXSDID Port Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/fxsdidport` | createPolicyDefinition_ConfigurationPolicyFxsdidPortDefinitionBuilder_3804 | Configuration - Policy FXSDID Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/fxsdidport/{id}` | deletePolicyDefinition_ConfigurationPolicyFxsdidPortDefinitionBuilder_4306 | Configuration - Policy FXSDID Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/fxsdidport/{id}` | getPolicyDefinition_ConfigurationPolicyFxsdidPortDefinitionBuilder_4303 | Configuration - Policy FXSDID Port Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/fxsdidport/{id}` | editPolicyDefinition_ConfigurationPolicyFxsdidPortDefinitionBuilder_4303 | Configuration - Policy FXSDID Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/fxsdidport/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyFxsdidPortDefinitionBuilder_4303 | Configuration - Policy FXSDID Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/fxsdidport/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyFxsdidPortDefinitionBuilder_5203 | Configuration - Policy FXSDID Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/fxsdidport/preview` | previewPolicyDefinition_ConfigurationPolicyFxsdidPortDefinitionBuilder_4604 | Configuration - Policy FXSDID Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/fxsdidport/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyFxsdidPortDefinitionBuilder_5103 | Configuration - Policy FXSDID Port Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/geolocation` | deletePolicyListsWithInfoTag_ConfigurationPolicyGeoLocationListBuilder_3306 | Configuration - Policy Geo Location List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/geolocation` | getPolicyLists_ConfigurationPolicyGeoLocationListBuilder_3303 | Configuration - Policy Geo Location List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/geolocation` | createPolicyList_ConfigurationPolicyGeoLocationListBuilder_3304 | Configuration - Policy Geo Location List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/geolocation/{id}` | deletePolicyList_ConfigurationPolicyGeoLocationListBuilder_3806 | Configuration - Policy Geo Location List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/geolocation/{id}` | getListsById_ConfigurationPolicyGeoLocationListBuilder_3803 | Configuration - Policy Geo Location List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/geolocation/{id}` | editPolicyList_ConfigurationPolicyGeoLocationListBuilder_3803 | Configuration - Policy Geo Location List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/geolocation/entries` | getGeoLocationLists | Configuration - Policy Geo Location List Builder | read | Verified live | object |
| GET | `/dataservice/template/policy/list/geolocation/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyGeoLocationListBuilder_4203 | Configuration - Policy Geo Location List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/geolocation/preview` | previewPolicyList_ConfigurationPolicyGeoLocationListBuilder_4104 | Configuration - Policy Geo Location List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/geolocation/preview/{id}` | previewPolicyListById_ConfigurationPolicyGeoLocationListBuilder_4603 | Configuration - Policy Geo Location List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/hubandspoke` | getDefinitions_ConfigurationPolicyHubSpokeDefinitionBuilder_3903 | Configuration - Policy Hub and Spoke Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/hubandspoke` | createPolicyDefinition_ConfigurationPolicyHubSpokeDefinitionBuilder_3904 | Configuration - Policy Hub and Spoke Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/hubandspoke/{id}` | deletePolicyDefinition_ConfigurationPolicyHubSpokeDefinitionBuilder_4406 | Configuration - Policy Hub and Spoke Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/hubandspoke/{id}` | getPolicyDefinition_ConfigurationPolicyHubSpokeDefinitionBuilder_4403 | Configuration - Policy Hub and Spoke Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/hubandspoke/{id}` | editPolicyDefinition_ConfigurationPolicyHubSpokeDefinitionBuilder_4403 | Configuration - Policy Hub and Spoke Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/hubandspoke/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyHubSpokeDefinitionBuilder_4403 | Configuration - Policy Hub and Spoke Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/hubandspoke/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyHubSpokeDefinitionBuilder_5303 | Configuration - Policy Hub and Spoke Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/hubandspoke/preview` | previewPolicyDefinition_ConfigurationPolicyHubSpokeDefinitionBuilder_4704 | Configuration - Policy Hub and Spoke Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/hubandspoke/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyHubSpokeDefinitionBuilder_5203 | Configuration - Policy Hub and Spoke Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/identity` | deletePolicyListsWithInfoTag_ConfigurationPolicyIdentityListBuilder_3006 | Configuration - Policy Identity List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/identity` | getPolicyLists_ConfigurationPolicyIdentityListBuilder_3003 | Configuration - Policy Identity List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/identity` | createPolicyList_ConfigurationPolicyIdentityListBuilder_3004 | Configuration - Policy Identity List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/identity/{id}` | deletePolicyList_ConfigurationPolicyIdentityListBuilder_3506 | Configuration - Policy Identity List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/identity/{id}` | getListsById_ConfigurationPolicyIdentityListBuilder_3503 | Configuration - Policy Identity List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/identity/{id}` | editPolicyList_ConfigurationPolicyIdentityListBuilder_3503 | Configuration - Policy Identity List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/identity/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyIdentityListBuilder_3903 | Configuration - Policy Identity List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/identity/preview` | previewPolicyList_ConfigurationPolicyIdentityListBuilder_3804 | Configuration - Policy Identity List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/identity/preview/{id}` | previewPolicyListById_ConfigurationPolicyIdentityListBuilder_4303 | Configuration - Policy Identity List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/intrusionprevention` | getDefinitions_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_4703 | Configuration - Policy Intrusion Prevention Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/intrusionprevention` | createPolicyDefinition_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_4704 | Configuration - Policy Intrusion Prevention Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/intrusionprevention/{id}` | deletePolicyDefinition_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_5206 | Configuration - Policy Intrusion Prevention Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/intrusionprevention/{id}` | getPolicyDefinition_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_5203 | Configuration - Policy Intrusion Prevention Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/intrusionprevention/{id}` | editPolicyDefinition_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_5203 | Configuration - Policy Intrusion Prevention Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/intrusionprevention/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_5203 | Configuration - Policy Intrusion Prevention Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/intrusionprevention/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_6103 | Configuration - Policy Intrusion Prevention Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/intrusionprevention/preview` | previewPolicyDefinition_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_5504 | Configuration - Policy Intrusion Prevention Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/intrusionprevention/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyIntrusionPreventionDefinitionBuilder_6003 | Configuration - Policy Intrusion Prevention Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/ipssignature` | deletePolicyListsWithInfoTag_ConfigurationPolicyIpsSignatureListBuilder_3406 | Configuration - Policy IPS Signature List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipssignature` | getPolicyLists_ConfigurationPolicyIpsSignatureListBuilder_3403 | Configuration - Policy IPS Signature List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/ipssignature` | createPolicyList_ConfigurationPolicyIpsSignatureListBuilder_3404 | Configuration - Policy IPS Signature List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/ipssignature/{id}` | deletePolicyList_ConfigurationPolicyIpsSignatureListBuilder_3906 | Configuration - Policy IPS Signature List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipssignature/{id}` | getListsById_ConfigurationPolicyIpsSignatureListBuilder_3903 | Configuration - Policy IPS Signature List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/ipssignature/{id}` | editPolicyList_ConfigurationPolicyIpsSignatureListBuilder_3903 | Configuration - Policy IPS Signature List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipssignature/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyIpsSignatureListBuilder_4303 | Configuration - Policy IPS Signature List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/ipssignature/preview` | previewPolicyList_ConfigurationPolicyIpsSignatureListBuilder_4204 | Configuration - Policy IPS Signature List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipssignature/preview/{id}` | previewPolicyListById_ConfigurationPolicyIpsSignatureListBuilder_4703 | Configuration - Policy IPS Signature List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/aclv6` | getDefinitions_ConfigurationPolicyIpv6AccessDefinitionBuilder_3303 | Configuration - Policy IPv6 Access Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/aclv6` | createPolicyDefinition_ConfigurationPolicyIpv6AccessDefinitionBuilder_3304 | Configuration - Policy IPv6 Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/aclv6/{id}` | deletePolicyDefinition_ConfigurationPolicyIpv6AccessDefinitionBuilder_3806 | Configuration - Policy IPv6 Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/aclv6/{id}` | getPolicyDefinition_ConfigurationPolicyIpv6AccessDefinitionBuilder_3803 | Configuration - Policy IPv6 Access Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/aclv6/{id}` | editPolicyDefinition_ConfigurationPolicyIpv6AccessDefinitionBuilder_3803 | Configuration - Policy IPv6 Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/aclv6/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyIpv6AccessDefinitionBuilder_3803 | Configuration - Policy IPv6 Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/aclv6/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyIpv6AccessDefinitionBuilder_4703 | Configuration - Policy IPv6 Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/aclv6/preview` | previewPolicyDefinition_ConfigurationPolicyIpv6AccessDefinitionBuilder_4104 | Configuration - Policy IPv6 Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/aclv6/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyIpv6AccessDefinitionBuilder_4603 | Configuration - Policy IPv6 Access Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/deviceaccesspolicyv6` | getDefinitions_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_4803 | Configuration - Policy IPv6 Device Access Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/deviceaccesspolicyv6` | createPolicyDefinition_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_4804 | Configuration - Policy IPv6 Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/deviceaccesspolicyv6/{id}` | deletePolicyDefinition_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_5306 | Configuration - Policy IPv6 Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/deviceaccesspolicyv6/{id}` | getPolicyDefinition_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_5303 | Configuration - Policy IPv6 Device Access Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/deviceaccesspolicyv6/{id}` | editPolicyDefinition_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_5303 | Configuration - Policy IPv6 Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/deviceaccesspolicyv6/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_5303 | Configuration - Policy IPv6 Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/deviceaccesspolicyv6/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_6203 | Configuration - Policy IPv6 Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/deviceaccesspolicyv6/preview` | previewPolicyDefinition_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_5604 | Configuration - Policy IPv6 Device Access Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/deviceaccesspolicyv6/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyIpv6DeviceAccessDefinitionBuilder_6103 | Configuration - Policy IPv6 Device Access Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/ipv6prefix` | deletePolicyListsWithInfoTag_ConfigurationPolicyIpv6PrefixListBuilder_3206 | Configuration - Policy IPv6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipv6prefix` | getPolicyLists_ConfigurationPolicyIpv6PrefixListBuilder_3203 | Configuration - Policy IPv6 Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/ipv6prefix` | createPolicyList_ConfigurationPolicyIpv6PrefixListBuilder_3204 | Configuration - Policy IPv6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/ipv6prefix/{id}` | deletePolicyList_ConfigurationPolicyIpv6PrefixListBuilder_3706 | Configuration - Policy IPv6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipv6prefix/{id}` | getListsById_ConfigurationPolicyIpv6PrefixListBuilder_3703 | Configuration - Policy IPv6 Prefix List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/ipv6prefix/{id}` | editPolicyList_ConfigurationPolicyIpv6PrefixListBuilder_3703 | Configuration - Policy IPv6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipv6prefix/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyIpv6PrefixListBuilder_4103 | Configuration - Policy IPv6 Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/ipv6prefix/preview` | previewPolicyList_ConfigurationPolicyIpv6PrefixListBuilder_4004 | Configuration - Policy IPv6 Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipv6prefix/preview/{id}` | previewPolicyListById_ConfigurationPolicyIpv6PrefixListBuilder_4503 | Configuration - Policy IPv6 Prefix List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/list` | getAllPolicyLists | Configuration - Policy List Builder | read | Verified live | 33 rows |
| POST | `/dataservice/template/policy/list/webex` | createWebexPrefixLists_ConfigurationPolicyListBuilder_2704 | Configuration - Policy List Builder | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/list/webex/update` | createWebexPrefixLists_ConfigurationPolicyListBuilder_3404 | Configuration - Policy List Builder | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/dnssecurity` | getDefinitions_ConfigurationPolicyLocalDomainDefinitionBuilder_3903 | Configuration - Policy Local Domain Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/dnssecurity` | createPolicyDefinition_ConfigurationPolicyLocalDomainDefinitionBuilder_3904 | Configuration - Policy Local Domain Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/dnssecurity/{id}` | deletePolicyDefinition_ConfigurationPolicyLocalDomainDefinitionBuilder_4406 | Configuration - Policy Local Domain Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/dnssecurity/{id}` | getPolicyDefinition_ConfigurationPolicyLocalDomainDefinitionBuilder_4403 | Configuration - Policy Local Domain Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/dnssecurity/{id}` | editPolicyDefinition_ConfigurationPolicyLocalDomainDefinitionBuilder_4403 | Configuration - Policy Local Domain Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/dnssecurity/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyLocalDomainDefinitionBuilder_4403 | Configuration - Policy Local Domain Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/dnssecurity/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyLocalDomainDefinitionBuilder_5303 | Configuration - Policy Local Domain Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/dnssecurity/preview` | previewPolicyDefinition_ConfigurationPolicyLocalDomainDefinitionBuilder_4704 | Configuration - Policy Local Domain Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/dnssecurity/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyLocalDomainDefinitionBuilder_5203 | Configuration - Policy Local Domain Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/localdomain` | deletePolicyListsWithInfoTag_ConfigurationPolicyLocalDomainNameListBuilder_3306 | Configuration - Policy Local Domain Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localdomain` | getPolicyLists_ConfigurationPolicyLocalDomainNameListBuilder_3303 | Configuration - Policy Local Domain Name List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/localdomain` | createPolicyList_ConfigurationPolicyLocalDomainNameListBuilder_3304 | Configuration - Policy Local Domain Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/localdomain/{id}` | deletePolicyList_ConfigurationPolicyLocalDomainNameListBuilder_3806 | Configuration - Policy Local Domain Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localdomain/{id}` | getListsById_ConfigurationPolicyLocalDomainNameListBuilder_3803 | Configuration - Policy Local Domain Name List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/localdomain/{id}` | editPolicyList_ConfigurationPolicyLocalDomainNameListBuilder_3803 | Configuration - Policy Local Domain Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localdomain/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyLocalDomainNameListBuilder_4203 | Configuration - Policy Local Domain Name List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/localdomain/preview` | previewPolicyList_ConfigurationPolicyLocalDomainNameListBuilder_4104 | Configuration - Policy Local Domain Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/localdomain/preview/{id}` | previewPolicyListById_ConfigurationPolicyLocalDomainNameListBuilder_4603 | Configuration - Policy Local Domain Name List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/mediaprofile` | deletePolicyListsWithInfoTag_ConfigurationPolicyMediaProfileListBuilder_3406 | Configuration - Policy Media Profile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mediaprofile` | getPolicyLists_ConfigurationPolicyMediaProfileListBuilder_3403 | Configuration - Policy Media Profile List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/mediaprofile` | createPolicyList_ConfigurationPolicyMediaProfileListBuilder_3404 | Configuration - Policy Media Profile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/mediaprofile/{id}` | deletePolicyList_ConfigurationPolicyMediaProfileListBuilder_3906 | Configuration - Policy Media Profile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mediaprofile/{id}` | getListsById_ConfigurationPolicyMediaProfileListBuilder_3903 | Configuration - Policy Media Profile List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/mediaprofile/{id}` | editPolicyList_ConfigurationPolicyMediaProfileListBuilder_3903 | Configuration - Policy Media Profile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mediaprofile/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyMediaProfileListBuilder_4303 | Configuration - Policy Media Profile List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/mediaprofile/preview` | previewPolicyList_ConfigurationPolicyMediaProfileListBuilder_4204 | Configuration - Policy Media Profile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mediaprofile/preview/{id}` | previewPolicyListById_ConfigurationPolicyMediaProfileListBuilder_4703 | Configuration - Policy Media Profile List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/mesh` | getDefinitions_ConfigurationPolicyMeshDefinitionBuilder_3203 | Configuration - Policy Mesh Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/mesh` | createPolicyDefinition_ConfigurationPolicyMeshDefinitionBuilder_3204 | Configuration - Policy Mesh Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/mesh/{id}` | deletePolicyDefinition_ConfigurationPolicyMeshDefinitionBuilder_3706 | Configuration - Policy Mesh Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/mesh/{id}` | getPolicyDefinition_ConfigurationPolicyMeshDefinitionBuilder_3703 | Configuration - Policy Mesh Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/mesh/{id}` | editPolicyDefinition_ConfigurationPolicyMeshDefinitionBuilder_3703 | Configuration - Policy Mesh Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/mesh/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyMeshDefinitionBuilder_3703 | Configuration - Policy Mesh Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/mesh/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyMeshDefinitionBuilder_4603 | Configuration - Policy Mesh Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/mesh/preview` | previewPolicyDefinition_ConfigurationPolicyMeshDefinitionBuilder_4004 | Configuration - Policy Mesh Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/mesh/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyMeshDefinitionBuilder_4503 | Configuration - Policy Mesh Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/mirror` | deletePolicyListsWithInfoTag_ConfigurationPolicyMirrorListBuilder_2806 | Configuration - Policy Mirror List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mirror` | getPolicyLists_ConfigurationPolicyMirrorListBuilder_2803 | Configuration - Policy Mirror List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/mirror` | createPolicyList_ConfigurationPolicyMirrorListBuilder_2804 | Configuration - Policy Mirror List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/mirror/{id}` | deletePolicyList_ConfigurationPolicyMirrorListBuilder_3306 | Configuration - Policy Mirror List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mirror/{id}` | getListsById_ConfigurationPolicyMirrorListBuilder_3303 | Configuration - Policy Mirror List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/mirror/{id}` | editPolicyList_ConfigurationPolicyMirrorListBuilder_3303 | Configuration - Policy Mirror List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mirror/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyMirrorListBuilder_3703 | Configuration - Policy Mirror List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/mirror/preview` | previewPolicyList_ConfigurationPolicyMirrorListBuilder_3604 | Configuration - Policy Mirror List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/mirror/preview/{id}` | previewPolicyListById_ConfigurationPolicyMirrorListBuilder_4103 | Configuration - Policy Mirror List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/modempassthrough` | deletePolicyListsWithInfoTag_ConfigurationPolicyModemPassthroughListBuilder_3806 | Configuration - Policy Modem Passthrough List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/modempassthrough` | getPolicyLists_ConfigurationPolicyModemPassthroughListBuilder_3803 | Configuration - Policy Modem Passthrough List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/modempassthrough` | createPolicyList_ConfigurationPolicyModemPassthroughListBuilder_3804 | Configuration - Policy Modem Passthrough List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/modempassthrough/{id}` | deletePolicyList_ConfigurationPolicyModemPassthroughListBuilder_4306 | Configuration - Policy Modem Passthrough List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/modempassthrough/{id}` | getListsById_ConfigurationPolicyModemPassthroughListBuilder_4303 | Configuration - Policy Modem Passthrough List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/modempassthrough/{id}` | editPolicyList_ConfigurationPolicyModemPassthroughListBuilder_4303 | Configuration - Policy Modem Passthrough List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/modempassthrough/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyModemPassthroughListBuilder_4703 | Configuration - Policy Modem Passthrough List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/modempassthrough/preview` | previewPolicyList_ConfigurationPolicyModemPassthroughListBuilder_4604 | Configuration - Policy Modem Passthrough List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/modempassthrough/preview/{id}` | previewPolicyListById_ConfigurationPolicyModemPassthroughListBuilder_5103 | Configuration - Policy Modem Passthrough List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/policer` | deletePolicyListsWithInfoTag_ConfigurationPolicyPolicerClassListBuilder_2906 | Configuration - Policy Policer Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/policer` | getPolicyLists_ConfigurationPolicyPolicerClassListBuilder_2903 | Configuration - Policy Policer Class List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/policer` | createPolicyList_ConfigurationPolicyPolicerClassListBuilder_2904 | Configuration - Policy Policer Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/policer/{id}` | deletePolicyList_ConfigurationPolicyPolicerClassListBuilder_3406 | Configuration - Policy Policer Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/policer/{id}` | getListsById_ConfigurationPolicyPolicerClassListBuilder_3403 | Configuration - Policy Policer Class List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/policer/{id}` | editPolicyList_ConfigurationPolicyPolicerClassListBuilder_3403 | Configuration - Policy Policer Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/policer/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyPolicerClassListBuilder_3803 | Configuration - Policy Policer Class List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/policer/preview` | previewPolicyList_ConfigurationPolicyPolicerClassListBuilder_3704 | Configuration - Policy Policer Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/policer/preview/{id}` | previewPolicyListById_ConfigurationPolicyPolicerClassListBuilder_4203 | Configuration - Policy Policer Class List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/port` | deletePolicyListsWithInfoTag_ConfigurationPolicyPortListBuilder_2606 | Configuration - Policy Port List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/port` | getPolicyLists_ConfigurationPolicyPortListBuilder_2603 | Configuration - Policy Port List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/port` | createPolicyList_ConfigurationPolicyPortListBuilder_2604 | Configuration - Policy Port List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/port/{id}` | deletePolicyList_ConfigurationPolicyPortListBuilder_3106 | Configuration - Policy Port List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/port/{id}` | getListsById_ConfigurationPolicyPortListBuilder_3103 | Configuration - Policy Port List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/port/{id}` | editPolicyList_ConfigurationPolicyPortListBuilder_3103 | Configuration - Policy Port List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/port/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyPortListBuilder_3503 | Configuration - Policy Port List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/port/preview` | previewPolicyList_ConfigurationPolicyPortListBuilder_3404 | Configuration - Policy Port List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/port/preview/{id}` | previewPolicyListById_ConfigurationPolicyPortListBuilder_3903 | Configuration - Policy Port List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/ipprefixall` | deletePolicyListsWithInfoTag_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_3306 | Configuration - Policy Prefix for All Types of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipprefixall` | getListsForAllPrefixes | Configuration - Policy Prefix for All Types of Lists Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/ipprefixall` | createPolicyList_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_3304 | Configuration - Policy Prefix for All Types of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/ipprefixall/{id}` | deletePolicyList_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_3806 | Configuration - Policy Prefix for All Types of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipprefixall/{id}` | getListsById_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_3803 | Configuration - Policy Prefix for All Types of Lists Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/ipprefixall/{id}` | editPolicyList_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_3803 | Configuration - Policy Prefix for All Types of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipprefixall/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_4203 | Configuration - Policy Prefix for All Types of Lists Builder | read | Verified live | 33 rows |
| POST | `/dataservice/template/policy/list/ipprefixall/preview` | previewPolicyList_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_4104 | Configuration - Policy Prefix for All Types of Lists Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/ipprefixall/preview/{id}` | previewPolicyListById_ConfigurationPolicyPrefixForAllTypesOfListsBuilder_4603 | Configuration - Policy Prefix for All Types of Lists Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/prefix` | deletePolicyListsWithInfoTag_ConfigurationPolicyPrefixListBuilder_2806 | Configuration - Policy Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/prefix` | getPolicyLists_ConfigurationPolicyPrefixListBuilder_2803 | Configuration - Policy Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/prefix` | createPolicyList_ConfigurationPolicyPrefixListBuilder_2804 | Configuration - Policy Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/prefix/{id}` | deletePolicyList_ConfigurationPolicyPrefixListBuilder_3306 | Configuration - Policy Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/prefix/{id}` | getListsById_ConfigurationPolicyPrefixListBuilder_3303 | Configuration - Policy Prefix List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/prefix/{id}` | editPolicyList_ConfigurationPolicyPrefixListBuilder_3303 | Configuration - Policy Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/prefix/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyPrefixListBuilder_3703 | Configuration - Policy Prefix List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/prefix/preview` | previewPolicyList_ConfigurationPolicyPrefixListBuilder_3604 | Configuration - Policy Prefix List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/prefix/preview/{id}` | previewPolicyListById_ConfigurationPolicyPrefixListBuilder_4103 | Configuration - Policy Prefix List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/priisdnport` | getDefinitions_ConfigurationPolicyPriIsdnPortDefinitionBuilder_3903 | Configuration - Policy PRI ISDN Port Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/priisdnport` | createPolicyDefinition_ConfigurationPolicyPriIsdnPortDefinitionBuilder_3904 | Configuration - Policy PRI ISDN Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/priisdnport/{id}` | deletePolicyDefinition_ConfigurationPolicyPriIsdnPortDefinitionBuilder_4406 | Configuration - Policy PRI ISDN Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/priisdnport/{id}` | getPolicyDefinition_ConfigurationPolicyPriIsdnPortDefinitionBuilder_4403 | Configuration - Policy PRI ISDN Port Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/priisdnport/{id}` | editPolicyDefinition_ConfigurationPolicyPriIsdnPortDefinitionBuilder_4403 | Configuration - Policy PRI ISDN Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/priisdnport/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyPriIsdnPortDefinitionBuilder_4403 | Configuration - Policy PRI ISDN Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/priisdnport/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyPriIsdnPortDefinitionBuilder_5303 | Configuration - Policy PRI ISDN Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/priisdnport/preview` | previewPolicyDefinition_ConfigurationPolicyPriIsdnPortDefinitionBuilder_4704 | Configuration - Policy PRI ISDN Port Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/priisdnport/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyPriIsdnPortDefinitionBuilder_5203 | Configuration - Policy PRI ISDN Port Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/protocolname` | deletePolicyListsWithInfoTag_ConfigurationPolicyProtocolNameListBuilder_3406 | Configuration - Policy Protocol Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/protocolname` | getPolicyLists_ConfigurationPolicyProtocolNameListBuilder_3403 | Configuration - Policy Protocol Name List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/protocolname` | createPolicyList_ConfigurationPolicyProtocolNameListBuilder_3404 | Configuration - Policy Protocol Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/protocolname/{id}` | deletePolicyList_ConfigurationPolicyProtocolNameListBuilder_3906 | Configuration - Policy Protocol Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/protocolname/{id}` | getListsById_ConfigurationPolicyProtocolNameListBuilder_3903 | Configuration - Policy Protocol Name List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/protocolname/{id}` | editPolicyList_ConfigurationPolicyProtocolNameListBuilder_3903 | Configuration - Policy Protocol Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/protocolname/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyProtocolNameListBuilder_4303 | Configuration - Policy Protocol Name List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/protocolname/preview` | previewPolicyList_ConfigurationPolicyProtocolNameListBuilder_4204 | Configuration - Policy Protocol Name List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/protocolname/preview/{id}` | previewPolicyListById_ConfigurationPolicyProtocolNameListBuilder_4703 | Configuration - Policy Protocol Name List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/qosmap` | getDefinitions_ConfigurationPolicyQosMapDefinitionBuilder_3403 | Configuration - Policy Qos Map Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/qosmap` | createPolicyDefinition_ConfigurationPolicyQosMapDefinitionBuilder_3404 | Configuration - Policy Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/qosmap/{id}` | deletePolicyDefinition_ConfigurationPolicyQosMapDefinitionBuilder_3906 | Configuration - Policy Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/qosmap/{id}` | getPolicyDefinition_ConfigurationPolicyQosMapDefinitionBuilder_3903 | Configuration - Policy Qos Map Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/qosmap/{id}` | editPolicyDefinition_ConfigurationPolicyQosMapDefinitionBuilder_3903 | Configuration - Policy Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/qosmap/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyQosMapDefinitionBuilder_3903 | Configuration - Policy Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/qosmap/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyQosMapDefinitionBuilder_4803 | Configuration - Policy Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/qosmap/preview` | previewPolicyDefinition_ConfigurationPolicyQosMapDefinitionBuilder_4204 | Configuration - Policy Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/qosmap/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyQosMapDefinitionBuilder_4703 | Configuration - Policy Qos Map Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/region` | deletePolicyListsWithInfoTag_ConfigurationPolicyRegionListBuilder_2806 | Configuration - Policy Region List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/region` | getPolicyLists_ConfigurationPolicyRegionListBuilder_2803 | Configuration - Policy Region List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/region` | createPolicyList_ConfigurationPolicyRegionListBuilder_2804 | Configuration - Policy Region List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/region/{id}` | deletePolicyList_ConfigurationPolicyRegionListBuilder_3306 | Configuration - Policy Region List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/region/{id}` | getListsById_ConfigurationPolicyRegionListBuilder_3303 | Configuration - Policy Region List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/region/{id}` | editPolicyList_ConfigurationPolicyRegionListBuilder_3303 | Configuration - Policy Region List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/region/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyRegionListBuilder_3703 | Configuration - Policy Region List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/region/preview` | previewPolicyList_ConfigurationPolicyRegionListBuilder_3604 | Configuration - Policy Region List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/region/preview/{id}` | previewPolicyListById_ConfigurationPolicyRegionListBuilder_4103 | Configuration - Policy Region List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/rewriterule` | getDefinitions_ConfigurationPolicyRewriteRuleDefinitionBuilder_3903 | Configuration - Policy Rewrite Rule Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/rewriterule` | createPolicyDefinition_ConfigurationPolicyRewriteRuleDefinitionBuilder_3904 | Configuration - Policy Rewrite Rule Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/rewriterule/{id}` | deletePolicyDefinition_ConfigurationPolicyRewriteRuleDefinitionBuilder_4406 | Configuration - Policy Rewrite Rule Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/rewriterule/{id}` | getPolicyDefinition_ConfigurationPolicyRewriteRuleDefinitionBuilder_4403 | Configuration - Policy Rewrite Rule Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/rewriterule/{id}` | editPolicyDefinition_ConfigurationPolicyRewriteRuleDefinitionBuilder_4403 | Configuration - Policy Rewrite Rule Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/rewriterule/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyRewriteRuleDefinitionBuilder_4403 | Configuration - Policy Rewrite Rule Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/rewriterule/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyRewriteRuleDefinitionBuilder_5303 | Configuration - Policy Rewrite Rule Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/rewriterule/preview` | previewPolicyDefinition_ConfigurationPolicyRewriteRuleDefinitionBuilder_4704 | Configuration - Policy Rewrite Rule Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/rewriterule/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyRewriteRuleDefinitionBuilder_5203 | Configuration - Policy Rewrite Rule Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/scalablegrouptag` | deletePolicyListsWithInfoTag_ConfigurationPolicyScalableGroupTagListBuilder_3806 | Configuration - Policy Scalable Group Tag List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/scalablegrouptag` | getPolicyLists_ConfigurationPolicyScalableGroupTagListBuilder_3803 | Configuration - Policy Scalable Group Tag List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/scalablegrouptag` | createPolicyList_ConfigurationPolicyScalableGroupTagListBuilder_3804 | Configuration - Policy Scalable Group Tag List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/scalablegrouptag/{id}` | deletePolicyList_ConfigurationPolicyScalableGroupTagListBuilder_4306 | Configuration - Policy Scalable Group Tag List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/scalablegrouptag/{id}` | getListsById_ConfigurationPolicyScalableGroupTagListBuilder_4303 | Configuration - Policy Scalable Group Tag List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/scalablegrouptag/{id}` | editPolicyList_ConfigurationPolicyScalableGroupTagListBuilder_4303 | Configuration - Policy Scalable Group Tag List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/scalablegrouptag/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyScalableGroupTagListBuilder_4703 | Configuration - Policy Scalable Group Tag List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/scalablegrouptag/preview` | previewPolicyList_ConfigurationPolicyScalableGroupTagListBuilder_4604 | Configuration - Policy Scalable Group Tag List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/scalablegrouptag/preview/{id}` | previewPolicyListById_ConfigurationPolicyScalableGroupTagListBuilder_5103 | Configuration - Policy Scalable Group Tag List Builder | read | Read (needs IDs) | path: id |
| POST | `/dataservice/template/policy/assembly/security` | preview_ConfigurationPolicySecurityAssembler_3404 | Configuration - Policy Security Assembler | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/assembly/security/{id}` | previewById_ConfigurationPolicySecurityAssembler_3903 | Configuration - Policy Security Assembler | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/site` | deletePolicyListsWithInfoTag_ConfigurationPolicySiteListBuilder_2606 | Configuration - Policy Site List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/site` | getPolicyLists_ConfigurationPolicySiteListBuilder_2603 | Configuration - Policy Site List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/site` | createPolicyList_ConfigurationPolicySiteListBuilder_2604 | Configuration - Policy Site List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/site/{id}` | deletePolicyList_ConfigurationPolicySiteListBuilder_3106 | Configuration - Policy Site List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/site/{id}` | getListsById_ConfigurationPolicySiteListBuilder_3103 | Configuration - Policy Site List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/site/{id}` | editPolicyList_ConfigurationPolicySiteListBuilder_3103 | Configuration - Policy Site List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/list/site/defaultsite` | createDefaultSiteList | Configuration - Policy Site List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/site/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicySiteListBuilder_3503 | Configuration - Policy Site List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/site/preview` | previewPolicyList_ConfigurationPolicySiteListBuilder_3404 | Configuration - Policy Site List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/site/preview/{id}` | previewPolicyListById_ConfigurationPolicySiteListBuilder_3903 | Configuration - Policy Site List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/sla` | deletePolicyListsWithInfoTag_ConfigurationPolicySlaClassListBuilder_2506 | Configuration - Policy SLA Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/sla` | getPolicyLists_ConfigurationPolicySlaClassListBuilder_2503 | Configuration - Policy SLA Class List Builder | read | Verified live | 8 rows |
| POST | `/dataservice/template/policy/list/sla` | createPolicyList_ConfigurationPolicySlaClassListBuilder_2504 | Configuration - Policy SLA Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/sla/{id}` | deletePolicyList_ConfigurationPolicySlaClassListBuilder_3006 | Configuration - Policy SLA Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/sla/{id}` | getListsById_ConfigurationPolicySlaClassListBuilder_3003 | Configuration - Policy SLA Class List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/sla/{id}` | editPolicyList_ConfigurationPolicySlaClassListBuilder_3003 | Configuration - Policy SLA Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/sla/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicySlaClassListBuilder_3403 | Configuration - Policy SLA Class List Builder | read | Verified live | 8 rows |
| POST | `/dataservice/template/policy/list/sla/preview` | previewPolicyList_ConfigurationPolicySlaClassListBuilder_3304 | Configuration - Policy SLA Class List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/sla/preview/{id}` | previewPolicyListById_ConfigurationPolicySlaClassListBuilder_3803 | Configuration - Policy SLA Class List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/supervisorydisc` | deletePolicyListsWithInfoTag_ConfigurationPolicySupervisoryDiscListBuilder_3706 | Configuration - Policy Supervisory Disc List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/supervisorydisc` | getPolicyLists_ConfigurationPolicySupervisoryDiscListBuilder_3703 | Configuration - Policy Supervisory Disc List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/supervisorydisc` | createPolicyList_ConfigurationPolicySupervisoryDiscListBuilder_3704 | Configuration - Policy Supervisory Disc List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/supervisorydisc/{id}` | deletePolicyList_ConfigurationPolicySupervisoryDiscListBuilder_4206 | Configuration - Policy Supervisory Disc List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/supervisorydisc/{id}` | getListsById_ConfigurationPolicySupervisoryDiscListBuilder_4203 | Configuration - Policy Supervisory Disc List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/supervisorydisc/{id}` | editPolicyList_ConfigurationPolicySupervisoryDiscListBuilder_4203 | Configuration - Policy Supervisory Disc List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/supervisorydisc/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicySupervisoryDiscListBuilder_4603 | Configuration - Policy Supervisory Disc List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/supervisorydisc/preview` | previewPolicyList_ConfigurationPolicySupervisoryDiscListBuilder_4504 | Configuration - Policy Supervisory Disc List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/supervisorydisc/preview/{id}` | previewPolicyListById_ConfigurationPolicySupervisoryDiscListBuilder_5003 | Configuration - Policy Supervisory Disc List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/tgapikey` | deletePolicyListsWithInfoTag_ConfigurationPolicyThreatGridApiKeyList_3006 | Configuration - Policy Threat Grid Api Key List | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tgapikey` | getPolicyLists_ConfigurationPolicyThreatGridApiKeyList_3003 | Configuration - Policy Threat Grid Api Key List | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/tgapikey` | createPolicyList_ConfigurationPolicyThreatGridApiKeyList_3004 | Configuration - Policy Threat Grid Api Key List | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/tgapikey/{id}` | deletePolicyList_ConfigurationPolicyThreatGridApiKeyList_3506 | Configuration - Policy Threat Grid Api Key List | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tgapikey/{id}` | getListsById_ConfigurationPolicyThreatGridApiKeyList_3503 | Configuration - Policy Threat Grid Api Key List | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/tgapikey/{id}` | editPolicyList_ConfigurationPolicyThreatGridApiKeyList_3503 | Configuration - Policy Threat Grid Api Key List | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tgapikey/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyThreatGridApiKeyList_3903 | Configuration - Policy Threat Grid Api Key List | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/tgapikey/preview` | previewPolicyList_ConfigurationPolicyThreatGridApiKeyList_3804 | Configuration - Policy Threat Grid Api Key List | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tgapikey/preview/{id}` | previewPolicyListById_ConfigurationPolicyThreatGridApiKeyList_4303 | Configuration - Policy Threat Grid Api Key List | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/tloc` | deletePolicyListsWithInfoTag_ConfigurationPolicyTlocListBuilder_2606 | Configuration - Policy TLOC List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tloc` | getPolicyLists_ConfigurationPolicyTlocListBuilder_2603 | Configuration - Policy TLOC List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/tloc` | createPolicyList_ConfigurationPolicyTlocListBuilder_2604 | Configuration - Policy TLOC List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/tloc/{id}` | deletePolicyList_ConfigurationPolicyTlocListBuilder_3106 | Configuration - Policy TLOC List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tloc/{id}` | getListsById_ConfigurationPolicyTlocListBuilder_3103 | Configuration - Policy TLOC List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/tloc/{id}` | editPolicyList_ConfigurationPolicyTlocListBuilder_3103 | Configuration - Policy TLOC List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tloc/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyTlocListBuilder_3503 | Configuration - Policy TLOC List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/tloc/preview` | previewPolicyList_ConfigurationPolicyTlocListBuilder_3404 | Configuration - Policy TLOC List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/tloc/preview/{id}` | previewPolicyListById_ConfigurationPolicyTlocListBuilder_3903 | Configuration - Policy TLOC List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/translationprofile` | deletePolicyListsWithInfoTag_ConfigurationPolicyTranslationprofileListBuilder_4006 | Configuration - Policy TranslationProfile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationprofile` | getPolicyLists_ConfigurationPolicyTranslationprofileListBuilder_4003 | Configuration - Policy TranslationProfile List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/translationprofile` | createPolicyList_ConfigurationPolicyTranslationprofileListBuilder_4004 | Configuration - Policy TranslationProfile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/translationprofile/{id}` | deletePolicyList_ConfigurationPolicyTranslationprofileListBuilder_4506 | Configuration - Policy TranslationProfile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationprofile/{id}` | getListsById_ConfigurationPolicyTranslationprofileListBuilder_4503 | Configuration - Policy TranslationProfile List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/translationprofile/{id}` | editPolicyList_ConfigurationPolicyTranslationprofileListBuilder_4503 | Configuration - Policy TranslationProfile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationprofile/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyTranslationprofileListBuilder_4903 | Configuration - Policy TranslationProfile List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/translationprofile/preview` | previewPolicyList_ConfigurationPolicyTranslationprofileListBuilder_4804 | Configuration - Policy TranslationProfile List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationprofile/preview/{id}` | previewPolicyListById_ConfigurationPolicyTranslationprofileListBuilder_5303 | Configuration - Policy TranslationProfile List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/translationrules` | deletePolicyListsWithInfoTag_ConfigurationPolicyTranslationrulesListBuilder_3806 | Configuration - Policy TranslationRules List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationrules` | getPolicyLists_ConfigurationPolicyTranslationrulesListBuilder_3803 | Configuration - Policy TranslationRules List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/translationrules` | createPolicyList_ConfigurationPolicyTranslationrulesListBuilder_3804 | Configuration - Policy TranslationRules List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/translationrules/{id}` | deletePolicyList_ConfigurationPolicyTranslationrulesListBuilder_4306 | Configuration - Policy TranslationRules List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationrules/{id}` | getListsById_ConfigurationPolicyTranslationrulesListBuilder_4303 | Configuration - Policy TranslationRules List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/translationrules/{id}` | editPolicyList_ConfigurationPolicyTranslationrulesListBuilder_4303 | Configuration - Policy TranslationRules List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationrules/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyTranslationrulesListBuilder_4703 | Configuration - Policy TranslationRules List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/translationrules/preview` | previewPolicyList_ConfigurationPolicyTranslationrulesListBuilder_4604 | Configuration - Policy TranslationRules List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/translationrules/preview/{id}` | previewPolicyListById_ConfigurationPolicyTranslationrulesListBuilder_5103 | Configuration - Policy TranslationRules List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/trunkgroup` | deletePolicyListsWithInfoTag_ConfigurationPolicyTrunkGroupListBuilder_3206 | Configuration - Policy Trunk Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/trunkgroup` | getPolicyLists_ConfigurationPolicyTrunkGroupListBuilder_3203 | Configuration - Policy Trunk Group List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/trunkgroup` | createPolicyList_ConfigurationPolicyTrunkGroupListBuilder_3204 | Configuration - Policy Trunk Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/trunkgroup/{id}` | deletePolicyList_ConfigurationPolicyTrunkGroupListBuilder_3706 | Configuration - Policy Trunk Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/trunkgroup/{id}` | getListsById_ConfigurationPolicyTrunkGroupListBuilder_3703 | Configuration - Policy Trunk Group List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/trunkgroup/{id}` | editPolicyList_ConfigurationPolicyTrunkGroupListBuilder_3703 | Configuration - Policy Trunk Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/trunkgroup/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyTrunkGroupListBuilder_4103 | Configuration - Policy Trunk Group List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/trunkgroup/preview` | previewPolicyList_ConfigurationPolicyTrunkGroupListBuilder_4004 | Configuration - Policy Trunk Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/trunkgroup/preview/{id}` | previewPolicyListById_ConfigurationPolicyTrunkGroupListBuilder_4503 | Configuration - Policy Trunk Group List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/umbrelladata` | deletePolicyListsWithInfoTag_ConfigurationPolicyUmbrellaDataListBuilder_3406 | Configuration - Policy Umbrella Data List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/umbrelladata` | getPolicyLists_ConfigurationPolicyUmbrellaDataListBuilder_3403 | Configuration - Policy Umbrella Data List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/umbrelladata` | createPolicyList_ConfigurationPolicyUmbrellaDataListBuilder_3404 | Configuration - Policy Umbrella Data List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/umbrelladata/{id}` | deletePolicyList_ConfigurationPolicyUmbrellaDataListBuilder_3906 | Configuration - Policy Umbrella Data List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/umbrelladata/{id}` | getListsById_ConfigurationPolicyUmbrellaDataListBuilder_3903 | Configuration - Policy Umbrella Data List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/umbrelladata/{id}` | editPolicyList_ConfigurationPolicyUmbrellaDataListBuilder_3903 | Configuration - Policy Umbrella Data List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/umbrelladata/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyUmbrellaDataListBuilder_4303 | Configuration - Policy Umbrella Data List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/umbrelladata/preview` | previewPolicyList_ConfigurationPolicyUmbrellaDataListBuilder_4204 | Configuration - Policy Umbrella Data List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/umbrelladata/preview/{id}` | previewPolicyListById_ConfigurationPolicyUmbrellaDataListBuilder_4703 | Configuration - Policy Umbrella Data List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/urlblacklist` | deletePolicyListsWithInfoTag_ConfigurationPolicyUrlBlacklistBuilder_3406 | Configuration - Policy URL BlackList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlblacklist` | getPolicyLists_ConfigurationPolicyUrlBlacklistBuilder_3403 | Configuration - Policy URL BlackList Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/urlblacklist` | createPolicyList_ConfigurationPolicyUrlBlacklistBuilder_3404 | Configuration - Policy URL BlackList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/urlblacklist/{id}` | deletePolicyList_ConfigurationPolicyUrlBlacklistBuilder_3906 | Configuration - Policy URL BlackList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlblacklist/{id}` | getListsById_ConfigurationPolicyUrlBlacklistBuilder_3903 | Configuration - Policy URL BlackList Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/urlblacklist/{id}` | editPolicyList_ConfigurationPolicyUrlBlacklistBuilder_3903 | Configuration - Policy URL BlackList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlblacklist/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyUrlBlacklistBuilder_4303 | Configuration - Policy URL BlackList Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/urlblacklist/preview` | previewPolicyList_ConfigurationPolicyUrlBlacklistBuilder_4204 | Configuration - Policy URL BlackList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlblacklist/preview/{id}` | previewPolicyListById_ConfigurationPolicyUrlBlacklistBuilder_4703 | Configuration - Policy URL BlackList Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/urlfiltering` | getDefinitions_ConfigurationPolicyUrlFilteringDefinitionBuilder_4003 | Configuration - Policy URL Filtering Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/urlfiltering` | createPolicyDefinition_ConfigurationPolicyUrlFilteringDefinitionBuilder_4004 | Configuration - Policy URL Filtering Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/urlfiltering/{id}` | deletePolicyDefinition_ConfigurationPolicyUrlFilteringDefinitionBuilder_4506 | Configuration - Policy URL Filtering Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/urlfiltering/{id}` | getPolicyDefinition_ConfigurationPolicyUrlFilteringDefinitionBuilder_4503 | Configuration - Policy URL Filtering Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/urlfiltering/{id}` | editPolicyDefinition_ConfigurationPolicyUrlFilteringDefinitionBuilder_4503 | Configuration - Policy URL Filtering Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/urlfiltering/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyUrlFilteringDefinitionBuilder_4503 | Configuration - Policy URL Filtering Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/urlfiltering/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyUrlFilteringDefinitionBuilder_5403 | Configuration - Policy URL Filtering Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/urlfiltering/preview` | previewPolicyDefinition_ConfigurationPolicyUrlFilteringDefinitionBuilder_4804 | Configuration - Policy URL Filtering Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/urlfiltering/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyUrlFilteringDefinitionBuilder_5303 | Configuration - Policy URL Filtering Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/urlwhitelist` | deletePolicyListsWithInfoTag_ConfigurationPolicyUrlWhitelistBuilder_3406 | Configuration - Policy URL WhiteList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlwhitelist` | getPolicyLists_ConfigurationPolicyUrlWhitelistBuilder_3403 | Configuration - Policy URL WhiteList Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/urlwhitelist` | createPolicyList_ConfigurationPolicyUrlWhitelistBuilder_3404 | Configuration - Policy URL WhiteList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/urlwhitelist/{id}` | deletePolicyList_ConfigurationPolicyUrlWhitelistBuilder_3906 | Configuration - Policy URL WhiteList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlwhitelist/{id}` | getListsById_ConfigurationPolicyUrlWhitelistBuilder_3903 | Configuration - Policy URL WhiteList Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/urlwhitelist/{id}` | editPolicyList_ConfigurationPolicyUrlWhitelistBuilder_3903 | Configuration - Policy URL WhiteList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlwhitelist/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyUrlWhitelistBuilder_4303 | Configuration - Policy URL WhiteList Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/urlwhitelist/preview` | previewPolicyList_ConfigurationPolicyUrlWhitelistBuilder_4204 | Configuration - Policy URL WhiteList Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/urlwhitelist/preview/{id}` | previewPolicyListById_ConfigurationPolicyUrlWhitelistBuilder_4703 | Configuration - Policy URL WhiteList Builder | read | Read (needs IDs) | path: id |
| POST | `/dataservice/template/policy/assembly/vedge` | preview_ConfigurationPolicyVedgeAssembler_3104 | Configuration - Policy vEdge Assembler | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/assembly/vedge/{id}` | previewById_ConfigurationPolicyVedgeAssembler_3603 | Configuration - Policy vEdge Assembler | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/vedgeroute` | getDefinitions_ConfigurationPolicyVedgeRouteDefinitionBuilder_3803 | Configuration - Policy vEdge Route Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/vedgeroute` | createPolicyDefinition_ConfigurationPolicyVedgeRouteDefinitionBuilder_3804 | Configuration - Policy vEdge Route Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/vedgeroute/{id}` | deletePolicyDefinition_ConfigurationPolicyVedgeRouteDefinitionBuilder_4306 | Configuration - Policy vEdge Route Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/vedgeroute/{id}` | getPolicyDefinition_ConfigurationPolicyVedgeRouteDefinitionBuilder_4303 | Configuration - Policy vEdge Route Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/vedgeroute/{id}` | editPolicyDefinition_ConfigurationPolicyVedgeRouteDefinitionBuilder_4303 | Configuration - Policy vEdge Route Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/vedgeroute/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyVedgeRouteDefinitionBuilder_4303 | Configuration - Policy vEdge Route Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/vedgeroute/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyVedgeRouteDefinitionBuilder_5203 | Configuration - Policy vEdge Route Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/vedgeroute/preview` | previewPolicyDefinition_ConfigurationPolicyVedgeRouteDefinitionBuilder_4604 | Configuration - Policy vEdge Route Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/vedgeroute/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyVedgeRouteDefinitionBuilder_5103 | Configuration - Policy vEdge Route Definition Builder | read | Read (needs IDs) | path: id |
| POST | `/dataservice/template/policy/assembly/voice` | preview_ConfigurationPolicyVoiceAssembler_3104 | Configuration - Policy Voice Assembler | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/assembly/voice/{id}` | previewById_ConfigurationPolicyVoiceAssembler_3603 | Configuration - Policy Voice Assembler | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/vpn` | deletePolicyListsWithInfoTag_ConfigurationPolicyVpnListBuilder_2506 | Configuration - Policy VPN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/vpn` | getPolicyLists_ConfigurationPolicyVpnListBuilder_2503 | Configuration - Policy VPN List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/vpn` | createPolicyList_ConfigurationPolicyVpnListBuilder_2504 | Configuration - Policy VPN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/vpn/{id}` | deletePolicyList_ConfigurationPolicyVpnListBuilder_3006 | Configuration - Policy VPN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/vpn/{id}` | getListsById_ConfigurationPolicyVpnListBuilder_3003 | Configuration - Policy VPN List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/vpn/{id}` | editPolicyList_ConfigurationPolicyVpnListBuilder_3003 | Configuration - Policy VPN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/vpn/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyVpnListBuilder_3403 | Configuration - Policy VPN List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/vpn/preview` | previewPolicyList_ConfigurationPolicyVpnListBuilder_3304 | Configuration - Policy VPN List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/vpn/preview/{id}` | previewPolicyListById_ConfigurationPolicyVpnListBuilder_3803 | Configuration - Policy VPN List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/vpnmembershipgroup` | getDefinitions_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_4603 | Configuration - Policy VPN Membership Group Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/vpnmembershipgroup` | createPolicyDefinition_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_4604 | Configuration - Policy VPN Membership Group Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/vpnmembershipgroup/{id}` | deletePolicyDefinition_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_5106 | Configuration - Policy VPN Membership Group Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/vpnmembershipgroup/{id}` | getPolicyDefinition_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_5103 | Configuration - Policy VPN Membership Group Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/vpnmembershipgroup/{id}` | editPolicyDefinition_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_5103 | Configuration - Policy VPN Membership Group Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/vpnmembershipgroup/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_5103 | Configuration - Policy VPN Membership Group Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/vpnmembershipgroup/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_6003 | Configuration - Policy VPN Membership Group Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/vpnmembershipgroup/preview` | previewPolicyDefinition_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_5404 | Configuration - Policy VPN Membership Group Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/vpnmembershipgroup/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyVpnMembershipGroupDefinitionBuilder_5903 | Configuration - Policy VPN Membership Group Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/vpnqosmap` | getDefinitions_ConfigurationPolicyVpnQosMapDefinitionBuilder_3703 | Configuration - Policy VPN-Qos Map Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/vpnqosmap` | createPolicyDefinition_ConfigurationPolicyVpnQosMapDefinitionBuilder_3704 | Configuration - Policy VPN-Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/vpnqosmap/{id}` | deletePolicyDefinition_ConfigurationPolicyVpnQosMapDefinitionBuilder_4206 | Configuration - Policy VPN-Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/vpnqosmap/{id}` | getPolicyDefinition_ConfigurationPolicyVpnQosMapDefinitionBuilder_4203 | Configuration - Policy VPN-Qos Map Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/vpnqosmap/{id}` | editPolicyDefinition_ConfigurationPolicyVpnQosMapDefinitionBuilder_4203 | Configuration - Policy VPN-Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/vpnqosmap/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyVpnQosMapDefinitionBuilder_4203 | Configuration - Policy VPN-Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/vpnqosmap/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyVpnQosMapDefinitionBuilder_5103 | Configuration - Policy VPN-Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/vpnqosmap/preview` | previewPolicyDefinition_ConfigurationPolicyVpnQosMapDefinitionBuilder_4504 | Configuration - Policy VPN-Qos Map Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/vpnqosmap/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyVpnQosMapDefinitionBuilder_5003 | Configuration - Policy VPN-Qos Map Definition Builder | read | Read (needs IDs) | path: id |
| POST | `/dataservice/template/policy/assembly/vsmart` | preview_ConfigurationPolicyVsmartAssembler_3204 | Configuration - Policy vSmart Assembler | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/assembly/vsmart/{id}` | previewById_ConfigurationPolicyVsmartAssembler_3703 | Configuration - Policy vSmart Assembler | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/zonebasedfw` | getDefinitions_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_3903 | Configuration - Policy Zone Based Firewall Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/zonebasedfw` | createPolicyDefinition_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_3904 | Configuration - Policy Zone Based Firewall Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/zonebasedfw/{id}` | deletePolicyDefinition_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_4406 | Configuration - Policy Zone Based Firewall Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/zonebasedfw/{id}` | getPolicyDefinition_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_4403 | Configuration - Policy Zone Based Firewall Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/zonebasedfw/{id}` | editPolicyDefinition_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_4403 | Configuration - Policy Zone Based Firewall Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/zonebasedfw/bulk` | savePolicyDefinitionInBulk_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_4403 | Configuration - Policy Zone Based Firewall Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/zonebasedfw/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_5303 | Configuration - Policy Zone Based Firewall Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/zonebasedfw/preview` | previewPolicyDefinition_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_4704 | Configuration - Policy Zone Based Firewall Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/zonebasedfw/preview/{id}` | previewPolicyDefinitionById_ConfigurationPolicyZoneBasedFirewallDefinitionBuilder_5203 | Configuration - Policy Zone Based Firewall Definition Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/zone` | deletePolicyListsWithInfoTag_ConfigurationPolicyZoneListBuilder_2606 | Configuration - Policy Zone List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/zone` | getPolicyLists_ConfigurationPolicyZoneListBuilder_2603 | Configuration - Policy Zone List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/zone` | createPolicyList_ConfigurationPolicyZoneListBuilder_2604 | Configuration - Policy Zone List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/zone/{id}` | deletePolicyList_ConfigurationPolicyZoneListBuilder_3106 | Configuration - Policy Zone List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/zone/{id}` | getListsById_ConfigurationPolicyZoneListBuilder_3103 | Configuration - Policy Zone List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/zone/{id}` | editPolicyList_ConfigurationPolicyZoneListBuilder_3103 | Configuration - Policy Zone List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/zone/filtered` | getPolicyListsWithInfoTag_ConfigurationPolicyZoneListBuilder_3503 | Configuration - Policy Zone List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/zone/preview` | previewPolicyList_ConfigurationPolicyZoneListBuilder_3404 | Configuration - Policy Zone List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/zone/preview/{id}` | previewPolicyListById_ConfigurationPolicyZoneListBuilder_3903 | Configuration - Policy Zone List Builder | read | Read (needs IDs) | path: id |
| DELETE | `/dataservice/template/policy/list/preferredcolorgroup` | deletePolicyListsWithInfoTag_ConfigurationPreferredColorGroupListBuilder_4106 | Configuration - Preferred Color Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/preferredcolorgroup` | getPolicyLists_ConfigurationPreferredColorGroupListBuilder_4103 | Configuration - Preferred Color Group List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/preferredcolorgroup` | createPolicyList_ConfigurationPreferredColorGroupListBuilder_4104 | Configuration - Preferred Color Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/list/preferredcolorgroup/{id}` | deletePolicyList_ConfigurationPreferredColorGroupListBuilder_4606 | Configuration - Preferred Color Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/preferredcolorgroup/{id}` | getListsById_ConfigurationPreferredColorGroupListBuilder_4603 | Configuration - Preferred Color Group List Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/list/preferredcolorgroup/{id}` | editPolicyList_ConfigurationPreferredColorGroupListBuilder_4603 | Configuration - Preferred Color Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/preferredcolorgroup/filtered` | getPolicyListsWithInfoTag_ConfigurationPreferredColorGroupListBuilder_5003 | Configuration - Preferred Color Group List Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/list/preferredcolorgroup/preview` | previewPolicyList_ConfigurationPreferredColorGroupListBuilder_4904 | Configuration - Preferred Color Group List Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/list/preferredcolorgroup/preview/{id}` | previewPolicyListById_ConfigurationPreferredColorGroupListBuilder_5403 | Configuration - Preferred Color Group List Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/config/quickConnect/enhancedAuthentication/status` | getQuickConnectEnhancedAuthenticationStatus | Configuration - Quick Connect | read | Verified live | object |
| POST | `/dataservice/template/config/quickConnect/submitDevices` | submitDay0Config | Configuration - Quick Connect | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/ruleset` | getDefinitions_ConfigurationRuleSetDefinition_3503 | Configuration - Rule Set Definition | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/ruleset` | createPolicyDefinition_ConfigurationRuleSetDefinition_3504 | Configuration - Rule Set Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/ruleset/{id}` | deletePolicyDefinition_ConfigurationRuleSetDefinition_4006 | Configuration - Rule Set Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/ruleset/{id}` | getPolicyDefinition_ConfigurationRuleSetDefinition_4003 | Configuration - Rule Set Definition | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/ruleset/{id}` | editPolicyDefinition_ConfigurationRuleSetDefinition_4003 | Configuration - Rule Set Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/ruleset/bulk` | savePolicyDefinitionInBulk_ConfigurationRuleSetDefinition_4003 | Configuration - Rule Set Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/ruleset/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationRuleSetDefinition_4903 | Configuration - Rule Set Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/ruleset/preview` | previewPolicyDefinition_ConfigurationRuleSetDefinition_4304 | Configuration - Rule Set Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/ruleset/preview/{id}` | previewPolicyDefinitionById_ConfigurationRuleSetDefinition_4803 | Configuration - Rule Set Definition | read | Read (needs IDs) | path: id |
| GET | `/dataservice/sig/datacenters/{type}/{tunneltype}` | getSigDynamicDataCenterList | Configuration - Secure Internet Gateway | read | Read (needs IDs) | path: type, tunneltype |
| GET | `/dataservice/sig/datacenters/{type}/{tunneltype}/{devicetype}` | getSigDataCenterList | Configuration - Secure Internet Gateway | read | Read (needs IDs) | path: type, tunneltype, devicetype |
| GET | `/dataservice/sig/sigGlobalCredentials/{featureTemplateType}` | getSigGlobalCredentials | Configuration - Secure Internet Gateway | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/sig/umbrella/childOrg/{type}` | getChildOrgs | Configuration - Secure Internet Gateway | read | Read (needs IDs) | path: type |
| GET | `/dataservice/template/cloudx/sig_tunnels` | getSigTunnelList_ConfigurationSecureInternetGatewayTunnels_2803 | Configuration - Secure Internet Gateway Tunnels | read | Verified live | deviceId=<edge>: object |
| GET | `/dataservice/template/policy/definition/securitygroup` | getDefinitions_ConfigurationSecurityGroupDefinition_4103 | Configuration - Security Group Definition | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/securitygroup` | createPolicyDefinition_ConfigurationSecurityGroupDefinition_4104 | Configuration - Security Group Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/securitygroup/{id}` | deletePolicyDefinition_ConfigurationSecurityGroupDefinition_4606 | Configuration - Security Group Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/securitygroup/{id}` | getPolicyDefinition_ConfigurationSecurityGroupDefinition_4603 | Configuration - Security Group Definition | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/securitygroup/{id}` | editPolicyDefinition_ConfigurationSecurityGroupDefinition_4603 | Configuration - Security Group Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/securitygroup/bulk` | savePolicyDefinitionInBulk_ConfigurationSecurityGroupDefinition_4603 | Configuration - Security Group Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/securitygroup/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationSecurityGroupDefinition_5503 | Configuration - Security Group Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/securitygroup/preview` | previewPolicyDefinition_ConfigurationSecurityGroupDefinition_4904 | Configuration - Security Group Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/securitygroup/preview/{id}` | previewPolicyDefinitionById_ConfigurationSecurityGroupDefinition_5403 | Configuration - Security Group Definition | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/security` | generateSecurityTemplateList | Configuration - Security Template Policy | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/security` | createSecurityTemplate | Configuration - Security Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/security/{deviceModel}` | getSecurityTemplatesForDevice | Configuration - Security Template Policy | read | Read (needs IDs) | path: deviceModel |
| DELETE | `/dataservice/template/policy/security/{policyId}` | deleteSecurityTemplate | Configuration - Security Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/security/{policyId}` | editSecurityTemplate | Configuration - Security Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/security/definition/{policyId}` | getSecurityTemplate | Configuration - Security Template Policy | read | Read (needs IDs) | path: policyId |
| GET | `/dataservice/template/policy/security/devices` | getSecurityPolicyDeviceList_ConfigurationSecurityTemplatePolicy_3303 | Configuration - Security Template Policy | read | Verified live | 17 rows |
| GET | `/dataservice/template/policy/security/devices/{policyId}` | getDeviceListById | Configuration - Security Template Policy | read | Read (needs IDs) | path: policyId |
| PUT | `/dataservice/template/policy/security/staging/{policyId}` | editTemplateWithLenientLock | Configuration - Security Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/security/summary` | generateSecurityPolicySummary | Configuration - Security Template Policy | read | Verified live | 0 rows |
| GET | `/dataservice/segment` | getSegments | Configuration - Segments | read | Verified live | 4 rows |
| POST | `/dataservice/segment` | createSegment | Configuration - Segments | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/segment/{id}` | deleteSegment | Configuration - Segments | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/segment/{id}` | getSegment | Configuration - Segments | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/segment/{id}` | editSegment | Configuration - Segments | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/settings/banner` | getBanner | Configuration - Settings | read | Verified live | 1 rows |
| GET | `/dataservice/settings/clientSessionTimeout` | getSessionTimout | Configuration - Settings | read | Verified live | 1 rows |
| GET | `/dataservice/settings/configuration/{type}` | getConfigurationBySettingType | Configuration - Settings | read | Read (needs IDs) | path: type |
| POST | `/dataservice/settings/configuration/{type}` | newConfiguration | Configuration - Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/settings/configuration/{type}` | editConfiguration | Configuration - Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/settings/configuration/analytics/dca` | createAnalyticsDataFile | Configuration - Settings | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/settings/configuration/certificate/{type}` | getCertConfiguration | Configuration - Settings | read | Read (needs IDs) | path: type |
| POST | `/dataservice/settings/configuration/certificate/{type}` | newCertConfiguration | Configuration - Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/settings/configuration/certificate/{type}` | editCertConfiguration | Configuration - Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/settings/configuration/cloudx` | getCloudxConfiguration | Configuration - Settings | read (deprecated) | Verified live | 1 rows |
| POST | `/dataservice/settings/configuration/cloudx` | newCloudxConfiguration | Configuration - Settings | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/settings/configuration/cloudx` | editCloudxConfiguration | Configuration - Settings | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/settings/configuration/enhancedAuthentication` | getEnhancedAuthentication | Configuration - Settings | read | Verified live | 1 rows |
| PUT | `/dataservice/settings/configuration/enhancedAuthentication` | editEnhancedAuthenticationConfiguration | Configuration - Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/settings/configuration/enhancedAuthentication/blockingEdges` | getEnhancedAuthenticationBlockingEdges | Configuration - Settings | read | Verified live | 0 rows |
| GET | `/dataservice/settings/configuration/enhancedAuthentication/enableReadiness` | validateEnhancedAuthenticationEnableReadiness | Configuration - Settings | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Failed to configure setting","code":"MAINT0004","details":"Enhanced Authentication can only be e |
| GET | `/dataservice/settings/configuration/enhancedAuthentication/status` | getEnhancedAuthenticationStatus | Configuration - Settings | read | Verified live | object |
| GET | `/dataservice/settings/configuration/googleMapKey` | getGoogleMapKey | Configuration - Settings | read | Verified live | 1 rows |
| GET | `/dataservice/settings/configuration/maintenanceWindow` | getMaintenanceWindow | Configuration - Settings | read | Verified live | 1 rows |
| GET | `/dataservice/settings/configuration/microsoftTelemetry` | getMicrosoftTelemetryConfiguration | Configuration - Settings | read (deprecated) | Verified live | 1 rows |
| POST | `/dataservice/settings/configuration/microsoftTelemetry` | newMicrosoftTelemetryConfiguration | Configuration - Settings | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/settings/configuration/microsoftTelemetry` | editMicrosoftTelemetryConfiguration | Configuration - Settings | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/settings/configuration/wani` | getWaniConfiguration | Configuration - Settings | read (deprecated) | Verified live | 1 rows |
| POST | `/dataservice/settings/configuration/wani` | newWaniConfiguration | Configuration - Settings | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/settings/configuration/wani` | editWaniConfiguration | Configuration - Settings | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/settings/passwordPolicy` | getPasswordPolicy | Configuration - Settings | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/settings/services/account/register` | authorizeServices | Configuration - Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/settings/services/account/register/token` | registerServiceToken | Configuration - Settings | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/device/action/remote-server` | getRemoteServerList | Configuration - Software Actions | read | Verified live | 0 rows |
| POST | `/dataservice/device/action/remote-server` | addRemoteServer | Configuration - Software Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/action/remote-server/{id}` | deleteRemoteServer | Configuration - Software Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/remote-server/{id}` | getRemoteServerById | Configuration - Software Actions | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/device/action/remote-server/{id}` | updateRemoteServer | Configuration - Software Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/software` | findSoftwareImages | Configuration - Software Actions | read | Verified live | 2 rows |
| POST | `/dataservice/device/action/software` | createImageURL | Configuration - Software Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/action/software/{versionId}` | deleteImageURL | Configuration - Software Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/device/action/software/{versionId}` | updateImageURL | Configuration - Software Actions | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/software/imageProperties/{versionId}` | getImageProperties | Configuration - Software Actions | read | Read (needs IDs) | path: versionId |
| GET | `/dataservice/device/action/software/images` | findSoftwareImagesWithFilters | Configuration - Software Actions | read | Read (needs input) | query: imageType |
| GET | `/dataservice/device/action/software/platformfamily` | findSupportedPlatformFamily | Configuration - Software Actions | read | Verified live | 33 rows |
| GET | `/dataservice/device/action/software/remoteserver/{versionId}` | getImageRemoteServer | Configuration - Software Actions | read | Read (needs IDs) | path: versionId |
| PUT | `/dataservice/device/action/software/remoteserver/{versionId}` | editImageRemoteServer | Configuration - Software Actions | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/action/software/vedge/version` | findVEdgeSoftwareVersion | Configuration - Software Actions | read | Verified live | 3 rows |
| GET | `/dataservice/device/action/software/version` | findSoftwareVersion | Configuration - Software Actions | read | Verified live | 2 rows |
| GET | `/dataservice/device/action/software/vnfproperties/{versionId}` | getVnfProperties | Configuration - Software Actions | read | Read (needs IDs) | path: versionId |
| GET | `/dataservice/device/action/software/ztp/version` | findZtpSoftwareVersion | Configuration - Software Actions | read | Verified live | 29 rows |
| GET | `/dataservice/template/policy/definition/ssldecryption` | getDefinitions_ConfigurationSslDecryptionPolicyDefinitionBuilder_4103 | Configuration - SSL Decryption Policy Definition Builder | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/ssldecryption` | createPolicyDefinition_ConfigurationSslDecryptionPolicyDefinitionBuilder_4104 | Configuration - SSL Decryption Policy Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/ssldecryption/{id}` | deletePolicyDefinition_ConfigurationSslDecryptionPolicyDefinitionBuilder_4606 | Configuration - SSL Decryption Policy Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/ssldecryption/{id}` | getPolicyDefinition_ConfigurationSslDecryptionPolicyDefinitionBuilder_4603 | Configuration - SSL Decryption Policy Definition Builder | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/ssldecryption/{id}` | editPolicyDefinition_ConfigurationSslDecryptionPolicyDefinitionBuilder_4603 | Configuration - SSL Decryption Policy Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/ssldecryption/bulk` | savePolicyDefinitionInBulk_ConfigurationSslDecryptionPolicyDefinitionBuilder_4603 | Configuration - SSL Decryption Policy Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/ssldecryption/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationSslDecryptionPolicyDefinitionBuilder_5503 | Configuration - SSL Decryption Policy Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/ssldecryption/preview` | previewPolicyDefinition_ConfigurationSslDecryptionPolicyDefinitionBuilder_4904 | Configuration - SSL Decryption Policy Definition Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/ssldecryption/preview/{id}` | previewPolicyDefinitionById_ConfigurationSslDecryptionPolicyDefinitionBuilder_5403 | Configuration - SSL Decryption Policy Definition Builder | read | Read (needs IDs) | path: id |
| GET | `/dataservice/template/policy/definition/sslutdprofile` | getDefinitions_ConfigurationSslDecryptionUtdProfileDefinition_4103 | Configuration - SSL Decryption UTD Profile Definition | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/definition/sslutdprofile` | createPolicyDefinition_ConfigurationSslDecryptionUtdProfileDefinition_4104 | Configuration - SSL Decryption UTD Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/definition/sslutdprofile/{id}` | deletePolicyDefinition_ConfigurationSslDecryptionUtdProfileDefinition_4606 | Configuration - SSL Decryption UTD Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/sslutdprofile/{id}` | getPolicyDefinition_ConfigurationSslDecryptionUtdProfileDefinition_4603 | Configuration - SSL Decryption UTD Profile Definition | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/policy/definition/sslutdprofile/{id}` | editPolicyDefinition_ConfigurationSslDecryptionUtdProfileDefinition_4603 | Configuration - SSL Decryption UTD Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/sslutdprofile/bulk` | savePolicyDefinitionInBulk_ConfigurationSslDecryptionUtdProfileDefinition_4603 | Configuration - SSL Decryption UTD Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/definition/sslutdprofile/multiple/{id}` | editMultiplePolicyDefinition_ConfigurationSslDecryptionUtdProfileDefinition_5503 | Configuration - SSL Decryption UTD Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/definition/sslutdprofile/preview` | previewPolicyDefinition_ConfigurationSslDecryptionUtdProfileDefinition_4904 | Configuration - SSL Decryption UTD Profile Definition | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/definition/sslutdprofile/preview/{id}` | previewPolicyDefinitionById_ConfigurationSslDecryptionUtdProfileDefinition_5403 | Configuration - SSL Decryption UTD Profile Definition | read | Read (needs IDs) | path: id |
| PUT | `/dataservice/template/config/attach/{deviceId}` | uploadConfig | Configuration - Template Configuration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/config/attached/{deviceId}` | getAttachedConfig | Configuration - Template Configuration | read | Read (needs IDs) | path: deviceId |
| GET | `/dataservice/template/config/device/mode/cli` | generateCLIModeDevices | Configuration - Template Configuration | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"No device found","code":"DEVCONFIG0002","details":"No device found in cli mode","type":"error"}} |
| POST | `/dataservice/template/config/device/mode/cli` | updateDeviceToCLIMode | Configuration - Template Configuration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/config/device/mode/vmanage` | generatevManageModeDevices | Configuration - Template Configuration | read | Verified live | 13 rows |
| GET | `/dataservice/template/config/diff/{deviceId}` | getDeviceDiff | Configuration - Template Configuration | read (deprecated) | Read (needs IDs) | path: deviceId |
| GET | `/dataservice/template/config/rmalist/{oldDeviceId}` | getCompatibleDevices | Configuration - Template Configuration | read | Read (needs IDs) | path: oldDeviceId |
| PUT | `/dataservice/template/config/rmaupdate` | rmaUpdate | Configuration - Template Configuration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/config/running/{deviceId}` | getRunningConfig | Configuration - Template Configuration | read | Read (needs IDs) | path: deviceId |
| GET | `/dataservice/template/config/vpn/{deviceId}` | getVpnForDevice | Configuration - Template Configuration | read | Read (needs IDs) | path: deviceId |
| DELETE | `/dataservice/template/lock/{processId}` | removeLock | Configuration - Template Lock | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/lock/{processId}` | updateLeaseTime | Configuration - Template Lock | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/device` | generateMasterTemplateList | Configuration - Template Master | read | Verified live | 21 rows |
| DELETE | `/dataservice/template/device/{templateId}` | deleteMasterTemplate | Configuration - Template Master | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/device/{templateId}` | editMasterTemplate | Configuration - Template Master | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/device/{templateId}/featuretemplates` | getAssociatedFeatureTemplatesDetails | Configuration - Template Master | read | Read (needs IDs) | path: templateId |
| POST | `/dataservice/template/device/cli` | createCLITemplate | Configuration - Template Master | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/device/feature` | createMasterTemplate | Configuration - Template Master | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/device/migration` | generateTemplateForMigration | Configuration - Template Master | read | Verified live | 0 rows |
| POST | `/dataservice/template/device/migration` | migrateTemplates | Configuration - Template Master | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/device/migration_info` | migrationInfo | Configuration - Template Master | read | Verified live | 0 rows |
| GET | `/dataservice/template/device/object/{templateId}` | getMasterTemplateDefinition | Configuration - Template Master | read | Read (needs IDs) | path: templateId |
| POST | `/dataservice/template/device/resource-group/{resourceGroupName}/{templateId}` | changeTemplateResourceGroup_ConfigurationTemplateMaster_6404 | Configuration - Template Master | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/device/syncstatus` | getOutOfSyncTemplates | Configuration - Template Master | read | Verified live | 0 rows |
| GET | `/dataservice/template/device/syncstatus/{templateId}` | getOutOfSyncDevices | Configuration - Template Master | read | Read (needs IDs) | path: templateId |
| GET | `/dataservice/topology` | createFullTopology | Configuration - Topology | read | Verified live | 17 rows |
| GET | `/dataservice/topology/device` | createDeviceTopology | Configuration - Topology | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/topology/device/site/{siteId}` | getSiteTopology | Configuration - Topology | read | Read (needs IDs) | path: siteId |
| GET | `/dataservice/topology/monitor/site/{siteId}` | getSiteTopologyMonitorData | Configuration - Topology | read | Read (needs IDs) | path: siteId |
| GET | `/dataservice/topology/physical` | createPhysicalTopology | Configuration - Topology | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/template/policy/vedge` | generatePolicyTemplateList | Configuration - vEdge Template Policy | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/vedge` | createVEdgeTemplate | Configuration - vEdge Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/vedge/{policyId}` | deleteVEdgeTemplate | Configuration - vEdge Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/vedge/{policyId}` | editVEdgeTemplate | Configuration - vEdge Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/vedge/{resourceGroupName}/{policyId}` | changePolicyResourceGroup | Configuration - vEdge Template Policy | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/vedge/definition/{policyId}` | getVEdgeTemplate | Configuration - vEdge Template Policy | read | Read (needs IDs) | path: policyId |
| GET | `/dataservice/template/policy/vedge/devices` | getVEdgePolicyDeviceList | Configuration - vEdge Template Policy | read | Verified live | 17 rows |
| GET | `/dataservice/template/policy/vedge/devices/{policyId}` | getDeviceListByPolicy | Configuration - vEdge Template Policy | read | Read (needs IDs) | path: policyId |
| GET | `/dataservice/template/policy/voice` | generateVoiceTemplateList | Configuration - Voice Template Policy | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/voice` | createVoiceTemplate | Configuration - Voice Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/voice/{deviceModel}` | getVoiceTemplatesForDevice | Configuration - Voice Template Policy | read | Read (needs IDs) | path: deviceModel |
| DELETE | `/dataservice/template/policy/voice/{policyId}` | deleteVoiceTemplate | Configuration - Voice Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/voice/{policyId}` | editVoiceTemplate | Configuration - Voice Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/voice/definition/{policyId}` | getTemplateById | Configuration - Voice Template Policy | read | Read (needs IDs) | path: policyId |
| GET | `/dataservice/template/policy/voice/devices` | getVoicePolicyDeviceList | Configuration - Voice Template Policy | read | Verified live | 17 rows |
| GET | `/dataservice/template/policy/voice/devices/{policyId}` | getDeviceListByPolicyId | Configuration - Voice Template Policy | read | Read (needs IDs) | path: policyId |
| GET | `/dataservice/template/policy/voice/summary` | generateVoicePolicySummary | Configuration - Voice Template Policy | read | Verified live | 0 rows |
| GET | `/dataservice/template/policy/vsmart` | generateVSmartPolicyTemplateList | Configuration - vSmart Template Policy | read | Verified live | 0 rows |
| POST | `/dataservice/template/policy/vsmart` | createVSmartTemplate | Configuration - vSmart Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/template/policy/vsmart/{policyId}` | deleteVSmartTemplate | Configuration - vSmart Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/vsmart/{policyId}` | editVSmartTemplate | Configuration - vSmart Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/vsmart/activate/{policyId}` | activatePolicy | Configuration - vSmart Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/template/policy/vsmart/activate/central/{policyId}` | activatePolicyForCloudServices | Configuration - vSmart Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/template/policy/vsmart/central/{policyId}` | editTemplateWithoutLockChecks | Configuration - vSmart Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/vsmart/connectivity/status` | checkVSmartConnectivityStatus | Configuration - vSmart Template Policy | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Policy activation not allowed","code":"POLICY0018","details":"Unavailable due to Control Compone |
| POST | `/dataservice/template/policy/vsmart/deactivate/{policyId}` | deActivatePolicy | Configuration - vSmart Template Policy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/template/policy/vsmart/definition/{policyId}` | getTemplateByPolicyId | Configuration - vSmart Template Policy | read | Read (needs IDs) | path: policyId |
| GET | `/dataservice/template/policy/vsmart/definition/activateIds` | getActivatePolicyIds | Configuration - vSmart Template Policy | read | Verified live | 0 rows |
| GET | `/dataservice/template/policy/vsmart/qosmos_nbar_migration_warning` | QosmosNbarMigrationWarning | Configuration - vSmart Template Policy | read | Verified live | 0 rows |
| PUT | `/dataservice/dca/analytics` | createStats | Data Collection Agent | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/dca/analytics/all` | getAllStatsDataDCA | Data Collection Agent | read | Read (needs input) | query body |
| GET | `/dataservice/dca/cloudservices/accesstoken` | getAccessToken | Data Collection Agent | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/dca/cloudservices/accesstoken` | storeAccessToken | Data Collection Agent | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/dca/cloudservices/alarm` | generateAlarm | Data Collection Agent | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/dca/cloudservices/dcscapabilities` | getDcsCapabilities | Data Collection Agent | read | Verified live | object |
| GET | `/dataservice/dca/cloudservices/idtoken` | getIdToken | Data Collection Agent | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/dca/cloudservices/idtoken` | storeIdToken | Data Collection Agent | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/dca/cloudservices/telemetry` | getTelemetrySettings | Data Collection Agent | read | Verified live | object |
| POST | `/dataservice/dca/data/device/state/{state_data_type}` | generateDCADeviceStateData | Data Collection Agent | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/dca/data/device/statistics/{stats_data_type}` | generateDCADeviceStatisticsData | Data Collection Agent | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/dca/dcatenantowners` | getDCATenantOwners | Data Collection Agent | read | Verified live | object |
| POST | `/dataservice/dca/device` | listAllDevicesDCA | Data Collection Agent | read | Read (needs input) | query body |
| POST | `/dataservice/dca/device/crashlog/details` | getCrashLogs | Data Collection Agent | read | Read (needs input) | query body |
| GET | `/dataservice/dca/device/crashlog/synced` | getCrashLogsSynced | Data Collection Agent | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/dca/settings/configuration/{type}/dca` | getServicesConfigurationDCA | Data Collection Agent | read | Read (needs IDs) | path: type |
| POST | `/dataservice/dca/settings/configuration/{type}/dca` | createDCAAnalyticsDataFile | Data Collection Agent | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/dca/settings/configuration/cloudservices/dca` | getCloudServicesConfigurationDCA | Data Collection Agent | read (deprecated) | Verified live | object |
| POST | `/dataservice/dca/statistics/settings/status` | getStatsDBIndexStatus | Data Collection Agent | read | Read (needs input) | query body |
| POST | `/dataservice/dca/system/device` | getDevicesDetailsDCA | Data Collection Agent | read | Read (needs input) | query body |
| POST | `/dataservice/dca/template/device/config/attachedconfig` | getDCAAttachedConfigToDevice | Data Collection Agent | read (deprecated) | Read (needs input) | query body |
| POST | `/dataservice/dca/template/policy/definition/approute` | getTemplatePolicyDefinitionsDCA | Data Collection Agent | read (deprecated) | Read (needs input) | query body |
| POST | `/dataservice/dca/template/policy/list/vpn` | getVPNListsDCA | Data Collection Agent | read (deprecated) | Read (needs input) | query body |
| POST | `/dataservice/dca/template/policy/vedge` | getVedgeTemplateListDCA | Data Collection Agent | read (deprecated) | Read (needs input) | query body |
| POST | `/dataservice/dca/template/policy/vsmart` | getVsmartTemplateListDCA | Data Collection Agent | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/fedramp/dnssec/actions` | requesDNSSecActions | Deployment Mode | read (deprecated) | Read (needs input) | query: action |
| POST | `/dataservice/fedramp/dnssec/actions` | requestDNSSecActionsPost | Deployment Mode | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/fedramp/dnssec/config` | configureDNSSec | Deployment Mode | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/fedramp/dnssec/status` | getDNSSecStatus | Deployment Mode | read | Verified live | 1 rows |
| POST | `/dataservice/fedramp/status` | configFedrampMode | Deployment Mode | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/fedramp/wazuh/actions` | requestWazuhActions | Deployment Mode | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Input not recognized","code":"FEDRAMP003"}} |
| POST | `/dataservice/fedramp/wazuh/config` | configureWazuhClient | Deployment Mode | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/fedramp/wazuh/status` | getWazuhAgentStatus | Deployment Mode | read | Verified live | 1 rows |
| GET | `/dataservice/device/autonomousversion` | getAutonomousSoftwareVersion | developers | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/messaging/device/vmanage` | createDeviceVmanageConnectionList | Device - Messaging | read | Verified live | 1 rows |
| GET | `/dataservice/network/connectionssummary` | getVmanageControlStatus | Device - Network | read | Verified live | 3 rows |
| GET | `/dataservice/network/issues/rebootcount` | getRebootCount | Device - Network | read | Verified live | 1 rows |
| GET | `/dataservice/network/issues/summary` | getNetworkIssuesSummary | Device - Network | read | Verified live | 1 rows |
| GET | `/dataservice/network/status` | getNetworkStatusSummary | Device - Network | read | Verified live | 6 rows |
| POST | `/dataservice/device/file-based/data-collection/file-generation-status` | handleFileGenerationStatusResponseFromDevice | File based RealTime Data Collection - Device notification - File generation status | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/file-based/data-collection/download/{requestUUID}` | downloadGeneratedFile | File based RealTime Data Collection - Download Generated File | read | Read (needs IDs) | path: requestUUID |
| GET | `/dataservice/device/file-based/data-collection/status/{requestUUID}` | getDataCollectionStatusForUUID | File based RealTime Data Collection - Get Data Collection status for a Request UUID | read | Read (needs IDs) | path: requestUUID |
| GET | `/dataservice/device/file-based/data-collection/all-statuses/{deviceUUID}` | getDataCollectionStatusForDevice | File based RealTime Data Collection - Get Data Collection status for Device UUID | read | Read (needs IDs) | path: deviceUUID |
| GET | `/dataservice/device/file-based/data-collection/supported-commands/{deviceUUID}` | getSupportedCommandsList | File based RealTime Data Collection - Get Supported Commands List for a Device UUID | read | Read (needs IDs) | path: deviceUUID |
| POST | `/dataservice/device/file-based/data-collection/initiate-file-generation` | initiateFileGenerationRequestToDevice | File based RealTime Data Collection - Initiate File Generation | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/hsec/devices` | fetchDeviceDetails | HSEC | read | Verified live | object |
| GET | `/dataservice/hsec/devices/install` | InstallDeviceDetails | HSEC | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/hsec/download` | downloadSlacRequestFile | HSEC | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/hsec/fetchaccounts` | fetchSAVAAccounts | HSEC | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/hsec/fetchaccounts` | fetchAccounts_Hsec_1904 | HSEC | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/hsec/testbedMode` | testbedMode | HSEC | read | Verified live | object |
| GET | `/dataservice/idpcertificate` | getCertificateDetails | IDP Certificate Management | read | Verified live | object |
| GET | `/dataservice/idpcertificate/CSR` | getCSR_IdpCertificateManagement_1903 | IDP Certificate Management | read | Verified live | object |
| POST | `/dataservice/idpcertificate/CSR` | genCSR | IDP Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/idpcertificate/CSR` | renewCSR | IDP Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/idpcertificate/renew` | renewIDPCertificate | IDP Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/idpcertificate/signed` | importIDPCertificate | IDP Certificate Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/signature-set/{signatureSetId}/rule/{ruleId}/comment` | getCommentOnRule | IPS Signature - Comment | read | Read (needs IDs) | path: signatureSetId, ruleId |
| POST | `/dataservice/signature-set/{signatureSetId}/rule/{ruleId}/comment` | createCommentOnRule | IPS Signature - Comment | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/signature-set/{signatureSetId}/rule/{ruleId}/comment/{commentId}` | deleteCommentOnRule | IPS Signature - Comment | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/signature-set/{signatureSetId}/rule/{ruleId}/comment/{commentId}` | updateCommentOnRule | IPS Signature - Comment | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/signature-set/{signatureSetId}/custom-rule` | createCustomSignature | IPS Signature - Custom Rule | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/signature-set/{signatureSetId}/custom-rule/{ruleId}` | updateCustomSignature | IPS Signature - Custom Rule | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/signature-set/{signatureSetId}/base/rule` | getAllBaseRules | IPS Signature - Rule | read | Read (needs IDs) | path: signatureSetId |
| GET | `/dataservice/signature-set/{signatureSetId}/metadata` | getRuleMetadata | IPS Signature - Rule | read | Read (needs IDs) | path: signatureSetId |
| GET | `/dataservice/signature-set/{signatureSetId}/overridden/rule` | getAllOverriddenRules | IPS Signature - Rule | read | Read (needs IDs) | path: signatureSetId |
| PUT | `/dataservice/signature-set/{signatureSetId}/rule/action` | editRuleAction | IPS Signature - Rule | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/signature-set/{signatureSetId}/{type}/rule-group` | getRuleGroup | IPS Signature - Rule Group | read | Read (needs IDs) | path: signatureSetId, type |
| PUT | `/dataservice/signature-set/{signatureSetId}/rule-group/security-level` | editRuleGroupSeclevel | IPS Signature - Rule Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/signature-set/rule-group` | getAllCustomRuleGroup | IPS Signature - Rule Group | read | Verified live | 0 rows |
| POST | `/dataservice/signature-set/rule-group` | createRuleGroup | IPS Signature - Rule Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/jobs/batch` | batchExecute | Jobs - Batch | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/app-registry/app/kubernetesapps` | getKubernetesServices | Kubernetes Services | read | Verified live | object |
| GET | `/dataservice/app-registry/clusters` | getKubernetesCluster | Kubernetes Services | read | Verified live | 0 rows |
| POST | `/dataservice/app-registry/clusters` | postCluster | Kubernetes Services | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/app-registry/clusters/{id}` | deleteKubernetesCluster | Kubernetes Services | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/app-registry/clusters/{id}` | editKubernetesCluster | Kubernetes Services | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/licensing/assign-licenses` | assignMSLALicenses | Licensing - Next Generation | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/licensing/devices` | getMSLADevices_LicensingNextGeneration_2103 | Licensing - Next Generation | read | Verified live | object |
| GET | `/dataservice/v1/licensing/edit-licenses/{uuid}` | getLicenseByUuid_LicensingNextGeneration_3403 | Licensing - Next Generation | read | Read (needs IDs) | path: uuid |
| POST | `/dataservice/v1/licensing/licenses` | getMSLALicenses | Licensing - Next Generation | read | Read (needs input) | query body |
| PUT | `/dataservice/v1/licensing/release-licenses` | releaseLicenses_LicensingNextGeneration_3003 | Licensing - Next Generation | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/licensing/sa-va-distribution` | getSAVADistribution | Licensing - Next Generation | read | Read (needs input) | query body |
| GET | `/dataservice/localization/supportedLocales` | getSupportedLocales | Locale | read | Verified live | object |
| GET | `/dataservice/management/category` | getCategory | Management | read | Verified live | object |
| GET | `/dataservice/management/vManageResourceUtilization` | getvManageResourceUtilization | Management | read | Verified live | object |
| POST | `/dataservice/onboard/delete-devices` | deleteDevices | Manual Onboard Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/onboard/details` | addDevices | Manual Onboard Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/onboard/devices` | getDevices_ManualOnboardDevice_1603 | Manual Onboard Device | read | Read (needs input) | query: status |
| POST | `/dataservice/onboard/devices` | manualOnboardDevices | Manual Onboard Device | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms` | getRawAlarmData | Monitoring - Alarms Details | read | Verified live | 0 rows |
| POST | `/dataservice/alarms` | postRawAlarmData | Monitoring - Alarms Details | read | Read (needs input) | query body |
| GET | `/dataservice/alarms/aggregation` | getAggregationData_MonitoringAlarmsDetails_1903 | Monitoring - Alarms Details | read | Read (needs input) | query: query |
| POST | `/dataservice/alarms/aggregation` | postAggregationData_MonitoringAlarmsDetails_1904 | Monitoring - Alarms Details | read | Read (needs input) | query body |
| POST | `/dataservice/alarms/clear` | clearStaleAlarm | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/count` | getNonViewedActiveAlarmsCount | Monitoring - Alarms Details | read | Verified live | 1 rows |
| POST | `/dataservice/alarms/count` | postCount | Monitoring - Alarms Details | read | Read (needs input) | query body |
| GET | `/dataservice/alarms/disabled` | listDisabledAlarm | Monitoring - Alarms Details | read | Verified live | 0 rows |
| POST | `/dataservice/alarms/disabled` | disableEnableAlarm | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/doccount` | getDocCount_MonitoringAlarmsDetails_1603 | Monitoring - Alarms Details | read | Read (needs input) | query: query |
| POST | `/dataservice/alarms/doccount` | postDocCount_MonitoringAlarmsDetails_1604 | Monitoring - Alarms Details | read | Verified live | object |
| POST | `/dataservice/alarms/dump` | dumpCorrelationEngineData | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/fields` | getAlarmDataFields | Monitoring - Alarms Details | read | Verified live | object |
| GET | `/dataservice/alarms/link-state-alarm` | getLinkStateAlarmConfig | Monitoring - Alarms Details | read | Verified live | object |
| POST | `/dataservice/alarms/link-state-alarm` | enableDisableLinkStateAlarm | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/alarms/markallasviewed` | markAllAlarmsAsViewed | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/alarms/markviewed` | markAlarmsAsViewed | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/master` | getLeaderManagerState | Monitoring - Alarms Details | read | Verified live | object |
| GET | `/dataservice/alarms/notviewed` | getNonViewedAlarms | Monitoring - Alarms Details | read | Verified live | 1000 rows |
| GET | `/dataservice/alarms/page` | getPage_MonitoringAlarmsDetails_1203 | Monitoring - Alarms Details | read | Verified live | 1 rows |
| POST | `/dataservice/alarms/page` | postPage_MonitoringAlarmsDetails_1204 | Monitoring - Alarms Details | read | Read (needs input) | query body |
| GET | `/dataservice/alarms/purgefrequency` | getPeriodicPurgeTimer | Monitoring - Alarms Details | read | Verified live | object |
| POST | `/dataservice/alarms/purgefrequency` | setPeriodicPurgeTimer | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/query/fields` | getAlarmQueryFields | Monitoring - Alarms Details | read | Verified live | 4 rows |
| GET | `/dataservice/alarms/query/input` | getFieldDetails | Monitoring - Alarms Details | read | Verified live | object |
| GET | `/dataservice/alarms/reset` | reset | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/restart` | restartCorrelationEngine | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/rulenamedisplay/keyvalue` | getAlarmTypesAsKeyValue | Monitoring - Alarms Details | read | Verified live | 187 rows |
| GET | `/dataservice/alarms/severity` | getBySeverity | Monitoring - Alarms Details | read | Read (needs input) | query: severity-level |
| GET | `/dataservice/alarms/severity/summary` | getAlarmSeverityCustomHistogram | Monitoring - Alarms Details | read | Read (needs input) | query: query |
| GET | `/dataservice/alarms/severitymappings` | getAlarmSeverityMappings | Monitoring - Alarms Details | read | Verified live | 5 rows |
| POST | `/dataservice/alarms/starttracking/{testName}` | startTracking | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/stats` | getStats | Monitoring - Alarms Details | read | Verified live | object |
| POST | `/dataservice/alarms/stoptracking/{testName}` | stopTracking | Monitoring - Alarms Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/alarms/topic` | getDeviceTopic | Monitoring - Alarms Details | read | Read (needs input) | query: ip |
| POST | `/dataservice/alarms/topn` | getTopN | Monitoring - Alarms Details | read | Read (needs input) | query body |
| GET | `/dataservice/alarms/uuid/{alarm_uuid}` | getAlarmDetails | Monitoring - Alarms Details | read | Read (needs IDs) | path: alarm_uuid |
| POST | `/dataservice/notifications/rule` | createNotificationRule | Monitoring - Alarms Notification | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/notifications/rule` | updateNotificationRule | Monitoring - Alarms Notification | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/notifications/rule/{type}` | createNotificationRuleByType | Monitoring - Alarms Notification | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/notifications/rule/{type}` | updateNotificationRuleByType | Monitoring - Alarms Notification | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/notifications/rules` | deleteNotificationRule | Monitoring - Alarms Notification | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/notifications/rules` | getNotificationRule | Monitoring - Alarms Notification | read | Verified live | 0 rows |
| GET | `/dataservice/statistics/apphosting` | getStatDataRawData_MonitoringAppHosting_2203 | Monitoring - App Hosting | read | Verified live | 4768 rows |
| POST | `/dataservice/statistics/apphosting` | getStatsRawData_MonitoringAppHosting_2204 | Monitoring - App Hosting | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/apphosting/aggregation` | getAggregationDataByQuery_MonitoringAppHosting_3403 | Monitoring - App Hosting | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/apphosting/aggregation` | getPostAggregationDataByQuery_MonitoringAppHosting_3404 | Monitoring - App Hosting | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/apphosting/csv` | getStatDataRawDataAsCSV_MonitoringAppHosting_2603 | Monitoring - App Hosting | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/apphosting/doccount` | getCount_MonitoringAppHosting_3103 | Monitoring - App Hosting | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/apphosting/doccount` | getCountPost_MonitoringAppHosting_3104 | Monitoring - App Hosting | read | Verified live | object |
| GET | `/dataservice/statistics/apphosting/fields` | getStatDataFields_MonitoringAppHosting_2903 | Monitoring - App Hosting | read | Verified live | object |
| GET | `/dataservice/statistics/apphosting/page` | getStatsPaginationRawData_MonitoringAppHosting_2703 | Monitoring - App Hosting | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/apphosting/page` | getPostStatsPaginationRawData_MonitoringAppHosting_2704 | Monitoring - App Hosting | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/apphosting/query/fields` | getStatQueryFields_MonitoringAppHosting_3503 | Monitoring - App Hosting | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/apphostinginterface` | getStatDataRawData_MonitoringAppHosting_3103 | Monitoring - App Hosting | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/apphostinginterface` | getStatsRawData_MonitoringAppHosting_3104 | Monitoring - App Hosting | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/apphostinginterface/aggregation` | getAggregationDataByQuery_MonitoringAppHosting_4303 | Monitoring - App Hosting | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/apphostinginterface/aggregation` | getPostAggregationDataByQuery_MonitoringAppHosting_4304 | Monitoring - App Hosting | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/apphostinginterface/csv` | getStatDataRawDataAsCSV_MonitoringAppHosting_3503 | Monitoring - App Hosting | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/apphostinginterface/doccount` | getCount_MonitoringAppHosting_4003 | Monitoring - App Hosting | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/apphostinginterface/doccount` | getCountPost_MonitoringAppHosting_4004 | Monitoring - App Hosting | read | Verified live | object |
| GET | `/dataservice/statistics/apphostinginterface/fields` | getStatDataFields_MonitoringAppHosting_3803 | Monitoring - App Hosting | read | Verified live | object |
| GET | `/dataservice/statistics/apphostinginterface/page` | getStatsPaginationRawData_MonitoringAppHosting_3603 | Monitoring - App Hosting | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/apphostinginterface/page` | getPostStatsPaginationRawData_MonitoringAppHosting_3604 | Monitoring - App Hosting | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/apphostinginterface/query/fields` | getStatQueryFields_MonitoringAppHosting_4403 | Monitoring - App Hosting | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/approute` | getStatDataRawData_MonitoringApplicationAwareRouting_2003 | Monitoring - Application Aware Routing | read | Verified live | 10000 rows |
| POST | `/dataservice/statistics/approute` | getStatsRawData_MonitoringApplicationAwareRouting_2004 | Monitoring - Application Aware Routing | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/approute/aggregation` | getAggregationDataByQuery_MonitoringApplicationAwareRouting_3203 | Monitoring - Application Aware Routing | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/approute/aggregation` | getPostAggregationDataByQuery_MonitoringApplicationAwareRouting_3204 | Monitoring - Application Aware Routing | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/approute/app-agg/aggregation` | getPostAggregationAppDataByQuery9 | Monitoring - Application Aware Routing | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/approute/csv` | getStatDataRawDataAsCSV_MonitoringApplicationAwareRouting_2403 | Monitoring - Application Aware Routing | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/approute/device/tunnel/summary` | getStatsAppRouteDeviceTunnelSummary | Monitoring - Application Aware Routing | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| GET | `/dataservice/statistics/approute/device/tunnels` | getStatsAppRouteDeviceTunnels | Monitoring - Application Aware Routing | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| GET | `/dataservice/statistics/approute/doccount` | getDocCount_MonitoringApplicationAwareRouting_2903 | Monitoring - Application Aware Routing | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/approute/doccount` | getDocCountPost | Monitoring - Application Aware Routing | read | Verified live | object |
| POST | `/dataservice/statistics/approute/fec/aggregation` | getAppRouteFecAgg | Monitoring - Application Aware Routing | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/approute/fields` | getStatDataFields_MonitoringApplicationAwareRouting_2703 | Monitoring - Application Aware Routing | read | Verified live | object |
| GET | `/dataservice/statistics/approute/page` | getStatBulkRawData_MonitoringApplicationAwareRouting_2503 | Monitoring - Application Aware Routing | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/approute/page` | getPostStatBulkRawData_MonitoringApplicationAwareRouting_2504 | Monitoring - Application Aware Routing | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/approute/query/fields` | getStatQueryFields_MonitoringApplicationAwareRouting_3303 | Monitoring - Application Aware Routing | read | Verified live | 2 rows |
| POST | `/dataservice/statistics/approute/tloc` | getApprouteTloc | Monitoring - Application Aware Routing | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/approute/transport/{type}` | getAppRouteTransportType | Monitoring - Application Aware Routing | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/approute/transport/summary/{type}` | getAppRouteTransportSummaryType | Monitoring - Application Aware Routing | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/approute/tunnel/{type}/summary` | getAppRouteTunnelSummaryType | Monitoring - Application Aware Routing | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/approute/tunnels/{type}` | getAppRouteTunnelType | Monitoring - Application Aware Routing | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/approute/tunnels/health/{type}` | getAppRouteTunnelHealth | Monitoring - Application Aware Routing | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/approute/tunnels/summary/{type}` | getAppRouteTunnelsSummaryType | Monitoring - Application Aware Routing | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/art` | getStatDataRawData_MonitoringArt_1503 | Monitoring - ART | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/art` | getStatsRawData_MonitoringArt_1504 | Monitoring - ART | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/art/aggregation` | getAggregationDataByQuery_MonitoringArt_2703 | Monitoring - ART | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/art/aggregation` | getPostAggregationDataByQuery_MonitoringArt_2704 | Monitoring - ART | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/art/csv` | getStatDataRawDataAsCSV_MonitoringArt_1903 | Monitoring - ART | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/art/doccount` | getCount_MonitoringArt_2403 | Monitoring - ART | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/art/doccount` | getCountPost_MonitoringArt_2404 | Monitoring - ART | read | Verified live | object |
| GET | `/dataservice/statistics/art/fields` | getStatDataFields_MonitoringArt_2203 | Monitoring - ART | read | Verified live | object |
| GET | `/dataservice/statistics/art/page` | getStatsPaginationRawData_MonitoringArt_2003 | Monitoring - ART | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/art/page` | getPostStatsPaginationRawData_MonitoringArt_2004 | Monitoring - ART | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/art/query/fields` | getStatQueryFields_MonitoringArt_2803 | Monitoring - ART | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/bfd` | getStatDataRawData_MonitoringBfd_1503 | Monitoring - BFD | read (deprecated) | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| POST | `/dataservice/statistics/bfd` | getStatsRawData_MonitoringBfd_1504 | Monitoring - BFD | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/bfd/aggregation` | getAggregationDataByQuery_MonitoringBfd_2703 | Monitoring - BFD | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/bfd/aggregation` | getPostAggregationDataByQuery_MonitoringBfd_2704 | Monitoring - BFD | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/bfd/csv` | getStatDataRawDataAsCSV_MonitoringBfd_1903 | Monitoring - BFD | read (deprecated) | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/bfd/doccount` | getCount_MonitoringBfd_2403 | Monitoring - BFD | read (deprecated) | Read (needs input) | query: query |
| POST | `/dataservice/statistics/bfd/doccount` | getCountPost_MonitoringBfd_2404 | Monitoring - BFD | read (deprecated) | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| GET | `/dataservice/statistics/bfd/fields` | getStatDataFields_MonitoringBfd_2203 | Monitoring - BFD | read (deprecated) | Verified live | object |
| GET | `/dataservice/statistics/bfd/page` | getStatsPaginationRawData_MonitoringBfd_2003 | Monitoring - BFD | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/bfd/page` | getPostStatsPaginationRawData_MonitoringBfd_2004 | Monitoring - BFD | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/bfd/query/fields` | getStatQueryFields_MonitoringBfd_2803 | Monitoring - BFD | read (deprecated) | Verified live | 1 rows |
| GET | `/dataservice/device/bootup/time` | getBootUpTime | Monitoring - BootUp Time | read | Verified live | 15 rows |
| GET | `/dataservice/statistics/bridgeinterface` | getStatDataRawData_MonitoringBridge_2703 | Monitoring - Bridge | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/bridgeinterface` | getStatsRawData_MonitoringBridge_2704 | Monitoring - Bridge | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/bridgeinterface/aggregation` | getAggregationDataByQuery_MonitoringBridge_3903 | Monitoring - Bridge | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/bridgeinterface/aggregation` | getPostAggregationDataByQuery_MonitoringBridge_3904 | Monitoring - Bridge | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/bridgeinterface/csv` | getStatDataRawDataAsCSV_MonitoringBridge_3103 | Monitoring - Bridge | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/bridgeinterface/doccount` | getCount_MonitoringBridge_3603 | Monitoring - Bridge | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/bridgeinterface/doccount` | getCountPost_MonitoringBridge_3604 | Monitoring - Bridge | read | Verified live | object |
| GET | `/dataservice/statistics/bridgeinterface/fields` | getStatDataFields_MonitoringBridge_3403 | Monitoring - Bridge | read | Verified live | object |
| GET | `/dataservice/statistics/bridgeinterface/page` | getStatsPaginationRawData_MonitoringBridge_3203 | Monitoring - Bridge | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/bridgeinterface/page` | getPostStatsPaginationRawData_MonitoringBridge_3204 | Monitoring - Bridge | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/bridgeinterface/query/fields` | getStatQueryFields_MonitoringBridge_4003 | Monitoring - Bridge | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/bridgemac` | getStatDataRawData_MonitoringBridge_2103 | Monitoring - Bridge | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/bridgemac` | getStatsRawData_MonitoringBridge_2104 | Monitoring - Bridge | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/bridgemac/aggregation` | getAggregationDataByQuery_MonitoringBridge_3303 | Monitoring - Bridge | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/bridgemac/aggregation` | getPostAggregationDataByQuery_MonitoringBridge_3304 | Monitoring - Bridge | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/bridgemac/csv` | getStatDataRawDataAsCSV_MonitoringBridge_2503 | Monitoring - Bridge | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/bridgemac/doccount` | getCount_MonitoringBridge_3003 | Monitoring - Bridge | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/bridgemac/doccount` | getCountPost_MonitoringBridge_3004 | Monitoring - Bridge | read | Verified live | object |
| GET | `/dataservice/statistics/bridgemac/fields` | getStatDataFields_MonitoringBridge_2803 | Monitoring - Bridge | read | Verified live | object |
| GET | `/dataservice/statistics/bridgemac/page` | getStatsPaginationRawData_MonitoringBridge_2603 | Monitoring - Bridge | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/bridgemac/page` | getPostStatsPaginationRawData_MonitoringBridge_2604 | Monitoring - Bridge | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/bridgemac/query/fields` | getStatQueryFields_MonitoringBridge_3403 | Monitoring - Bridge | read | Verified live | 1 rows |
| GET | `/dataservice/device/cdp/neighbors` | getCdpNeighbors | Monitoring - CDP | read | Verified live | 13 rows |
| POST | `/dataservice/device/cdp/neighbors` | postCdpNeighbors | Monitoring - CDP | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/cedgecflowd/app-fwd-cflowd-flows` | createAppFwdCflowdFlowsList | Monitoring - Cedge Cflowd | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/device/cedgecflowd/app-fwd-cflowd-v6-flows` | createAppFwdCflowdV6FlowsList | Monitoring - Cedge Cflowd | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/device/redundancy-group/app-group` | getRedundancyGroupAppGroup | Monitoring - Cedge Cflowd | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/statistics/eiolte` | getStatDataRawData_MonitoringCellularEiolte_1803 | Monitoring - Cellular-EIOLTE | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/eiolte` | getStatsRawData_MonitoringCellularEiolte_1804 | Monitoring - Cellular-EIOLTE | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/eiolte/aggregation` | getAggregationDataByQuery_MonitoringCellularEiolte_3003 | Monitoring - Cellular-EIOLTE | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/eiolte/aggregation` | getPostAggregationDataByQuery_MonitoringCellularEiolte_3004 | Monitoring - Cellular-EIOLTE | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/eiolte/cellularAggregation` | cellularAggregation | Monitoring - Cellular-EIOLTE | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/eiolte/csv` | getStatDataRawDataAsCSV_MonitoringCellularEiolte_2203 | Monitoring - Cellular-EIOLTE | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/eiolte/doccount` | getCount_MonitoringCellularEiolte_2703 | Monitoring - Cellular-EIOLTE | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/eiolte/doccount` | getCountPost_MonitoringCellularEiolte_2704 | Monitoring - Cellular-EIOLTE | read | Verified live | object |
| GET | `/dataservice/statistics/eiolte/fields` | getStatDataFields_MonitoringCellularEiolte_2503 | Monitoring - Cellular-EIOLTE | read | Verified live | object |
| GET | `/dataservice/statistics/eiolte/page` | getStatsPaginationRawData_MonitoringCellularEiolte_2303 | Monitoring - Cellular-EIOLTE | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/eiolte/page` | getPostStatsPaginationRawData_MonitoringCellularEiolte_2304 | Monitoring - Cellular-EIOLTE | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/eiolte/query/fields` | getStatQueryFields_MonitoringCellularEiolte_3103 | Monitoring - Cellular-EIOLTE | read | Verified live | 1 rows |
| POST | `/dataservice/statistics/eiolte/uniqueAggregation` | uniqueAggregation | Monitoring - Cellular-EIOLTE | read | Read (needs input) | query body |
| GET | `/dataservice/device/cflowd/application/fields` | getCflowdDPIDeviceFieldJSON | Monitoring - Cflowd | read | Verified live | 2 rows |
| GET | `/dataservice/device/cflowd/collector` | createCflowdCollectorList | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cflowd/device/fields` | getCflowdDPIFieldJSON | Monitoring - Cflowd | read | Verified live | 3 rows |
| GET | `/dataservice/device/cflowd/flows` | createCflowCollectorList | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cflowd/flows-count` | createCflowdFlowsCountList | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cflowd/fnf/cache-stats` | getFnFCacheStats | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/cflowd/fnf/export-client-stats` | getFnFExportClientStats | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 56 rows |
| GET | `/dataservice/device/cflowd/fnf/export-stats` | getFnFExportStats | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 5 rows |
| GET | `/dataservice/device/cflowd/fnf/flow-monitor` | getFnf | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cflowd/fnf/monitor-stats` | getFnFMonitorStats | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 5 rows |
| GET | `/dataservice/device/cflowd/statistics` | createCflowdStatistics | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cflowd/template` | createCflowdTemplate | Monitoring - Cflowd | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/statistics/cflowd` | getStatDataRawData_MonitoringCflowd_1803 | Monitoring - Cflowd | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"cFlowd is not supported. Please use DPI data  |
| POST | `/dataservice/statistics/cflowd` | getStatsRawData_MonitoringCflowd_1804 | Monitoring - Cflowd | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/cflowd/aggregation` | getAggregationDataByQuery_MonitoringCflowd_3003 | Monitoring - Cflowd | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"cFlowd is not supported. Please use DPI data  |
| POST | `/dataservice/statistics/cflowd/aggregation` | getPostAggregationDataByQuery_MonitoringCflowd_3004 | Monitoring - Cflowd | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/cflowd/csv` | getStatDataRawDataAsCSV_MonitoringCflowd_2203 | Monitoring - Cflowd | read (deprecated) | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/cflowd/doccount` | getCount_MonitoringCflowd_2703 | Monitoring - Cflowd | read (deprecated) | Read (needs input) | query: query |
| POST | `/dataservice/statistics/cflowd/doccount` | getCountPost_MonitoringCflowd_2704 | Monitoring - Cflowd | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"cFlowd is not supported. Please use DPI data  |
| GET | `/dataservice/statistics/cflowd/fields` | getStatDataFields_MonitoringCflowd_2503 | Monitoring - Cflowd | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"cFlowd is not supported. Please use DPI data  |
| GET | `/dataservice/statistics/cflowd/page` | getStatsPaginationRawData_MonitoringCflowd_2303 | Monitoring - Cflowd | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"cFlowd is not supported. Please use DPI data  |
| POST | `/dataservice/statistics/cflowd/page` | getPostStatsPaginationRawData_MonitoringCflowd_2304 | Monitoring - Cflowd | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/cflowd/query/fields` | getStatQueryFields_MonitoringCflowd_3103 | Monitoring - Cflowd | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"cFlowd is not supported. Please use DPI data  |
| GET | `/dataservice/statistics/cloudx` | getStatDataRawData_MonitoringCloudexpress_1803 | Monitoring - CloudExpress | read | Verified live | 10000 rows |
| POST | `/dataservice/statistics/cloudx` | getStatsRawData_MonitoringCloudexpress_1804 | Monitoring - CloudExpress | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/cloudx/aggregation` | getAggregationDataByQuery_MonitoringCloudexpress_3003 | Monitoring - CloudExpress | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/cloudx/aggregation` | getPostAggregationDataByQuery_MonitoringCloudexpress_3004 | Monitoring - CloudExpress | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/cloudx/csv` | getStatDataRawDataAsCSV_MonitoringCloudexpress_2203 | Monitoring - CloudExpress | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/cloudx/doccount` | getCount_MonitoringCloudexpress_2703 | Monitoring - CloudExpress | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/cloudx/doccount` | getCountPost_MonitoringCloudexpress_2704 | Monitoring - CloudExpress | read | Verified live | object |
| GET | `/dataservice/statistics/cloudx/fields` | getStatDataFields_MonitoringCloudexpress_2503 | Monitoring - CloudExpress | read | Verified live | object |
| GET | `/dataservice/statistics/cloudx/page` | getStatsPaginationRawData_MonitoringCloudexpress_2303 | Monitoring - CloudExpress | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/cloudx/page` | getPostStatsPaginationRawData_MonitoringCloudexpress_2304 | Monitoring - CloudExpress | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/cloudx/query/fields` | getStatQueryFields_MonitoringCloudexpress_3103 | Monitoring - CloudExpress | read | Verified live | 1 rows |
| POST | `/dataservice/statistics/cryptovpn/common` | getPostCryptoDataByQuery | Monitoring - Crypto VPN | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/cryptovpn/dmvpn` | getPostCryptoDMVPNDataByQuery | Monitoring - Crypto VPN | read | Read (needs input) | query body |
| GET | `/dataservice/advisories/insecure-config/devices` | getDeviceAdvisories | Monitoring - Device Configuration Security Advisories | read | Verified live | object |
| GET | `/dataservice/advisories/insecure-config/devices/{deviceIP}` | getDeviceInsecureConfig | Monitoring - Device Configuration Security Advisories | read | Read (needs IDs) | path: deviceIP |
| GET | `/dataservice/advisories/insecure-config/summary` | getAdvisoriesSummary | Monitoring - Device Configuration Security Advisories | read | Verified live | object |
| GET | `/dataservice/data/device/state/{state_data_type}` | generateDeviceStateData | Monitoring - Device Details | read | Read (needs IDs) | path: state_data_type |
| GET | `/dataservice/data/device/state/{state_data_type}/fields` | generateDeviceStateDataFields | Monitoring - Device Details | read | Read (needs IDs) | path: state_data_type |
| GET | `/dataservice/data/device/state/{state_data_type}/query` | generateDeviceStateDataWithQueryString | Monitoring - Device Details | read | Read (needs IDs) | path: state_data_type |
| GET | `/dataservice/device` | listAllDevices | Monitoring - Device Details | read | Verified live | 17 rows |
| POST | `/dataservice/device/blockSync` | setBlockSync | Monitoring - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/config` | getDeviceRunningConfig | Monitoring - Device Details | read | Verified live | deviceId=<edge>:  system  gps-locatio |
| GET | `/dataservice/device/config/html` | getDeviceRunningConfigHTML | Monitoring - Device Details | read (deprecated) | Verified live | deviceId=<edge>: <html><body><h4>Devi |
| GET | `/dataservice/device/counters` | getDeviceCounters | Monitoring - Device Details | read | Verified live | 17 rows |
| GET | `/dataservice/device/devicestatus` | getDeviceOnlyStatus | Monitoring - Device Details | read | Verified live | 3 rows |
| POST | `/dataservice/device/enableSDAVC/{deviceIP}/{enable}` | enableSDAVCOnDevice | Monitoring - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/featuresupport` | getDeviceFeatureSupport | Monitoring - Device Details | read | Verified live | object |
| GET | `/dataservice/device/hardwarehealth/detail` | getHardwareHealthDetails | Monitoring - Device Details | read | Verified live | 13 rows |
| GET | `/dataservice/device/hardwarehealth/summary` | getHardwareHealthSummary | Monitoring - Device Details | read | Read (needs input) | query: vpnId |
| GET | `/dataservice/device/keyvalue` | getDeviceListAsKeyValue | Monitoring - Device Details | read | Verified live | 17 rows |
| GET | `/dataservice/device/models` | listAllDeviceModels | Monitoring - Device Details | read | Verified live | 326 rows |
| GET | `/dataservice/device/models/{uuid}` | getDeviceModels | Monitoring - Device Details | read | Read (needs IDs) | path: uuid |
| GET | `/dataservice/device/monitor` | listAllMonitorDetailsDevices | Monitoring - Device Details | read | Verified live | 17 rows |
| GET | `/dataservice/device/queues` | getSyncQueues | Monitoring - Device Details | read | Verified live | object |
| GET | `/dataservice/device/reachable` | listReachableDevices | Monitoring - Device Details | read | Verified live | 0 rows |
| GET | `/dataservice/device/stats` | getStatsQueues | Monitoring - Device Details | read | Verified live | object |
| GET | `/dataservice/device/status` | getAllDeviceStatus | Monitoring - Device Details | read | Verified live | 6 rows |
| GET | `/dataservice/device/sync_status` | listCurrentlySyncingDevices | Monitoring - Device Details | read | Verified live | 17 rows |
| POST | `/dataservice/device/syncall/memorydb` | syncAllDevicesMemDB | Monitoring - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/tier` | getTiers | Monitoring - Device Details | read | Verified live | 0 rows |
| POST | `/dataservice/device/tier` | addTier | Monitoring - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/tier/{tierName}` | deleteTier | Monitoring - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/tloc` | getDeviceTlocStatus | Monitoring - Device Details | read | Verified live | 35 rows |
| GET | `/dataservice/device/tlocutil` | getDeviceTlocUtil | Monitoring - Device Details | read | Verified live | 4 rows |
| GET | `/dataservice/device/tlocutil/detail` | getDeviceTlocUtilDetails | Monitoring - Device Details | read | Verified live | 0 rows |
| GET | `/dataservice/device/unconfigured` | getUnconfigured | Monitoring - Device Details | read | Verified live | object |
| GET | `/dataservice/device/unreachable` | listUnreachableDevices | Monitoring - Device Details | read | Read (needs input) | query: personality |
| DELETE | `/dataservice/device/unreachable/{deviceIP}` | removeUnreachableDevice | Monitoring - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/vedgeinventory/detail` | getVedgeInventory | Monitoring - Device Details | read | Verified live | 47 rows |
| GET | `/dataservice/device/vedgeinventory/summary` | getVedgeInventorySummary | Monitoring - Device Details | read | Verified live | 4 rows |
| GET | `/dataservice/device/vmanage` | getVManageSystemIP | Monitoring - Device Details | read | Verified live | object |
| POST | `/dataservice/v1/device/analyzeCliConfig` | analyzeCliConfig | Monitoring - Device Details | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/device/runningIosCliConfig/{deviceUUID}` | getRunningIosCliConfig | Monitoring - Device Details | read | Read (needs IDs) | path: deviceUUID |
| GET | `/dataservice/v1/device/unsupportedCliConfig/{deviceUUID}` | getUnsupportedCliConfig | Monitoring - Device Details | read | Read (needs IDs) | path: deviceUUID |
| GET | `/dataservice/statistics/devicehealth/history` | getDeviceHealthHistory | Monitoring - Device Health | read | Verified live | object |
| GET | `/dataservice/statistics/devicehealth/overview/{type}` | getDeviceHealthOverview | Monitoring - Device Health | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/device` | getStatDataRawData_MonitoringDeviceStatistics_1803 | Monitoring - Device Statistics | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"Device stats is not supported. Please use dev |
| POST | `/dataservice/statistics/device` | getStatsRawData_MonitoringDeviceStatistics_1804 | Monitoring - Device Statistics | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/device/aggregation` | getAggregationDataByQuery_MonitoringDeviceStatistics_3003 | Monitoring - Device Statistics | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"Device stats is not supported. Please use dev |
| POST | `/dataservice/statistics/device/aggregation` | getPostAggregationDataByQuery_MonitoringDeviceStatistics_3004 | Monitoring - Device Statistics | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/device/csv` | getStatDataRawDataAsCSV_MonitoringDeviceStatistics_2203 | Monitoring - Device Statistics | read (deprecated) | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/device/doccount` | getCount_MonitoringDeviceStatistics_2703 | Monitoring - Device Statistics | read (deprecated) | Read (needs input) | query: query |
| POST | `/dataservice/statistics/device/doccount` | getCountPost_MonitoringDeviceStatistics_2704 | Monitoring - Device Statistics | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"Device stats is not supported. Please use dev |
| GET | `/dataservice/statistics/device/fields` | getStatDataFields_MonitoringDeviceStatistics_2503 | Monitoring - Device Statistics | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"Device stats is not supported. Please use dev |
| GET | `/dataservice/statistics/device/page` | getStatsPaginationRawData_MonitoringDeviceStatistics_2303 | Monitoring - Device Statistics | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"Device stats is not supported. Please use dev |
| POST | `/dataservice/statistics/device/page` | getPostStatsPaginationRawData_MonitoringDeviceStatistics_2304 | Monitoring - Device Statistics | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/device/query/fields` | getStatQueryFields_MonitoringDeviceStatistics_3103 | Monitoring - Device Statistics | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"Device stats is not supported. Please use dev |
| GET | `/dataservice/data/device/statistics` | getStatisticsType | Monitoring - Device Statistics Details | read | Verified live | object |
| GET | `/dataservice/data/device/statistics/{state_data_type}` | generateDeviceStatisticsData | Monitoring - Device Statistics Details | read | Read (needs IDs) | path: state_data_type |
| GET | `/dataservice/data/device/statistics/{state_data_type}/doccount` | getCountWithStateDataType | Monitoring - Device Statistics Details | read | Read (needs IDs) | path: state_data_type |
| GET | `/dataservice/data/device/statistics/{state_data_type}/fields` | getStatDataFieldsByStateDataType | Monitoring - Device Statistics Details | read | Read (needs IDs) | path: state_data_type |
| GET | `/dataservice/data/device/statistics/alarm/active` | getActiveAlarms | Monitoring - Device Statistics Details | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid parameter.","code":"DEVICESTAT0002","details":"Start date or end date cannot be empty.", |
| GET | `/dataservice/v2/data/device/statistics/interfacestatistics` | generateDeviceInterfaceStatisticsData | Monitoring - Device Statistics Details V2 | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Illegal request. Please check the parameter name/value","code":"BAD_REQUEST","details":"startDat |
| GET | `/dataservice/v2/data/device/statistics/interfacestatistics/doccount` | getCountWithInterfaceStatistics | Monitoring - Device Statistics Details V2 | read | Read (needs input) | query: startDate |
| GET | `/dataservice/v2/data/device/statistics/interfacestatistics/fields` | getStatDataFieldsByInterfaceStatistics | Monitoring - Device Statistics Details V2 | read | Verified live | object |
| GET | `/dataservice/statistics/dpi` | getDPIStatsRawData | Monitoring - DPI | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/dpi` | getDPIStatsRawDataPost | Monitoring - DPI | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/dpi/agg-app/aggregation` | getAggAppDataPost | Monitoring - DPI | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/dpi/aggregation` | getDPIStatsAggregationData | Monitoring - DPI | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/dpi/aggregation` | getDPIStatsAggregationDataPost | Monitoring - DPI | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/dpi/applications` | getAggAppFlows | Monitoring - DPI | read | Read (needs input) | query: query |
| GET | `/dataservice/statistics/dpi/applications/summary` | getAggAppFlowsSummary | Monitoring - DPI | read | Read (needs input) | query: query |
| GET | `/dataservice/statistics/dpi/csv` | getDPIStatsRawDataAsCSV | Monitoring - DPI | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/dpi/device/application/flowcount` | getDPIDeviceAppUniqueFlowCount | Monitoring - DPI | read | Read (needs input) | query: interval |
| GET | `/dataservice/statistics/dpi/device/applications` | getDPIDeviceAppAggregationData | Monitoring - DPI | read | Read (needs input) | query: query |
| GET | `/dataservice/statistics/dpi/device/details/applications` | getDPIDeviceAppDetails | Monitoring - DPI | read | Read (needs input) | query: query |
| GET | `/dataservice/statistics/dpi/doccount` | getDPIStatsCount | Monitoring - DPI | read | Verified live | object |
| POST | `/dataservice/statistics/dpi/doccount` | getDPIStatsCountPost | Monitoring - DPI | read | Verified live | object |
| GET | `/dataservice/statistics/dpi/fields` | getDPIFields | Monitoring - DPI | read | Verified live | object |
| GET | `/dataservice/statistics/dpi/page` | getDPIStatsPaginationRawData | Monitoring - DPI | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/dpi/page` | getDPIStatsPaginationRawDataPost | Monitoring - DPI | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/dpi/pktdup/aggregation` | getDPIStatsAggregationDataForPacketDup | Monitoring - DPI | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/dpi/query/fields` | getDPIQueryFields | Monitoring - DPI | read | Verified live | object |
| POST | `/dataservice/statistics/dpi/recovery/aggregation` | getDPIStatsAggregationDataForFec | Monitoring - DPI | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/on-demand/queue` | getQueueEntries | Monitoring - DPI - On-demand troubleshooting | read | Verified live | object |
| POST | `/dataservice/statistics/on-demand/queue` | createQueueEntry | Monitoring - DPI - On-demand troubleshooting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/statistics/on-demand/queue/{entryId}` | deleteQueueEntry | Monitoring - DPI - On-demand troubleshooting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/statistics/on-demand/queue/{entryId}` | updateQueueEntry | Monitoring - DPI - On-demand troubleshooting | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/statistics/on-demand/queue/properties` | getQueueProperties | Monitoring - DPI - On-demand troubleshooting | read | Verified live | object |
| GET | `/dataservice/statistics/endpointTracker` | getStatDataRawData_MonitoringEndpointTrackerStatus_2703 | Monitoring - Endpoint Tracker Status | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/endpointTracker` | getStatsRawData_MonitoringEndpointTrackerStatus_2704 | Monitoring - Endpoint Tracker Status | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/endpointTracker/aggregation` | getAggregationDataByQuery_MonitoringEndpointTrackerStatus_3903 | Monitoring - Endpoint Tracker Status | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/endpointTracker/aggregation` | getPostAggregationDataByQuery_MonitoringEndpointTrackerStatus_3904 | Monitoring - Endpoint Tracker Status | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/endpointTracker/csv` | getStatDataRawDataAsCSV_MonitoringEndpointTrackerStatus_3103 | Monitoring - Endpoint Tracker Status | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/endpointTracker/doccount` | getCount_MonitoringEndpointTrackerStatus_3603 | Monitoring - Endpoint Tracker Status | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/endpointTracker/doccount` | getCountPost_MonitoringEndpointTrackerStatus_3604 | Monitoring - Endpoint Tracker Status | read | Verified live | object |
| GET | `/dataservice/statistics/endpointTracker/fields` | getStatDataFields_MonitoringEndpointTrackerStatus_3403 | Monitoring - Endpoint Tracker Status | read | Verified live | object |
| GET | `/dataservice/statistics/endpointTracker/page` | getStatsPaginationRawData_MonitoringEndpointTrackerStatus_3203 | Monitoring - Endpoint Tracker Status | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/endpointTracker/page` | getPostStatsPaginationRawData_MonitoringEndpointTrackerStatus_3204 | Monitoring - Endpoint Tracker Status | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/endpointTracker/query/fields` | getStatQueryFields_MonitoringEndpointTrackerStatus_4003 | Monitoring - Endpoint Tracker Status | read | Verified live | 2 rows |
| GET | `/dataservice/event` | getEvents_MonitoringEvents_603 | Monitoring - Events | read | Verified live | 10000 rows |
| POST | `/dataservice/event` | postEvents | Monitoring - Events | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/event/aggregation` | getAggregationData_MonitoringEvents_1803 | Monitoring - Events | read | Read (needs input) | query: query |
| POST | `/dataservice/event/aggregation` | postAggregationData_MonitoringEvents_1804 | Monitoring - Events | read | Read (needs input) | query body |
| POST | `/dataservice/event/byuuids` | getByUuids | Monitoring - Events | read | Read (needs input) | query body |
| GET | `/dataservice/event/component/keyvalue` | getComponentsAsKeyValue | Monitoring - Events | read | Verified live | 25 rows |
| GET | `/dataservice/event/doccount` | getDocCount_MonitoringEvents_1503 | Monitoring - Events | read | Read (needs input) | query: query |
| POST | `/dataservice/event/doccount` | postDocCount_MonitoringEvents_1504 | Monitoring - Events | read | Verified live | object |
| GET | `/dataservice/event/enable/fileprocess` | enableEventsFromFile | Monitoring - Events | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/event/getEventsByComponent` | getEventNamesByComponent | Monitoring - Events | read | Read (needs input) | query: query |
| GET | `/dataservice/event/listeners` | getListenersInfo | Monitoring - Events | read | Verified live | 17 rows |
| GET | `/dataservice/event/page` | getPage_MonitoringEvents_1103 | Monitoring - Events | read | Verified live | 1 rows |
| POST | `/dataservice/event/page` | postPage_MonitoringEvents_1104 | Monitoring - Events | read | Read (needs input) | query body |
| GET | `/dataservice/event/query/fields` | getQueryFields | Monitoring - Events | read | Verified live | 5 rows |
| GET | `/dataservice/event/query/input` | createEventsQueryConfig | Monitoring - Events | read | Verified live | object |
| GET | `/dataservice/event/severity` | getBySeverities | Monitoring - Events | read | Read (needs input) | query: severity-level |
| GET | `/dataservice/event/severity/summary` | getSeverityHistogram | Monitoring - Events | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/event/types/keyvalue` | getEventTypesAsKeyValue | Monitoring - Events | read | Verified live | 273 rows |
| GET | `/dataservice/statistics/flowlog` | getStatDataRawData_MonitoringFlowlog_1903 | Monitoring - Flowlog | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/flowlog` | getStatDataRawDataPost | Monitoring - Flowlog | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/flowlog/aggregation` | getAggregationDataByQuery_MonitoringFlowlog_3103 | Monitoring - Flowlog | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/flowlog/aggregation` | getPostAggregationDataByQuery_MonitoringFlowlog_3104 | Monitoring - Flowlog | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/flowlog/csv` | getStatDataRawDataAsCSV_MonitoringFlowlog_2303 | Monitoring - Flowlog | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/flowlog/doccount` | getFlowlogCount | Monitoring - Flowlog | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/flowlog/doccount` | getFlowlogCountPost | Monitoring - Flowlog | read | Verified live | object |
| GET | `/dataservice/statistics/flowlog/fields` | getFlowlogFields | Monitoring - Flowlog | read | Verified live | object |
| GET | `/dataservice/statistics/flowlog/page` | getStatsPaginationRawData_MonitoringFlowlog_2403 | Monitoring - Flowlog | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/flowlog/page` | getStatsPaginationRawDataPost | Monitoring - Flowlog | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/flowlog/query/fields` | getFlowlogQueryFields | Monitoring - Flowlog | read | Verified live | 2 rows |
| GET | `/dataservice/health/devices` | getDevicesHealth | Monitoring - Health | read | Verified live | object |
| GET | `/dataservice/health/devices/overview` | getDevicesHealthOverview | Monitoring - Health | read | Verified live | object |
| GET | `/dataservice/statistics/interface` | getStatDataRawData_MonitoringInterfaceStatistics_2103 | Monitoring - Interface Statistics | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/interface` | getStatsRawData_MonitoringInterfaceStatistics_2104 | Monitoring - Interface Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/interface/aggregation` | getAggregationDataByQuery_MonitoringInterfaceStatistics_3303 | Monitoring - Interface Statistics | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/interface/aggregation` | getPostAggregationDataByQuery_MonitoringInterfaceStatistics_3304 | Monitoring - Interface Statistics | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/interface/app-agg/aggregation` | getPostAggregationAppDataByQuery_MonitoringInterfaceStatistics_4104 | Monitoring - Interface Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/interface/ccapacity/distribution` | getBandwidthDistribution | Monitoring - Interface Statistics | read | Verified live | 34 rows |
| GET | `/dataservice/statistics/interface/csv` | getStatDataRawDataAsCSV_MonitoringInterfaceStatistics_2503 | Monitoring - Interface Statistics | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/interface/doccount` | getCount10 | Monitoring - Interface Statistics | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/interface/doccount` | getCountPost_MonitoringInterfaceStatistics_3004 | Monitoring - Interface Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/interface/fields` | getStatDataFields_MonitoringInterfaceStatistics_2803 | Monitoring - Interface Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/interface/page` | getStatBulkRawData_MonitoringInterfaceStatistics_2603 | Monitoring - Interface Statistics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/interface/page` | getPostStatBulkRawData_MonitoringInterfaceStatistics_2604 | Monitoring - Interface Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/interface/query/fields` | getStatQueryFields_MonitoringInterfaceStatistics_3403 | Monitoring - Interface Statistics | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/interface/type` | getStatisticsPerInterface | Monitoring - Interface Statistics | read | Read (needs input) | query: query |
| GET | `/dataservice/statistics/ipsalert` | getStatDataRawData_MonitoringIpsalert_2003 | Monitoring - IPsAlert | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/ipsalert` | getStatsRawData_MonitoringIpsalert_2004 | Monitoring - IPsAlert | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ipsalert/aggregation` | getAggregationDataByQuery_MonitoringIpsalert_3203 | Monitoring - IPsAlert | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/ipsalert/aggregation` | getPostAggregationDataByQuery_MonitoringIpsalert_3204 | Monitoring - IPsAlert | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ipsalert/csv` | getStatDataRawDataAsCSV_MonitoringIpsalert_2403 | Monitoring - IPsAlert | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/ipsalert/doccount` | getCount_MonitoringIpsalert_2903 | Monitoring - IPsAlert | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/ipsalert/doccount` | getCountPost_MonitoringIpsalert_2904 | Monitoring - IPsAlert | read | Verified live | object |
| GET | `/dataservice/statistics/ipsalert/fields` | getStatDataFields_MonitoringIpsalert_2703 | Monitoring - IPsAlert | read | Verified live | object |
| GET | `/dataservice/statistics/ipsalert/page` | getStatsPaginationRawData_MonitoringIpsalert_2503 | Monitoring - IPsAlert | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/ipsalert/page` | getPostStatsPaginationRawData_MonitoringIpsalert_2504 | Monitoring - IPsAlert | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ipsalert/query/fields` | getStatQueryFields_MonitoringIpsalert_3303 | Monitoring - IPsAlert | read | Verified live | 1 rows |
| GET | `/dataservice/device/lldp/neighbors` | getLldpNeighbors | Monitoring - LLDP | read | Verified live | 13 rows |
| POST | `/dataservice/device/lldp/neighbors` | postLldpNeighbors | Monitoring - LLDP | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/statistics/nwa` | getAggregationDataByQuery_MonitoringNetworkAvailability_1504 | Monitoring - Network Availability | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/nwa/aggregation` | getPostAggregationDataByQuery_MonitoringNetworkAvailability_2704 | Monitoring - Network Availability | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/nwa/details` | getDetailAggregationDataByQuery | Monitoring - Network Availability | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/perfmon/aggregation` | getPostAggregationDataByQuery_MonitoringPerformanceMonitor_3104 | Monitoring - Performance Monitor | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/perfmon/application/heatmap/detail` | getApplicationHeatMapDetail | Monitoring - Performance Monitor | read | Read (needs input) | query: application |
| POST | `/dataservice/statistics/perfmon/application/site/health` | getApplicationSiteHealth | Monitoring - Performance Monitor | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/perfmon/application/sites/health` | getApplicationSitesHealth | Monitoring - Performance Monitor | read | Read (needs input) | query: application |
| GET | `/dataservice/statistics/perfmon/applications/site/health` | getApplicationsSiteHealth | Monitoring - Performance Monitor | read | Read (needs input) | query: siteid |
| GET | `/dataservice/statistics/perfmon/applications/sites/health` | getApplicationsSitesHealth | Monitoring - Performance Monitor | read | Verified live | 1 rows |
| POST | `/dataservice/statistics/powerconsumption` | getStatsRawData_MonitoringPowerConsumptionStatistics_2804 | Monitoring - Power Consumption Statistics | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/powerconsumption/aggregation` | getPostAggregationDataByQuery_MonitoringPowerConsumptionStatistics_4004 | Monitoring - Power Consumption Statistics | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/powerconsumption/device` | getPowerConsumptionDevice | Monitoring - Power Consumption Statistics | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/powerconsumption/energymix` | getPowerConsumptionEnergyMix | Monitoring - Power Consumption Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/powerconsumption/supportdevicelist` | getSupportedDeviceList | Monitoring - Power Consumption Statistics | read | Verified live | object |
| POST | `/dataservice/statistics/powerconsumption/total` | getPowerConsumptionTotal | Monitoring - Power Consumption Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ppl/ctg` | getStatDataRawData_MonitoringPpl_1903 | Monitoring - PPL | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/ppl/ctg` | getStatsRawData_MonitoringPpl_1904 | Monitoring - PPL | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ppl/ctg/aggregation` | getAggregationDataByQuery_MonitoringPpl_3103 | Monitoring - PPL | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/ppl/ctg/aggregation` | getPostAggregationDataByQuery_MonitoringPpl_3104 | Monitoring - PPL | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ppl/ctg/csv` | getStatDataRawDataAsCSV_MonitoringPpl_2303 | Monitoring - PPL | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/ppl/ctg/doccount` | getCount_MonitoringPpl_2803 | Monitoring - PPL | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/ppl/ctg/doccount` | getCountPost_MonitoringPpl_2804 | Monitoring - PPL | read | Verified live | object |
| GET | `/dataservice/statistics/ppl/ctg/fields` | getStatDataFields_MonitoringPpl_2603 | Monitoring - PPL | read | Verified live | object |
| GET | `/dataservice/statistics/ppl/ctg/page` | getStatsPaginationRawData_MonitoringPpl_2403 | Monitoring - PPL | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/ppl/ctg/page` | getPostStatsPaginationRawData_MonitoringPpl_2404 | Monitoring - PPL | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ppl/ctg/query/fields` | getStatQueryFields_MonitoringPpl_3203 | Monitoring - PPL | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/ppl/reordering` | getStatDataRawData_MonitoringPpl_2603 | Monitoring - PPL | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/ppl/reordering` | getStatsRawData_MonitoringPpl_2604 | Monitoring - PPL | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ppl/reordering/aggregation` | getAggregationDataByQuery_MonitoringPpl_3803 | Monitoring - PPL | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/ppl/reordering/aggregation` | getPostAggregationDataByQuery_MonitoringPpl_3804 | Monitoring - PPL | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ppl/reordering/csv` | getStatDataRawDataAsCSV_MonitoringPpl_3003 | Monitoring - PPL | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/ppl/reordering/doccount` | getCount_MonitoringPpl_3503 | Monitoring - PPL | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/ppl/reordering/doccount` | getCountPost_MonitoringPpl_3504 | Monitoring - PPL | read | Verified live | object |
| GET | `/dataservice/statistics/ppl/reordering/fields` | getStatDataFields_MonitoringPpl_3303 | Monitoring - PPL | read | Verified live | object |
| GET | `/dataservice/statistics/ppl/reordering/page` | getStatsPaginationRawData_MonitoringPpl_3103 | Monitoring - PPL | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/ppl/reordering/page` | getPostStatsPaginationRawData_MonitoringPpl_3104 | Monitoring - PPL | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/ppl/reordering/query/fields` | getStatQueryFields_MonitoringPpl_3903 | Monitoring - PPL | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/qfp` | getStatDataRawData_MonitoringQfp_1503 | Monitoring - Qfp | read | Verified live | 9252 rows |
| POST | `/dataservice/statistics/qfp` | getStatsRawData_MonitoringQfp_1504 | Monitoring - Qfp | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qfp/aggregation` | getAggregationDataByQuery_MonitoringQfp_2703 | Monitoring - Qfp | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/qfp/aggregation` | getPostAggregationDataByQuery_MonitoringQfp_2704 | Monitoring - Qfp | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qfp/csv` | getStatDataRawDataAsCSV_MonitoringQfp_1903 | Monitoring - Qfp | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/qfp/doccount` | getCount_MonitoringQfp_2403 | Monitoring - Qfp | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/qfp/doccount` | getCountPost_MonitoringQfp_2404 | Monitoring - Qfp | read | Verified live | object |
| GET | `/dataservice/statistics/qfp/fields` | getStatDataFields_MonitoringQfp_2203 | Monitoring - Qfp | read | Verified live | object |
| GET | `/dataservice/statistics/qfp/page` | getStatsPaginationRawData_MonitoringQfp_2003 | Monitoring - Qfp | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/qfp/page` | getPostStatsPaginationRawData_MonitoringQfp_2004 | Monitoring - Qfp | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qfp/query/fields` | getStatQueryFields_MonitoringQfp_2803 | Monitoring - Qfp | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/qfpdrop` | getStatDataRawData_MonitoringQfpDropStatistics_1903 | Monitoring - Qfp Drop Statistics | read | Verified live | 6165 rows |
| POST | `/dataservice/statistics/qfpdrop` | getStatsRawData_MonitoringQfpDropStatistics_1904 | Monitoring - Qfp Drop Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qfpdrop/aggregation` | getAggregationDataByQuery_MonitoringQfpDropStatistics_3103 | Monitoring - Qfp Drop Statistics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/qfpdrop/aggregation` | getPostAggregationDataByQuery_MonitoringQfpDropStatistics_3104 | Monitoring - Qfp Drop Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qfpdrop/csv` | getStatDataRawDataAsCSV_MonitoringQfpDropStatistics_2303 | Monitoring - Qfp Drop Statistics | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/qfpdrop/doccount` | getCount_MonitoringQfpDropStatistics_2803 | Monitoring - Qfp Drop Statistics | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/qfpdrop/doccount` | getCountPost_MonitoringQfpDropStatistics_2804 | Monitoring - Qfp Drop Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/qfpdrop/fields` | getStatDataFields_MonitoringQfpDropStatistics_2603 | Monitoring - Qfp Drop Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/qfpdrop/overview/{type}` | getQfpDropOverview | Monitoring - Qfp Drop Statistics | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/qfpdrop/overview/droptype/{typename}` | getQfpDropOverviewByDropType | Monitoring - Qfp Drop Statistics | read | Read (needs IDs) | path: typename |
| GET | `/dataservice/statistics/qfpdrop/page` | getStatsPaginationRawData_MonitoringQfpDropStatistics_2403 | Monitoring - Qfp Drop Statistics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/qfpdrop/page` | getPostStatsPaginationRawData_MonitoringQfpDropStatistics_2404 | Monitoring - Qfp Drop Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qfpdrop/query/fields` | getStatQueryFields_MonitoringQfpDropStatistics_3203 | Monitoring - Qfp Drop Statistics | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/qos` | getStatDataRawData_MonitoringQos_1503 | Monitoring - QoS | read | Verified live | 10000 rows |
| POST | `/dataservice/statistics/qos` | getStatsRawData12 | Monitoring - QoS | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qos/aggregation` | getAggregationDataByQuery_MonitoringQos_2703 | Monitoring - QoS | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/qos/aggregation` | getPostAggregationDataByQuery_MonitoringQos_2704 | Monitoring - QoS | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/qos/app-agg/aggregation` | getPostAggregationAppDataByQuery_MonitoringQos_3504 | Monitoring - QoS | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qos/csv` | getStatDataRawDataAsCSV12 | Monitoring - QoS | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/qos/doccount` | getCount13 | Monitoring - QoS | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/qos/doccount` | getCountPost13 | Monitoring - QoS | read | Verified live | object |
| GET | `/dataservice/statistics/qos/fields` | getStatDataFields13 | Monitoring - QoS | read | Verified live | object |
| GET | `/dataservice/statistics/qos/page` | getStatBulkRawData_MonitoringQos_2003 | Monitoring - QoS | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"CLICKHOUSE0001","details":"Count invalid. Min: 1, Max: 10000.","type":"e |
| POST | `/dataservice/statistics/qos/page` | getPostStatBulkRawData12 | Monitoring - QoS | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/qos/query/fields` | getStatQueryFields_MonitoringQos_2803 | Monitoring - QoS | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/qos/session/summary` | getSessionQosSummaryStat | Monitoring - QoS | read | Read (needs input) | query: vdevice_name |
| GET | `/dataservice/statistics/sdra/headends` | getSdraHeadendSummary | Monitoring - SDRA | read | Verified live | object |
| GET | `/dataservice/statistics/sdra/sessions` | getSdraSessionSummary | Monitoring - SDRA | read | Verified live | object |
| GET | `/dataservice/v1/search` | search | Monitoring - Search | read | Read (needs input) | query: q |
| GET | `/dataservice/v1/search/categories` | listCategories | Monitoring - Search | read | Verified live | object |
| GET | `/dataservice/accesstoken/{regionBaseUri}/{clientId}` | getSecureXAccessToken | Monitoring - SecureX Integration | blocked (deprecated) | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/device_authorization/{regionBaseUri}/{clientId}` | deviceAuthorization | Monitoring - SecureX Integration | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/refreshtoken/{regionBaseUri}/{clientId}` | getSecureXRefreshToken | Monitoring - SecureX Integration | blocked (deprecated) | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/token/{regionBaseUri}/{clientId}` | token | Monitoring - SecureX Integration | blocked (deprecated) | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/security/device/health` | getSecurityDeviceHealth | Monitoring - Security Policy | read | Verified live | 0 rows |
| GET | `/dataservice/security/policy/devicelist` | getSecurityPolicyDeviceList_MonitoringSecurityPolicy_2703 | Monitoring - Security Policy | read | Verified live | object |
| POST | `/dataservice/security/policy/fwall/device` | getPostFwallByQuery | Monitoring - Security Policy | read | Read (needs input) | query body |
| POST | `/dataservice/security/policy/ips/device` | getPostIPSAlertByQuery | Monitoring - Security Policy | read | Read (needs input) | query body |
| POST | `/dataservice/security/policy/urlf/device` | getPostUrlFilteringByQuery | Monitoring - Security Policy | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/sul/connections` | getSulStatDataRawData | Monitoring - Security Unified Logging Connection Events | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/sul/connections` | getStatsRawData_MonitoringSecurityUnifiedLoggingConnectionEvents_2704 | Monitoring - Security Unified Logging Connection Events | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/sul/connections/aggregation` | getAggregationDataByQuery_MonitoringSecurityUnifiedLoggingConnectionEvents_3903 | Monitoring - Security Unified Logging Connection Events | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| POST | `/dataservice/statistics/sul/connections/aggregation` | getPostAggregationDataByQuery_MonitoringSecurityUnifiedLoggingConnectionEvents_3904 | Monitoring - Security Unified Logging Connection Events | read | Read (needs input) | query body |
| POST | `/dataservice/statistics/sul/connections/app-agg/aggregation` | getPostAggregationAppDataByQuery_MonitoringSecurityUnifiedLoggingConnectionEvents_4704 | Monitoring - Security Unified Logging Connection Events | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/sul/connections/csv` | getStatDataRawDataAsCSV_MonitoringSecurityUnifiedLoggingConnectionEvents_3103 | Monitoring - Security Unified Logging Connection Events | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/sul/connections/doccount` | getCount_MonitoringSecurityUnifiedLoggingConnectionEvents_3603 | Monitoring - Security Unified Logging Connection Events | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/sul/connections/doccount` | getCountPost_MonitoringSecurityUnifiedLoggingConnectionEvents_3604 | Monitoring - Security Unified Logging Connection Events | read | Verified live | object |
| GET | `/dataservice/statistics/sul/connections/fields` | getStatDataFields_MonitoringSecurityUnifiedLoggingConnectionEvents_3403 | Monitoring - Security Unified Logging Connection Events | read | Verified live | object |
| GET | `/dataservice/statistics/sul/connections/filter/policy_name/{policyType}` | getFilterPolicyNameList | Monitoring - Security Unified Logging Connection Events | read | Read (needs IDs) | path: policyType |
| GET | `/dataservice/statistics/sul/connections/page` | getStatsPaginationRawData_MonitoringSecurityUnifiedLoggingConnectionEvents_3203 | Monitoring - Security Unified Logging Connection Events | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| POST | `/dataservice/statistics/sul/connections/page` | getPostStatsPaginationRawData_MonitoringSecurityUnifiedLoggingConnectionEvents_3204 | Monitoring - Security Unified Logging Connection Events | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/sul/connections/query/fields` | getStatQueryFields_MonitoringSecurityUnifiedLoggingConnectionEvents_4003 | Monitoring - Security Unified Logging Connection Events | read | Verified live | 16 rows |
| GET | `/dataservice/server/info` | createServerInfo_MonitoringServerInfo_1203 | Monitoring - Server Info | read | Verified live | object |
| GET | `/dataservice/statistics/sitehealth` | getStatDataRawData_MonitoringSitehealthMonitor_2203 | Monitoring - SiteHealth Monitor | read | Verified live | 3744 rows |
| POST | `/dataservice/statistics/sitehealth` | getStatsRawData_MonitoringSitehealthMonitor_2204 | Monitoring - SiteHealth Monitor | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/sitehealth/aggregation` | getAggregationDataByQuery_MonitoringSitehealthMonitor_3403 | Monitoring - SiteHealth Monitor | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/sitehealth/aggregation` | getPostAggregationDataByQuery_MonitoringSitehealthMonitor_3404 | Monitoring - SiteHealth Monitor | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/sitehealth/common` | getSiteHealth | Monitoring - SiteHealth Monitor | read | Verified live | 13 rows |
| GET | `/dataservice/statistics/sitehealth/csv` | getStatDataRawDataAsCSV_MonitoringSitehealthMonitor_2603 | Monitoring - SiteHealth Monitor | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/sitehealth/doccount` | getCount_MonitoringSitehealthMonitor_3103 | Monitoring - SiteHealth Monitor | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/sitehealth/doccount` | getCountPost_MonitoringSitehealthMonitor_3104 | Monitoring - SiteHealth Monitor | read | Verified live | object |
| GET | `/dataservice/statistics/sitehealth/fields` | getStatDataFields_MonitoringSitehealthMonitor_2903 | Monitoring - SiteHealth Monitor | read | Verified live | object |
| GET | `/dataservice/statistics/sitehealth/page` | getStatsPaginationRawData_MonitoringSitehealthMonitor_2703 | Monitoring - SiteHealth Monitor | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/sitehealth/page` | getPostStatsPaginationRawData_MonitoringSitehealthMonitor_2704 | Monitoring - SiteHealth Monitor | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/sitehealth/query/fields` | getStatQueryFields_MonitoringSitehealthMonitor_3503 | Monitoring - SiteHealth Monitor | read | Verified live | 2 rows |
| GET | `/dataservice/statistics/sitehealth/topology` | getSiteHealthTopology | Monitoring - SiteHealth Monitor | read | Verified live | 3 rows |
| GET | `/dataservice/statistics/download/{processType}/fetchvManageList` | fetchList | Monitoring - Stats Download | read | Read (needs IDs) | path: processType |
| GET | `/dataservice/statistics/download/{processType}/file/{token}/{fileName}` | download | Monitoring - Stats Download | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/statistics/download/{processType}/filelist` | downloadList | Monitoring - Stats Download | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/statistics` | getStatisticType | Monitoring - Stats Processing | read | Verified live | 4896 rows |
| GET | `/dataservice/statistics/collect` | startStatsCollection | Monitoring - Stats Processing | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/statistics/collect/thread/status` | generateStatsCollectThreadReport | Monitoring - Stats Processing | read | Verified live | object |
| GET | `/dataservice/statistics/collection/reset/{processQueue}` | resetStatsCollection | Monitoring - Stats Processing | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/statistics/demomode` | enableStatisticsDemoMode | Monitoring - Stats Processing | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/statistics/process` | processStatisticsData | Monitoring - Stats Processing | read | Verified live | object |
| GET | `/dataservice/statistics/process/counters` | getStatisticsProcessingCounters | Monitoring - Stats Processing | read | Verified live | object |
| GET | `/dataservice/statistics/process/status` | generateStatsProcessReport | Monitoring - Stats Processing | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| GET | `/dataservice/statistics/process/thread/status` | generateStatsProcessThreadReport | Monitoring - Stats Processing | read | Verified live | 0 rows |
| GET | `/dataservice/statistics/settings/disable/devicelist/{indexName}` | getDisabledDeviceList | Monitoring - Status | read | Read (needs IDs) | path: indexName |
| PUT | `/dataservice/statistics/settings/disable/devicelist/{indexName}` | updateStatisticsDeviceList | Monitoring - Status | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/statistics/settings/status` | getStatisticsSettings | Monitoring - Status | read | Verified live | object |
| PUT | `/dataservice/statistics/settings/status` | updateStatisticsSettings | Monitoring - Status | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/statistics/settings/status/device` | getEnabledIndexForDevice | Monitoring - Status | read | Verified live | deviceId=<edge>: object |
| GET | `/dataservice/statistics/system/stats` | getStatDataRawData_MonitoringSystemStatusStats_2403 | Monitoring - System Status Stats | read (deprecated) | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| POST | `/dataservice/statistics/system/stats` | getStatsRawData_MonitoringSystemStatusStats_2404 | Monitoring - System Status Stats | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/system/stats/aggregation` | getAggregationDataByQuery_MonitoringSystemStatusStats_3603 | Monitoring - System Status Stats | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/system/stats/aggregation` | getPostAggregationDataByQuery_MonitoringSystemStatusStats_3604 | Monitoring - System Status Stats | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/system/stats/csv` | getStatDataRawDataAsCSV_MonitoringSystemStatusStats_2803 | Monitoring - System Status Stats | read (deprecated) | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/system/stats/doccount` | getCount_MonitoringSystemStatusStats_3303 | Monitoring - System Status Stats | read (deprecated) | Read (needs input) | query: query |
| POST | `/dataservice/statistics/system/stats/doccount` | getCountPost_MonitoringSystemStatusStats_3304 | Monitoring - System Status Stats | read (deprecated) | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| GET | `/dataservice/statistics/system/stats/fields` | getStatDataFields_MonitoringSystemStatusStats_3103 | Monitoring - System Status Stats | read (deprecated) | Verified live | object |
| GET | `/dataservice/statistics/system/stats/page` | getStatsPaginationRawData_MonitoringSystemStatusStats_2903 | Monitoring - System Status Stats | read (deprecated) | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/system/stats/page` | getPostStatsPaginationRawData_MonitoringSystemStatusStats_2904 | Monitoring - System Status Stats | read (deprecated) | Read (needs input) | query body |
| GET | `/dataservice/statistics/system/stats/query/fields` | getStatQueryFields_MonitoringSystemStatusStats_3703 | Monitoring - System Status Stats | read (deprecated) | Verified live | 1 rows |
| GET | `/dataservice/statistics/temperature` | getStatDataRawData_MonitoringTemperatureStatistics_2303 | Monitoring - Temperature Statistics | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/temperature` | getStatsRawData_MonitoringTemperatureStatistics_2304 | Monitoring - Temperature Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/temperature/aggregation` | getAggregationDataByQuery_MonitoringTemperatureStatistics_3503 | Monitoring - Temperature Statistics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/temperature/aggregation` | getPostAggregationDataByQuery_MonitoringTemperatureStatistics_3504 | Monitoring - Temperature Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/temperature/csv` | getStatDataRawDataAsCSV_MonitoringTemperatureStatistics_2703 | Monitoring - Temperature Statistics | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/temperature/doccount` | getCount_MonitoringTemperatureStatistics_3203 | Monitoring - Temperature Statistics | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/temperature/doccount` | getCountPost_MonitoringTemperatureStatistics_3204 | Monitoring - Temperature Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/temperature/fields` | getStatDataFields_MonitoringTemperatureStatistics_3003 | Monitoring - Temperature Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/temperature/overview` | getTemperatureOverview | Monitoring - Temperature Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/temperature/page` | getStatsPaginationRawData_MonitoringTemperatureStatistics_2803 | Monitoring - Temperature Statistics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"CLICKHOUSE0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/temperature/page` | getPostStatsPaginationRawData_MonitoringTemperatureStatistics_2804 | Monitoring - Temperature Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/temperature/query/fields` | getStatQueryFields_MonitoringTemperatureStatistics_3603 | Monitoring - Temperature Statistics | read | Verified live | 1 rows |
| POST | `/dataservice/statistics` | getStatsRawData_MonitoringTunnelHealth_1104 | Monitoring - Tunnel Health | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/aggregation` | getAggregationDataByQuery_MonitoringTunnelHealth_2303 | Monitoring - Tunnel Health | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/aggregation` | getPostAggregationDataByQuery_MonitoringTunnelHealth_2304 | Monitoring - Tunnel Health | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/csv` | getStatDataRawDataAsCSV_MonitoringTunnelHealth_1503 | Monitoring - Tunnel Health | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/doccount` | getCount_MonitoringTunnelHealth_2003 | Monitoring - Tunnel Health | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/doccount` | getCountPost_MonitoringTunnelHealth_2004 | Monitoring - Tunnel Health | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Invalid query.","code":"STATS_VALIDATION0001","details":"Invalid query, please check input and r |
| GET | `/dataservice/statistics/fields` | getStatDataFields_MonitoringTunnelHealth_1803 | Monitoring - Tunnel Health | read | Verified live | object |
| GET | `/dataservice/statistics/page` | getStatsPaginationRawData_MonitoringTunnelHealth_1603 | Monitoring - Tunnel Health | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/page` | getPostStatsPaginationRawData_MonitoringTunnelHealth_1604 | Monitoring - Tunnel Health | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/query/fields` | getStatQueryFields_MonitoringTunnelHealth_2403 | Monitoring - Tunnel Health | read | Verified live | 2 rows |
| GET | `/dataservice/statistics/tunnelhealth/history` | statisticsApprouteTunnelhealthHistoryGet | Monitoring - Tunnel Health | read | Verified live | object |
| GET | `/dataservice/statistics/tunnelhealth/overview/{type}` | statisticsApprouteTunnelhealthOverviewTypeGet | Monitoring - Tunnel Health | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/umbrella` | getStatDataRawData_MonitoringUmbrella_2003 | Monitoring - Umbrella | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/umbrella` | getStatsRawData_MonitoringUmbrella_2004 | Monitoring - Umbrella | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/umbrella/aggregation` | getAggregationDataByQuery_MonitoringUmbrella_3203 | Monitoring - Umbrella | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/umbrella/aggregation` | getPostAggregationDataByQuery_MonitoringUmbrella_3204 | Monitoring - Umbrella | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/umbrella/csv` | getStatDataRawDataAsCSV_MonitoringUmbrella_2403 | Monitoring - Umbrella | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/umbrella/doccount` | getCount_MonitoringUmbrella_2903 | Monitoring - Umbrella | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/umbrella/doccount` | getCountPost_MonitoringUmbrella_2904 | Monitoring - Umbrella | read | Verified live | object |
| GET | `/dataservice/statistics/umbrella/fields` | getStatDataFields_MonitoringUmbrella_2703 | Monitoring - Umbrella | read | Verified live | object |
| GET | `/dataservice/statistics/umbrella/page` | getStatsPaginationRawData_MonitoringUmbrella_2503 | Monitoring - Umbrella | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/umbrella/page` | getPostStatsPaginationRawData_MonitoringUmbrella_2504 | Monitoring - Umbrella | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/umbrella/query/fields` | getStatQueryFields_MonitoringUmbrella_3303 | Monitoring - Umbrella | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/fwall` | getStatDataRawData_MonitoringUmbrellaPatterns_1703 | Monitoring - Umbrella Patterns | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/fwall` | getStatsRawData_MonitoringUmbrellaPatterns_1704 | Monitoring - Umbrella Patterns | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/fwall/aggregation` | getAggregationDataByQuery_MonitoringUmbrellaPatterns_2903 | Monitoring - Umbrella Patterns | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/fwall/aggregation` | getPostAggregationDataByQuery_MonitoringUmbrellaPatterns_2904 | Monitoring - Umbrella Patterns | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/fwall/csv` | getStatDataRawDataAsCSV_MonitoringUmbrellaPatterns_2103 | Monitoring - Umbrella Patterns | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/fwall/doccount` | getCount_MonitoringUmbrellaPatterns_2603 | Monitoring - Umbrella Patterns | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/fwall/doccount` | getCountPost_MonitoringUmbrellaPatterns_2604 | Monitoring - Umbrella Patterns | read | Verified live | object |
| GET | `/dataservice/statistics/fwall/fields` | getStatDataFields_MonitoringUmbrellaPatterns_2403 | Monitoring - Umbrella Patterns | read | Verified live | object |
| GET | `/dataservice/statistics/fwall/page` | getStatsPaginationRawData_MonitoringUmbrellaPatterns_2203 | Monitoring - Umbrella Patterns | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/fwall/page` | getPostStatsPaginationRawData_MonitoringUmbrellaPatterns_2204 | Monitoring - Umbrella Patterns | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/fwall/query/fields` | getStatQueryFields_MonitoringUmbrellaPatterns_3003 | Monitoring - Umbrella Patterns | read | Verified live | 1 rows |
| GET | `/dataservice/device/underlay/alarms/{type}` | getUnderlayAlarmsOverview | Monitoring - Underlay Alarms | read | Read (needs IDs) | path: type |
| GET | `/dataservice/statistics/urlf` | getStatDataRawData_MonitoringUrlFiltering_1603 | Monitoring - URL Filtering | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/urlf` | getStatsRawData_MonitoringUrlFiltering_1604 | Monitoring - URL Filtering | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/urlf/aggregation` | getAggregationDataByQuery_MonitoringUrlFiltering_2803 | Monitoring - URL Filtering | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/urlf/aggregation` | getPostAggregationDataByQuery_MonitoringUrlFiltering_2804 | Monitoring - URL Filtering | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/urlf/csv` | getStatDataRawDataAsCSV_MonitoringUrlFiltering_2003 | Monitoring - URL Filtering | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/urlf/doccount` | getCount_MonitoringUrlFiltering_2503 | Monitoring - URL Filtering | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/urlf/doccount` | getCountPost_MonitoringUrlFiltering_2504 | Monitoring - URL Filtering | read | Verified live | object |
| GET | `/dataservice/statistics/urlf/fields` | getStatDataFields_MonitoringUrlFiltering_2303 | Monitoring - URL Filtering | read | Verified live | object |
| GET | `/dataservice/statistics/urlf/page` | getStatsPaginationRawData_MonitoringUrlFiltering_2103 | Monitoring - URL Filtering | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/urlf/page` | getPostStatsPaginationRawData_MonitoringUrlFiltering_2104 | Monitoring - URL Filtering | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/urlf/query/fields` | getStatQueryFields_MonitoringUrlFiltering_2903 | Monitoring - URL Filtering | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/vnfstatistics` | getStatDataRawData_MonitoringVnfInterfaceStatistics_2503 | Monitoring - VNF Interface Statistics | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/vnfstatistics` | getStatsRawData_MonitoringVnfInterfaceStatistics_2504 | Monitoring - VNF Interface Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/vnfstatistics/aggregation` | getAggregationDataByQuery_MonitoringVnfInterfaceStatistics_3703 | Monitoring - VNF Interface Statistics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/vnfstatistics/aggregation` | getPostAggregationDataByQuery_MonitoringVnfInterfaceStatistics_3704 | Monitoring - VNF Interface Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/vnfstatistics/csv` | getStatDataRawDataAsCSV_MonitoringVnfInterfaceStatistics_2903 | Monitoring - VNF Interface Statistics | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/vnfstatistics/doccount` | getCount_MonitoringVnfInterfaceStatistics_3403 | Monitoring - VNF Interface Statistics | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/vnfstatistics/doccount` | getCountPost_MonitoringVnfInterfaceStatistics_3404 | Monitoring - VNF Interface Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/vnfstatistics/fields` | getStatDataFields_MonitoringVnfInterfaceStatistics_3203 | Monitoring - VNF Interface Statistics | read | Verified live | object |
| GET | `/dataservice/statistics/vnfstatistics/page` | getStatsPaginationRawData_MonitoringVnfInterfaceStatistics_3003 | Monitoring - VNF Interface Statistics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/vnfstatistics/page` | getPostStatsPaginationRawData_MonitoringVnfInterfaceStatistics_3004 | Monitoring - VNF Interface Statistics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/vnfstatistics/query/fields` | getStatQueryFields_MonitoringVnfInterfaceStatistics_3803 | Monitoring - VNF Interface Statistics | read | Verified live | 1 rows |
| GET | `/dataservice/statistics/wlanclientinfo` | getStatDataRawData_MonitoringWlanClientInfo_2603 | Monitoring - Wlan Client Info | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/wlanclientinfo` | getStatsRawData_MonitoringWlanClientInfo_2604 | Monitoring - Wlan Client Info | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/wlanclientinfo/aggregation` | getAggregationDataByQuery_MonitoringWlanClientInfo_3803 | Monitoring - Wlan Client Info | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/wlanclientinfo/aggregation` | getPostAggregationDataByQuery_MonitoringWlanClientInfo_3804 | Monitoring - Wlan Client Info | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/wlanclientinfo/csv` | getStatDataRawDataAsCSV_MonitoringWlanClientInfo_3003 | Monitoring - Wlan Client Info | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/wlanclientinfo/doccount` | getCount_MonitoringWlanClientInfo_3503 | Monitoring - Wlan Client Info | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/wlanclientinfo/doccount` | getCountPost_MonitoringWlanClientInfo_3504 | Monitoring - Wlan Client Info | read | Verified live | object |
| GET | `/dataservice/statistics/wlanclientinfo/fields` | getStatDataFields_MonitoringWlanClientInfo_3303 | Monitoring - Wlan Client Info | read | Verified live | object |
| GET | `/dataservice/statistics/wlanclientinfo/page` | getStatsPaginationRawData_MonitoringWlanClientInfo_3103 | Monitoring - Wlan Client Info | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/wlanclientinfo/page` | getPostStatsPaginationRawData_MonitoringWlanClientInfo_3104 | Monitoring - Wlan Client Info | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/wlanclientinfo/query/fields` | getStatQueryFields_MonitoringWlanClientInfo_3903 | Monitoring - Wlan Client Info | read | Verified live | 1 rows |
| GET | `/dataservice/msla/devices` | getMSLADevices_Msla_1303 | MSLA | read | Verified live | 13 rows |
| PUT | `/dataservice/msla/devices` | releaseLicenses_Msla_1303 | MSLA | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/msla/licenses/compliance` | getLicensesCompliance | MSLA | read | Verified live | object |
| GET | `/dataservice/multicloud/accounts` | getAllCloudAccounts | MultiCloud - Accounts | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/accounts` | validateAccountAdd | MultiCloud - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/accounts/{accountId}` | deleteAccount | MultiCloud - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/accounts/{accountId}` | getCloudAccountDetails | MultiCloud - Accounts | read | Read (needs IDs) | path: accountId |
| PUT | `/dataservice/multicloud/accounts/{accountId}` | updateAccount | MultiCloud - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/multicloud/accounts/{accountId}/credentials` | validateAccountUpdateCredentials | MultiCloud - Accounts | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/multicloud/accounts/externalId` | getMulticloudExternalId | MultiCloud - Accounts | read | Verified live | object |
| DELETE | `/dataservice/multicloud/cloudgateway/{cloudGatewayName}/site` | detachSites_MulticloudBranchconnect_4806 | MultiCloud - BranchConnect | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/cloudgateway/{cloudGatewayName}/site` | getCgwAttachedSites | MultiCloud - BranchConnect | read | Read (needs IDs) | path: cloudGatewayName |
| POST | `/dataservice/multicloud/cloudgateway/{cloudGatewayName}/site` | attachSites | MultiCloud - BranchConnect | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/multicloud/cloudgateway/{cloudGatewayName}/site` | tunnelScaling | MultiCloud - BranchConnect | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interfacecolor` | getWanInterfaceColors | MultiCloud - BranchConnect | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Can not process request further","code":"MCERR001","details":"AWS CGW solution not set to TGW"," |
| GET | `/dataservice/multicloud/site` | getSites | MultiCloud - BranchConnect | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Can not process request further","code":"MCERR001","details":"AWS CGW solution not set to TGW or |
| GET | `/dataservice/multicloud/cloudgateway` | getCgws | MultiCloud - CloudGateway | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/cloudgateway` | createCgw | MultiCloud - CloudGateway | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/cloudgateway/{cloudGatewayName}` | deleteCgw | MultiCloud - CloudGateway | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/cloudgateway/{cloudGatewayName}` | getCgwDetails | MultiCloud - CloudGateway | read | Read (needs IDs) | path: cloudGatewayName |
| PUT | `/dataservice/multicloud/cloudgateway/{cloudGatewayName}` | updateCgw | MultiCloud - CloudGateway | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/cloudgateway/{cloudType}/gateways/device-chassis-numbers` | getAvailableDevicesOrByCGId_MulticloudCloudgateway_6803 | MultiCloud - CloudGateway | read | Read (needs IDs) | path: cloudType |
| GET | `/dataservice/multicloud/cloudgateway/availabilityZones` | getAvailabilityZones | MultiCloud - CloudGateway | read | Read (needs input) | query: accountId |
| POST | `/dataservice/multicloud/cloudgateway/config-group` | createCloudGatewayConfigGroup | MultiCloud - CloudGateway | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/cloudgateway/nvas` | getAzureNetworkVirtualAppliances | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/cloudgateway/nvaSecurityRules/{cloudGatewayName}` | getNvaSecurityRules | MultiCloud - CloudGateway | read | Read (needs IDs) | path: cloudGatewayName |
| PUT | `/dataservice/multicloud/cloudgateway/nvaSecurityRules/{cloudGatewayName}` | updateNvaSecurityRules | MultiCloud - CloudGateway | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/cloudgateway/nvasku` | getAzureNvaSkuResources | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/cloudgateway/resource` | getCgwOrgResources | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudGatewayName |
| GET | `/dataservice/multicloud/cloudgateway/resourceGroups` | getAzureResourceGroups | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/cloudgateway/tgw/Attachments` | getAwsTgwAttachments | MultiCloud - CloudGateway | read | Read (needs input) | query: accountId |
| GET | `/dataservice/multicloud/cloudgateway/tgw/RouteTables` | getAwsTgwRouteTables | MultiCloud - CloudGateway | read | Read (needs input) | query: accountId |
| GET | `/dataservice/multicloud/cloudgateway/tgws` | getAwsTgws | MultiCloud - CloudGateway | read | Read (needs input) | query: accountId |
| GET | `/dataservice/multicloud/cloudgateway/vhubs` | getAzureVirtualHubs | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/cloudgateway/vnetsNoofAttached` | getAzureVirtualVnetsAttached | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/cloudgateway/vpn-gateways` | getAzureVpnGateways | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/cloudgateway/vwans` | getAzureVirtualWans | MultiCloud - CloudGateway | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/cloudgateways/{cloudType}` | getCloudGateways | MultiCloud - CloudGateway | read | Read (needs IDs) | path: cloudType |
| GET | `/dataservice/multicloud/cloudgatewaysetting/{cloudGatewayName}` | getCgwCustomSettingDetails | MultiCloud - CloudGateway | read | Read (needs IDs) | path: cloudGatewayName |
| GET | `/dataservice/multicloud/cloudgatewaytype` | getCgwTypes | MultiCloud - CloudGateway | read | Verified live | object |
| POST | `/dataservice/multicloud/pushCgwConfig` | pushCgwCfg | MultiCloud - CloudGateway | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/tunnels/{cloudType}` | getTunnelNames | MultiCloud - CloudGateway | read | Read (needs IDs) | path: cloudType |
| GET | `/dataservice/multicloud/{cloudType}/config-group/{config-group-id}/topology` | getMultiCloudConfigGroupTopology | MultiCloud - General | read | Read (needs IDs) | path: cloudType, config-group-id |
| PUT | `/dataservice/multicloud/{cloudType}/config-group/{config-group-id}/topology` | updateMultiCloudConfigGroupTopology | MultiCloud - General | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/audit` | auditDryRun | MultiCloud - General | read | Verified live | object |
| POST | `/dataservice/multicloud/audit` | audit | MultiCloud - General | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/connected-sites/{cloudType}` | getCloudConnectedSites | MultiCloud - General | read | Read (needs IDs) | path: cloudType |
| GET | `/dataservice/multicloud/corenetworkpolicy` | getCwanCoreNetworkPolicy | MultiCloud - General | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Can not process request further","code":"MCERR001","details":"The core network doesn't exist yet |
| GET | `/dataservice/multicloud/device` | getWanDevices | MultiCloud - General | read | Verified live | 0 rows |
| GET | `/dataservice/multicloud/devices/{cloudType}` | getCloudDevices | MultiCloud - General | read | Read (needs IDs) | path: cloudType |
| GET | `/dataservice/multicloud/regions` | getCloudRegions | MultiCloud - General | read | Verified live | 0 rows |
| GET | `/dataservice/multicloud/sshkeys` | getSshKeyList | MultiCloud - General | read | Read (needs input) | query: cloudType |
| POST | `/dataservice/multicloud/statistics/interface/aggregation` | getPostAggregationDataByQuery_MulticloudGeneral_4404 | MultiCloud - General | read | Read (needs input) | query body |
| POST | `/dataservice/multicloud/telemetry` | telemetry | MultiCloud - General | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/types` | getCloudTypes | MultiCloud - General | read | Verified live | 5 rows |
| GET | `/dataservice/multicloud/widget` | getAllCloudWidgets | MultiCloud - General | read | Verified live | 5 rows |
| GET | `/dataservice/multicloud/widget/{cloudType}` | getCloudWidget | MultiCloud - General | read | Read (needs IDs) | path: cloudType |
| GET | `/dataservice/multicloud/instancesize` | getSupportedInstanceSize | MultiCloud - Global Settings | read | Verified live | 11 rows |
| GET | `/dataservice/multicloud/settings/global` | getGlobalSettings | MultiCloud - Global Settings | read | Live error (HTTP 404) | vManage API error 404: {"error":{"message":"Data not found","code":"MCERR004","details":"Failed to get global settings for AWS"}} |
| POST | `/dataservice/multicloud/settings/global` | addGlobalSettings | MultiCloud - Global Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/multicloud/settings/global` | updateGlobalSettings | MultiCloud - Global Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/swimages` | getSupportedSoftwareImageList | MultiCloud - Global Settings | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Can not process request further","code":"MCERR001","details":"No AWS account found with Cloud Ga |
| GET | `/dataservice/multicloud/map` | getMappingMatrix | MultiCloud - Mapping | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/map` | processMapping | MultiCloud - Mapping | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/map/defaults` | getDefaultMappingValues | MultiCloud - Mapping | read | Verified live | 11 rows |
| GET | `/dataservice/multicloud/map/status` | getMappingStatus | MultiCloud - Mapping | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/map/summary` | getMappingSummary | MultiCloud - Mapping | read | Verified live | 0 rows |
| GET | `/dataservice/multicloud/map/tags` | getMappingTags | MultiCloud - Mapping | read | Verified live | 0 rows |
| GET | `/dataservice/multicloud/map/vpns` | getMappingVpns | MultiCloud - Mapping | read | Verified live | 4 rows |
| GET | `/dataservice/multicloud/mapping/{cloudType}` | getCgwAssociatedMappings | MultiCloud - Mapping | read | Read (needs IDs) | path: cloudType |
| GET | `/dataservice/multicloud/hostvpc` | getHostVpcs | MultiCloud - Tagging | read | Read (needs input) | query: cloudType |
| GET | `/dataservice/multicloud/hostvpc/tags` | getVpcTags | MultiCloud - Tagging | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/hostvpc/tags` | hostVpcTagging | MultiCloud - Tagging | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/multicloud/hostvpc/tags` | editTag | MultiCloud - Tagging | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/hostvpc/tags/{tagName}` | unTag | MultiCloud - Tagging | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/multicloud/hostvpc/tags/rebalanceVnets` | rebalanceVnets | MultiCloud - Tagging | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/accounts/{interconnect-account-id}/billing-accounts` | getInterconnectBillingAccounts | Multicloud Interconnect - Accounts | read | Read (needs IDs) | path: interconnect-type, interconnect-account-id |
| DELETE | `/dataservice/multicloud/interconnect/{interconnect-type}/accounts/{interconnect-account-id}/locations` | deleteInterconnectLocationInfo | Multicloud Interconnect - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/accounts/{interconnect-account-id}/locations` | getInterconnectLocationInfo | Multicloud Interconnect - Accounts | read | Read (needs IDs) | path: interconnect-type, interconnect-account-id |
| PUT | `/dataservice/multicloud/interconnect/{interconnect-type}/accounts/{interconnect-account-id}/locations` | updateInterconnectLocationInfo | Multicloud Interconnect - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/{interconnect-type}/locations` | deleteAllInterconnectLocationInfo | Multicloud Interconnect - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/accounts` | getInterconnectAccounts | Multicloud Interconnect - Accounts | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/interconnect/accounts` | addInterconnectAccount | Multicloud Interconnect - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/accounts/{interconnect-account-id}` | deleteInterconnectAccount | Multicloud Interconnect - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/accounts/{interconnect-account-id}` | getInterconnectAccount | Multicloud Interconnect - Accounts | read | Read (needs IDs) | path: interconnect-account-id |
| PUT | `/dataservice/multicloud/interconnect/accounts/{interconnect-account-id}` | updateInterconnectAccount | Multicloud Interconnect - Accounts | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/multicloud/interconnect/accounts/{interconnect-account-id}/credentials` | updateInterconnectAccountCredentials | Multicloud Interconnect - Accounts | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/accounts/{cloud-account-id}/gcr-and-attachments` | getGoogleCloudRouterAndAttachments | Multicloud Interconnect - Cloud Resource Management | read | Read (needs IDs) | path: cloud-type, cloud-account-id |
| GET | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/accounts/{cloud-account-id}/transit-gateways` | getAwsTransitGateways | Multicloud Interconnect - Cloud Resource Management | read | Read (needs IDs) | path: cloud-type, cloud-account-id |
| GET | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/accounts/{cloud-account-id}/vhubs` | getAzVirtualHubs | Multicloud Interconnect - Cloud Resource Management | read | Read (needs IDs) | path: cloud-type, cloud-account-id |
| GET | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/accounts/{cloud-account-id}/vwans` | getAzVirtualWans | Multicloud Interconnect - Cloud Resource Management | read | Read (needs IDs) | path: cloud-type, cloud-account-id |
| POST | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/accounts/{cloud-account-id}/vwans` | createAzVirtualWan | Multicloud Interconnect - Cloud Resource Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/accounts/{cloud-account-id}/vwans/{vwan-name}` | deleteAzVirtualWan | Multicloud Interconnect - Cloud Resource Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/cloud-connectivity-gateways` | deleteCloudConnectivityGateways | Multicloud Interconnect - Cloud Resource Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/cloud-connectivity-gateways` | getCloudConnectivityGateways | Multicloud Interconnect - Cloud Resource Management | read | Read (needs IDs) | path: cloud-type |
| POST | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/cloud-connectivity-gateways` | addCloudConnectivityGateway | Multicloud Interconnect - Cloud Resource Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/cloud-connectivity-gateways/{connectivity-gateway-name}` | deleteCloudConnectivityGateway | Multicloud Interconnect - Cloud Resource Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/cloud/{cloud-type}/cloud-connectivity-gateways/create-options` | getCloudConnectivityGatewayCreateOptions | Multicloud Interconnect - Cloud Resource Management | read | Read (needs IDs) | path: cloud-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/accounts/{interconnect-account-id}/cloud/{cloud-type}/connectivity/connections/partner-ports` | getInterconnectPartnerPorts | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: interconnect-type, interconnect-account-id, cloud-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/accounts/{interconnect-account-id}/connectivity/connections/{connection-type}/port-speeds` | getInterconnectPortSpeeds | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: interconnect-type, interconnect-account-id, connection-type |
| POST | `/dataservice/multicloud/interconnect/{interconnect-type}/connectivity/device-links/metro-speed` | getInterconnectDeviceLinkMetroSpeed | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/connectivity/device-links/port-speeds` | getInterconnectDeviceLinkPortSpeeds | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/connectivity/cloud-onramp-gateway-connections` | getInterconnectOnRampGatewayConnections | Multicloud Interconnect - Connectivity | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/interconnect/connectivity/cloud-onramp-gateway-connections` | createInterconnectOnRampGatewayConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/connectivity/cloud-onramp-gateway-connections/{connection-name}` | deleteInterconnectOnRampGatewayConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/connectivity/cloud-onramp-gateway-connections/{connection-name}` | getInterconnectOnRampGatewayConnection | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: connection-name |
| PUT | `/dataservice/multicloud/interconnect/connectivity/cloud-onramp-gateway-connections/{connection-name}` | updateInterconnectOnRampGatewayConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/connectivity/cloud-onramp-gateway-connections/{connection-name}/resources` | getInterconnectOnRampGatewayConnectionResources | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: connection-name |
| GET | `/dataservice/multicloud/interconnect/connectivity/connections/tags` | getInterconnectMappingTags | Multicloud Interconnect - Connectivity | read | Read (needs input) | query: cloud-type |
| GET | `/dataservice/multicloud/interconnect/connectivity/device-links` | getInterconnectDeviceLinks | Multicloud Interconnect - Connectivity | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/interconnect/connectivity/device-links` | addInterconnectDeviceLink | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/connectivity/device-links/{device-link-name}` | deleteInterconnectDeviceLink | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/connectivity/device-links/{device-link-name}` | getInterconnectDeviceLink | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: device-link-name |
| PUT | `/dataservice/multicloud/interconnect/connectivity/device-links/{device-link-name}` | updateInterconnectDeviceLink | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/connectivity/virtual-cross-connections` | getInterconnectCrossConnections | Multicloud Interconnect - Connectivity | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/interconnect/connectivity/virtual-cross-connections` | createInterconnectCrossConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/connectivity/virtual-cross-connections/{connection-name}` | deleteInterconnectCrossConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/connectivity/virtual-cross-connections/{connection-name}` | getInterconnectCrossConnection | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: connection-name |
| PUT | `/dataservice/multicloud/interconnect/connectivity/virtual-cross-connections/{connection-name}` | updateInterconnectCrossConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/connectivity/virtual-network-connections` | getInterconnectVirtualNetworkConnections | Multicloud Interconnect - Connectivity | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/interconnect/connectivity/virtual-network-connections` | createInterconenctVirtualNetworkConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/connectivity/virtual-network-connections/{connection-name}` | deleteInterconnectVirtualNetworkConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/connectivity/virtual-network-connections/{connection-name}` | getInterconnectVirtualNetworkConnection | Multicloud Interconnect - Connectivity | read | Read (needs IDs) | path: connection-name |
| PUT | `/dataservice/multicloud/interconnect/connectivity/virtual-network-connections/{connection-name}` | updateInterconnectVirtualNetworkConnection | Multicloud Interconnect - Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/entitlement/licenses` | getInterconnectLicenses | Multicloud Interconnect - Entitlement | read | Read (needs input) | query: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/gateways/device-chassis-numbers` | getAvailableDevicesOrByCGId_MulticloudInterconnectGateways_7603 | Multicloud Interconnect - Gateways | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/gateways/devices` | getInterconnectGatewayDevices | Multicloud Interconnect - Gateways | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/gateways` | getInterconnectGateways | Multicloud Interconnect - Gateways | read | Verified live | 0 rows |
| POST | `/dataservice/multicloud/interconnect/gateways` | createInterconnectGateway | Multicloud Interconnect - Gateways | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/multicloud/interconnect/gateways/{interconnect-gateway-name}` | deleteInterconnectGateway | Multicloud Interconnect - Gateways | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/gateways/{interconnect-gateway-name}` | getInterconnectGateway | Multicloud Interconnect - Gateways | read | Read (needs IDs) | path: interconnect-gateway-name |
| PUT | `/dataservice/multicloud/interconnect/gateways/{interconnect-gateway-name}` | updateInterconnectGateway_MulticloudInterconnectGateways_6103 | Multicloud Interconnect - Gateways | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/gateways/{interconnect-gateway-name}/settings` | getInterconnectGatewayCustomSettings | Multicloud Interconnect - Gateways | read | Read (needs IDs) | path: interconnect-gateway-name |
| POST | `/dataservice/multicloud/interconnect/gateways/config-group` | createInterconnectGatewayConfigGroup | Multicloud Interconnect - Gateways | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/gateways/image-names` | getInterconnectGatewayImageNames | Multicloud Interconnect - Gateways | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Can not process request further","code":"MCERR001","details":"No accounts found for Interconnect |
| GET | `/dataservice/multicloud/interconnect/gateways/instance-sizes` | getInterconnectGatewayInstanceSizes | Multicloud Interconnect - Gateways | read | Verified live | 3 rows |
| POST | `/dataservice/multicloud/interconnect/gateways/push-config` | pushInterconnectGatewayConfig | Multicloud Interconnect - Gateways | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/gateways/types` | getInterconnetGatewayTypes | Multicloud Interconnect - Gateways | read | Verified live | 1 rows |
| PUT | `/dataservice/v1/multicloud/interconnect/gateways/{interconnect-gateway-name}` | updateInterconnectGateway_MulticloudInterconnectGateways_6403 | Multicloud Interconnect - Gateways | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/config-group/{config-group-id}/topology` | getInterconnectConfigGroupTopology | Multicloud Interconnect - General | read | Read (needs IDs) | path: interconnect-type, config-group-id |
| PUT | `/dataservice/multicloud/interconnect/{interconnect-type}/config-group/{config-group-id}/topology` | updateInterconnectConfigGroupTopology | Multicloud Interconnect - General | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/dashboard` | getInterconnectDashboard | Multicloud Interconnect - General | read | Verified live | 0 rows |
| GET | `/dataservice/multicloud/interconnect/ip-transit` | getInterconnectIpTransit | Multicloud Interconnect - General | read | Read (needs input) | query: interconnect-service-type |
| GET | `/dataservice/multicloud/interconnect/sshkeys` | getInterconnectSshKeys | Multicloud Interconnect - General | read | Read (needs input) | query: interconnect-provider-name |
| GET | `/dataservice/multicloud/interconnect/types` | getInterconnectTypes | Multicloud Interconnect - General | read | Verified live | 2 rows |
| GET | `/dataservice/multicloud/interconnect/colors/{tunnel-type}` | getInterconnectColors | Multicloud Interconnect - Global Settings | read | Read (needs IDs) | path: tunnel-type |
| GET | `/dataservice/multicloud/interconnect/settings/global` | getInterconnectGlobalSettings | Multicloud Interconnect - Global Settings | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Can not process request further","code":"MCERR001","details":"Failed to get edge global settings |
| POST | `/dataservice/multicloud/interconnect/settings/global` | addInterconnectGlobalSettings | Multicloud Interconnect - Global Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/multicloud/interconnect/settings/global` | updateInterconnectGlobalSettings | Multicloud Interconnect - Global Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/monitoring/connected-sites` | getMonitoringInterconnectConnectedSites | Multicloud Interconnect - Monitoring | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/monitoring/devices` | getMonitoringInterconnectDevices | Multicloud Interconnect - Monitoring | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/monitoring/gateways` | getMonitoringInterconnectGateways | Multicloud Interconnect - Monitoring | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/{interconnect-type}/widget` | getInterconnectWidget | Multicloud Interconnect - Monitoring | read | Read (needs IDs) | path: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/widget` | getAllInterconnectWidgets | Multicloud Interconnect - Monitoring | read | Verified live | 2 rows |
| GET | `/dataservice/multicloud/interconnect/audit` | getAuditReport | Multicloud Interconnect - Resource Audit | read | Read (needs input) | query: interconnect-type |
| GET | `/dataservice/multicloud/interconnect/service-sw-package` | getInterconnectServiceSwPkg | Multicloud Interconnect - Service Sw package types | read | Read (needs input) | query: interconnect-provider-name |
| GET | `/dataservice/multicloud/interconnect/services` | getInterconnectServices | Multicloud Interconnect - Services | read | Read (needs input) | query: interconnect-service-vendor-name |
| GET | `/dataservice/v1/network-hierarchy/{hierarchyId}/network-settings/cybervisioncenters` | getCybervisionCentersForNetworkHierarchyNode | Network Settings | read | Read (needs IDs) | path: hierarchyId |
| POST | `/dataservice/v1/network-hierarchy/{hierarchyId}/network-settings/cybervisioncenters` | createCybervisionCenterForNetworkHierarchyNode | Network Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/network-hierarchy/{hierarchyId}/network-settings/cybervisioncenters/{cvId}` | deleteCybervisionCenterForNetworkHierarchyNode | Network Settings | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/network-hierarchy/{hierarchyId}/network-settings/cybervisioncenters/id` | GetCybervisionCenterIDByName | Network Settings | read | Read (needs IDs) | path: hierarchyId |
| GET | `/dataservice/device/cellular/counter` | cellularCountDashlet | Overview - Cellular | read | Verified live | object |
| GET | `/dataservice/device/cellular/dataUsage` | dataUsage | Overview - Cellular | read | Verified live | object |
| GET | `/dataservice/device/cellular/details` | cellularCountDashletDetails | Overview - Cellular | read | Verified live | object |
| GET | `/dataservice/device/cellular/health` | cellularHealthDashlet | Overview - Cellular | read | Verified live | object |
| GET | `/dataservice/device/ppl/dashlet` | pplDashlet | Overview - PPL | read | Verified live | object |
| GET | `/dataservice/device/ppl/detailList` | detailList | Overview - PPL | read | Verified live | object |
| GET | `/dataservice/device/ppl/segmentDetail` | segmentDetail | Overview - PPL | read | Verified live | object |
| GET | `/dataservice/partner/aci/policy` | getACIDefinitions | Partner - ACI Policy Builder | read | Verified live | 0 rows |
| DELETE | `/dataservice/partner/aci/policy/dscpmapping/{partnerId}` | deleteDscpMappings | Partner - ACI Policy Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/aci/policy/dscpmapping/{partnerId}` | getDscpMappings | Partner - ACI Policy Builder | read | Read (needs IDs) | path: partnerId |
| POST | `/dataservice/partner/aci/policy/dscpmapping/{partnerId}` | createDscpMappings | Partner - ACI Policy Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/aci/policy/events/{partnerId}` | getEvents_PartnerAciPolicyBuilder_3803 | Partner - ACI Policy Builder | read | Read (needs IDs) | path: partnerId |
| GET | `/dataservice/partner/aci/policy/prefixmapping/{partnerId}` | getDataPrefixMappings | Partner - ACI Policy Builder | read | Read (needs IDs) | path: partnerId |
| POST | `/dataservice/partner/aci/policy/prefixmapping/{partnerId}` | setDataPrefixMappings | Partner - ACI Policy Builder | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/aci/policy/sequences` | getDataPrefixSequences | Partner - ACI Policy Builder | read | Verified live | object |
| POST | `/dataservice/partner/dnac/sda/config/{partnerId}` | createSDAConfig | Partner - DNAC SDA API | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/dnac/sda/device/{partnerId}` | getSDAEnabledDevices | Partner - DNAC SDA API | read | Read (needs IDs) | path: partnerId |
| GET | `/dataservice/partner/dnac/sda/device/{partnerId}/{uuid}` | getDeviceDetails | Partner - DNAC SDA API | read | Read (needs IDs) | path: partnerId, uuid |
| POST | `/dataservice/partner/dnac/sda/netconfconfig/{partnerId}` | createSDAConfigFromNetconf | Partner - DNAC SDA API | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/dnac/sda/site/{partnerId}` | getSitesForPartner | Partner - DNAC SDA API | read | Read (needs IDs) | path: partnerId |
| GET | `/dataservice/partner/dnac/sda/vpn` | getOverlayVPNList | Partner - DNAC SDA API | read | Verified live | 9 rows |
| GET | `/dataservice/partner` | getPartners | Partner - Registration | read | Verified live | 0 rows |
| GET | `/dataservice/partner/{partnerType}` | getPartnersByPartnerType | Partner - Registration | read | Read (needs IDs) | path: partnerType |
| POST | `/dataservice/partner/{partnerType}` | registerPartner | Partner - Registration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/partner/{partnerType}/{nmsId}` | deletePartner | Partner - Registration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/{partnerType}/{nmsId}` | getPartner | Partner - Registration | read | Read (needs IDs) | path: partnerType, nmsId |
| PUT | `/dataservice/partner/{partnerType}/{nmsId}` | updatePartner | Partner - Registration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/partner/{partnerType}/map/{nmsId}` | unmapDevices | Partner - Registration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/{partnerType}/map/{nmsId}` | getPartnerDevices | Partner - Registration | read | Read (needs IDs) | path: partnerType, nmsId |
| POST | `/dataservice/partner/{partnerType}/map/{nmsId}` | mapDevices | Partner - Registration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/partner/{partnerType}/unmap/{nmsId}` | deleteDeviceMapping | Partner - Registration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/partner/vpn` | getVPNList | Partner - Registration | read | Verified live | 4 rows |
| GET | `/dataservice/serverlongpoll/event/poll/{partnerId}` | getDataChangeInfo | Partner - Registration | read | Read (needs IDs) | path: partnerId |
| POST | `/dataservice/partner/wcm/netconf/{nmsId}` | pushNetconfConfigs | Partner - WCM Configs | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/policy-group` | GetPolicyGroupBySolution | Policy - Policy Group | read | Verified live | 2 rows |
| POST | `/dataservice/v1/policy-group` | CreatePolicyGroup | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/policy-group/{policyGroupId}` | DeletePolicyGroup | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/policy-group/{policyGroupId}` | GetPolicyGroup | Policy - Policy Group | read | Read (needs IDs) | path: policyGroupId |
| PUT | `/dataservice/v1/policy-group/{policyGroupId}` | EditPolicyGroup | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/policy-group/{policyGroupId}/device/{deviceId}/preview` | getPolicyGroupDeviceConfigurationPreview | Policy - Policy Group | read | Read (needs IDs) | path: policyGroupId, deviceId |
| DELETE | `/dataservice/v1/policy-group/{policyGroupId}/device/associate` | DeletePolicyGroupAssociation | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/policy-group/{policyGroupId}/device/associate` | GetPolicyGroupAssociation | Policy - Policy Group | read | Read (needs IDs) | path: policyGroupId |
| POST | `/dataservice/v1/policy-group/{policyGroupId}/device/associate` | CreatePolicyGroupAssociation | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/v1/policy-group/{policyGroupId}/device/associate` | UpdatePolicyGroupAssociation | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/policy-group/{policyGroupId}/device/deploy` | deployPolicyGroup | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/policy-group/{policyGroupId}/device/variables` | getPolicyGroupDeviceVariables | Policy - Policy Group | read | Read (needs IDs) | path: policyGroupId |
| POST | `/dataservice/v1/policy-group/{policyGroupId}/device/variables` | fetchPolicyGroupDeviceVariables | Policy - Policy Group | read | Read (needs IDs) | path: policyGroupId |
| PUT | `/dataservice/v1/policy-group/{policyGroupId}/device/variables` | createPolicyGroupDeviceVariables | Policy - Policy Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/policy-group/{policyGroupId}/device/variables/schema` | getPolicyGroupDeviceVariablesSchema | Policy - Policy Group | read | Read (needs IDs) | path: policyGroupId |
| GET | `/dataservice/v1/policy-group/{policyGroupId}/rules` | getRuleAssociationByPolicyGroupId | Policy - Policy Group | read | Read (needs IDs) | path: policyGroupId |
| GET | `/dataservice/sdavc/protocol-pack/compliance/all-devices` | getAllSDAVCDevice | Protocol Pack Compliance | read | Verified live | object |
| GET | `/dataservice/sdavc/protocol-pack/compliance/application` | getDefaultApplicationComplianceDetails | Protocol Pack Compliance | read | Verified live | 0 rows |
| GET | `/dataservice/sdavc/protocol-pack/compliance/application/{uuid}` | getApplicationComplianceDetails | Protocol Pack Compliance | read | Read (needs IDs) | path: uuid |
| POST | `/dataservice/sdavc/protocol-pack/compliance/application/initiate-compliance` | initiateApplicationComplianceCheck | Protocol Pack Compliance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/protocol-pack/compliance/application/is-compliance-detected` | isApplicationComplianceDetected | Protocol Pack Compliance | read | Verified live | object |
| GET | `/dataservice/sdavc/protocol-pack/compliance/application/status/{uuid}` | getApplicationComplianceStatus | Protocol Pack Compliance | read | Read (needs IDs) | path: uuid |
| GET | `/dataservice/sdavc/protocol-pack/compliance/custom-application` | getCustomApplicationList | Protocol Pack Compliance | read | Verified live | object |
| POST | `/dataservice/sdavc/protocol-pack/compliance/device/noncompliant` | getNonCompliantDevicesForProtocolPack_ProtocolPackCompliance_5104 | Protocol Pack Compliance | read | Read (needs input) | query body |
| GET | `/dataservice/sdavc/protocol-pack/compliance/device/noncompliant/{protocolPackName}` | getNonCompliantDevicesForProtocolPack_ProtocolPackCompliance_7003 | Protocol Pack Compliance | read | Read (needs IDs) | path: protocolPackName |
| GET | `/dataservice/sdavc/protocol-pack/compliance/device/status/{uuid}` | getDeviceComplianceStatus_ProtocolPackCompliance_5203 | Protocol Pack Compliance | read | Read (needs IDs) | path: uuid |
| POST | `/dataservice/sdavc/protocol-pack/compliance/initiate-device-compliance` | initiateDeviceCompliance | Protocol Pack Compliance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sdavc/protocol-pack/compliance/initiate-policy-compliance` | initiatePolicyCompliance | Protocol Pack Compliance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/protocol-pack/compliance/new-application/{deviceUUID}` | getNewApplicationList | Protocol Pack Compliance | read | Read (needs IDs) | path: deviceUUID |
| GET | `/dataservice/sdavc/protocol-pack/compliance/policy` | getCompliancePolicy | Protocol Pack Compliance | read | Verified live | 3 rows |
| GET | `/dataservice/sdavc/protocol-pack/compliance/policy/status/{uuid}` | getPolicyComplianceStatus | Protocol Pack Compliance | read | Read (needs IDs) | path: uuid |
| GET | `/dataservice/sdavc/protocol-pack` | getAllProtocolPacks | Protocol Pack Maintenance | read | Verified live | object |
| DELETE | `/dataservice/sdavc/protocol-pack/{protocolPackName}` | deleteProtocolPack | Protocol Pack Maintenance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/protocol-pack/base` | getBaseSystemPack | Protocol Pack Maintenance | read | Verified live | 1 rows |
| GET | `/dataservice/sdavc/protocol-pack/default` | getDefaultSystemPack | Protocol Pack Maintenance | read | Verified live | 3 rows |
| GET | `/dataservice/sdavc/protocol-pack/latest` | getLatestSystemPack | Protocol Pack Maintenance | read | Verified live | object |
| POST | `/dataservice/sdavc/protocol-pack/maintenance/upgrade` | upgradeProtocolPack | Protocol Pack Maintenance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sdavc/protocol-pack/maintenance/upgrade/cancel` | cancelScheduledDeployJob | Protocol Pack Maintenance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/protocol-pack/maintenance/upgrade/status` | getDeployJobStatus_ProtocolPackMaintenance_4703 | Protocol Pack Maintenance | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Failed to get deploy job status","code":"PP0008","details":"No task(s) found"}} |
| GET | `/dataservice/sdavc/protocol-pack/maintenance/upgrade/status/{uuid}` | getDeployJobStatus_ProtocolPackMaintenance_5403 | Protocol Pack Maintenance | read | Read (needs IDs) | path: uuid |
| POST | `/dataservice/sdavc/protocol-pack/maintenance/upload` | uploadProtocolPack | Protocol Pack Maintenance | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| POST | `/dataservice/sdavc/protocol-pack/maintenance/upload/cancel/{uuid}` | cancelProtocolPackUpload | Protocol Pack Maintenance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/sdavc/protocol-pack/maintenance/upload/confirm/{uuid}` | confirmProtocolPackUpload | Protocol Pack Maintenance | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/protocol-pack/maintenance/upload/status/{uuid}` | getProtocolPackUploadStatus | Protocol Pack Maintenance | read | Read (needs IDs) | path: uuid |
| GET | `/dataservice/radkit/authorizations` | getAuthorizations | Radkit | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Bad request","code":"REST0002","details":"Radkit is disabled. Please enable Radkit to use remote |
| POST | `/dataservice/radkit/authorizations` | createAuthorization | Radkit | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/radkit/authorizations` | updateAuthorization | Radkit | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/radkit/authorizations/cancel` | cancelAuthorization | Radkit | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/gnss/gnss-devices` | getGnssDevices | Real Time Monitoring - GNSS | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/gnss/gnss-location` | getGnssLocation | Real Time Monitoring - GNSS | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/gnss/gnss-satellite` | getGnssSatellite | Real Time Monitoring - GNSS | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/gnss/gnss-status` | getGnssStatus | Real Time Monitoring - GNSS | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/gnss/gnss-time` | getGnssTime | Real Time Monitoring - GNSS | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/rawsocket/tcp-session` | getTcpSession | Real Time Monitoring - Raw Socket | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/rawsocket/tcp-session-local` | getTcpSessionLocal | Real Time Monitoring - Raw Socket | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/rawsocket/tcp-statistics` | getTcpStatistics | Real Time Monitoring - Raw Socket | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/rawsocket/udp-session` | getUdpSession | Real Time Monitoring - Raw Socket | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/rawsocket/udp-session-local` | getUdpSessionLocal | Real Time Monitoring - Raw Socket | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/rawsocket/udp-statistics` | getUdpStatistics | Real Time Monitoring - Raw Socket | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/aaa/servers` | getAAAservers | Real-Time Monitoring - AAA | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/aaa/users` | getAAAUsers | Real-Time Monitoring - AAA | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/acl/matchcounter` | getACLMatchCounterUsers | Real-Time Monitoring - AAA | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/logging` | getLoggingFromDevice | Real-Time Monitoring - AAA | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/unclaimed/vedges` | getUnclaimedVedges | Real-Time Monitoring - AAA | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/users` | getUsersFromDevice | Real-Time Monitoring - AAA | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/users/list` | getAllDeviceUsers | Real-Time Monitoring - AAA | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/app-hosting/attached-devices` | getAppHostingAttachedDevices | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/device/app-hosting/details` | getAppHostingDetails | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/app-hosting/guest-routes` | getAppHostingGuestRoutes | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/app-hosting/network-interfaces` | getAppHostingNetworkDevices | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/app-hosting/network-utilization` | getAppHostingNetworkUtils | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/app-hosting/processes` | getAppHostingProcesses | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/app-hosting/storage-utilization` | getAppHostingStorageUtils | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/app-hosting/utilization` | getAppHostingUtilization | Real-Time Monitoring - App Hosting | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/app/log/flow-count` | getAppLogFlowCount | Real-Time Monitoring - App Logs | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/app/log/flows` | getAppLogFlows | Real-Time Monitoring - App Logs | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/app-route/sla-class` | createAppRouteSlaClassList | Real-Time Monitoring - Application-Aware Route | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/app-route/statistics` | createAppRouteStatisticsList | Real-Time Monitoring - Application-Aware Route | read | Verified live | deviceId=<edge>: 36 rows |
| GET | `/dataservice/device/appqoe/active-flow-id` | createAppqoeActiveFlowIdDetails | Real-Time Monitoring - Appqoe | read | Read (needs input) | query: flow-id |
| GET | `/dataservice/device/appqoe/appqoe-hput-stats` | getAppqoeHputStats | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/appqoe-nat-stats` | getAppqoeNatStats | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/appqoe-rm-resource` | getAppqoeRmResources | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/appqoe-rm-stats` | getAppqoeRMStats | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/appqoe-services-status` | getAppqoeServicesStatus | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/appqoe-sppi-pipe-resource` | getAppqoeSppiPipeStats | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/appqoe-sppi-queue-resource` | getAppqoeSppiQueueStats | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/cluster-summary` | getAppqoeClusterSummary | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/error-recent` | getAppqoeErrorRecent | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/expired-flow-id` | createAppqoeFlowIdExpiredDetails | Real-Time Monitoring - Appqoe | read | Read (needs input) | query: flow-id |
| GET | `/dataservice/device/appqoe/flow-closed-error` | getAppqoeFlowClosedError | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/flow-expired` | getAppqoeExpired | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/service-controllers` | getAppqoeServiceControllers | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/status` | getAppqoeStatus | Real-Time Monitoring - Appqoe | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/appqoe/vpn-id` | createAppqoeVpnIdList | Real-Time Monitoring - Appqoe | read | Read (needs input) | query: vpn-id |
| GET | `/dataservice/device/arp` | getARPInterface | Real-Time Monitoring - ARP | read | Verified live | deviceId=<edge>: 27 rows |
| GET | `/dataservice/device/bfd/history` | createBFDHistoryList | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 12 rows |
| GET | `/dataservice/device/bfd/links` | createBFDLinkList | Real-Time Monitoring - BFD | read | Read (needs input) | query: state |
| GET | `/dataservice/device/bfd/sessions` | createBFDSessions | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/bfd/sites/detail` | getBFDSiteStateDetail | Real-Time Monitoring - BFD | read | Verified live | 0 rows |
| GET | `/dataservice/device/bfd/sites/summary` | getBFDSitesSummary | Real-Time Monitoring - BFD | read | Read (needs input) | query: vpnId |
| GET | `/dataservice/device/bfd/state/device` | getDeviceBFDStateSummary | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/bfd/state/device/tloc` | getDeviceBFDStateSummaryTloc | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/bfd/state/device/tlocInterfaceMap` | getDeviceTlocToIntfList | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: object |
| GET | `/dataservice/device/bfd/state/remoteSiteList` | getDeviceBFDRemoteSiteList | Real-Time Monitoring - BFD | read | Read (needs input) | query: site-id |
| GET | `/dataservice/device/bfd/status` | getDeviceBFDStatus | Real-Time Monitoring - BFD | read | Verified live | 1 rows |
| GET | `/dataservice/device/bfd/summary` | createBFDSummary | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/bfd/summary/device` | getDeviceBFDStatusSummary | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/bfd/synced/sessions` | createSyncedBFDSession | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/bfd/tloc` | createTLOCSummary | Real-Time Monitoring - BFD | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/bfd/tloc/detail` | getBFDTlocStateDetail | Real-Time Monitoring - BFD | read | Verified live | 32 rows |
| GET | `/dataservice/device/bgp/neighbors` | createBGPNeighborsList | Real-Time Monitoring - BGP | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/bgp/routes` | createBGPRoutesList | Real-Time Monitoring - BGP | read | Verified live | deviceId=<edge>: 16 rows |
| GET | `/dataservice/device/bgp/summary` | createBGPSummary | Real-Time Monitoring - BGP | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/bridge/interface` | getBridgeInterfaceList | Real-Time Monitoring - Bridge | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/bridge/mac` | getBridgeInterfaceMac | Real-Time Monitoring - Bridge | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/bridge/table` | getBridgeInterfaceTable | Real-Time Monitoring - Bridge | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/connection` | createCellularConnectionList | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/dyingGasp` | getCellularDgList | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/gps` | getCellularGpsList | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/hardware` | createHardwareList_RealTimeMonitoringCellular_2503 | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/modem` | createModemList | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/network` | createNetworkList_RealTimeMonitoringCellular_2403 | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/profiles` | createProfileList | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/radio` | createRadioList_RealTimeMonitoringCellular_2203 | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/sessions` | createSessionsList | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/status` | getCellularStatusList | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/ursp/routes` | getCellularUrspRoutes | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellular/ursp/rules` | getCellularUrspRules | Real-Time Monitoring - Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cellularEiolte/ipsec/interface/counters` | getAONIpsecInterfaceCountersInfo | Real-Time Monitoring - Cellular AON Ipsec Interface  | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/cellularEiolte/ipsec/interface/session` | getAONIpsecInterfaceSessionnfo | Real-Time Monitoring - Cellular AON Ipsec Interface  | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/cellularEiolte/connections` | getEiolteConnectionInfo | Real-Time Monitoring - Cellular EIOLTE Connection Service | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/cellularEiolte/radio` | getEiolteRadioInfo | Real-Time Monitoring - Cellular EIOLTE Connection Service | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/cellularEiolte/hardware` | getEiolteHardwareInfo | Real-Time Monitoring - Cellular EIOLTE Hardware Service  | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/cellularEiolte/network` | getEiolteNetworkInfo | Real-Time Monitoring - Cellular EIOLTE Network Service | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/cellularEiolte/sim` | getEiolteSimInfo | Real-Time Monitoring - Cellular EIOLTE Sim Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cfm/mp/database` | getMpDatabase | Real-Time Monitoring - CFM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cfm/mp/local/mep` | getMpLocalMep | Real-Time Monitoring - CFM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cfm/mp/local/mip` | getMpLocalMip | Real-Time Monitoring - CFM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cfm/mp/remotemep` | getMpRemoteMep | Real-Time Monitoring - CFM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cloudx/application/detail` | createApplicationsDetailList | Real-Time Monitoring - CloudExpress | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Cannot invoke \"com.viptela.vmanage.server.model. |
| GET | `/dataservice/device/cloudx/applications` | createApplicationsList | Real-Time Monitoring - CloudExpress | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Cannot invoke \"com.viptela.vmanage.server.model. |
| GET | `/dataservice/device/cloudx/gatewayexits` | createGatewayExitsList | Real-Time Monitoring - CloudExpress | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/cloudx/loadbalance` | createLbApplicationsList | Real-Time Monitoring - CloudExpress | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Cannot invoke \"com.viptela.vmanage.server.model. |
| GET | `/dataservice/device/cloudx/localexits` | createLocalExitsList | Real-Time Monitoring - CloudExpress | read | Verified live | deviceId=<edge>: 50 rows |
| GET | `/dataservice/device/configuration/commit-list` | getDeviceConfigurationCommitList | Real-Time Monitoring - Commit List | read | Verified live | deviceId=<edge>: 50 rows |
| GET | `/dataservice/device/csp/containers/container` | createDeviceContainersInfo | Real-Time Monitoring - Container Lifecycle | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/crashlog` | getDeviceCrashLogs | Real-Time Monitoring - Crash Log | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/crashlog/details` | getAllDeviceCrashLogs | Real-Time Monitoring - Crash Log | read | Verified live | 1 rows |
| GET | `/dataservice/device/crashlog/log` | getDeviceCrashInformation | Real-Time Monitoring - Crash Log | read | Read (needs input) | query: filename |
| GET | `/dataservice/device/crashlog/synced` | getDeviceCrashLogsSynced | Real-Time Monitoring - Crash Log | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipv6/nd6` | getIpv6Data | Real-Time Monitoring - Device | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/control/affinity/config` | getAffinityConfig | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/control/affinity/status` | getAffinityStatus | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/control/connections` | createRealTimeConnectionList_RealTimeMonitoringDeviceControl_2703 | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 5 rows |
| GET | `/dataservice/device/control/connectionshistory` | createConnectionHistoryListRealTime | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 3 rows |
| GET | `/dataservice/device/control/connectionsinfo` | createRealTimeConnectionList_RealTimeMonitoringDeviceControl_3103 | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/control/count` | getTotalCountForDeviceStates | Real-Time Monitoring - Device Control | read | Verified live | 1 rows |
| GET | `/dataservice/device/control/links` | createLinkList | Real-Time Monitoring - Device Control | read | Read (needs input) | query: state |
| GET | `/dataservice/device/control/localproperties` | createLocalPropertiesListListRealTIme | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/control/networksummary` | networkSummary | Real-Time Monitoring - Device Control | read | Verified live | 0 rows |
| GET | `/dataservice/device/control/regionconnections` | createRealTimeRegionConnectionList | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/control/statistics` | getConnectionStatistics | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/control/status` | getLocalDeviceStatus | Real-Time Monitoring - Device Control | read | Verified live | 1 rows |
| GET | `/dataservice/device/control/summary` | createConnectionsSummary | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/control/summary/device` | getDeviceControlStatusSummary | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/control/synced/connections` | createSyncedConnectionList | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 5 rows |
| GET | `/dataservice/device/control/synced/localproperties` | createLocalPropertiesSyncedList | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/control/synced/waninterface` | createWanInterfaceSyncedList | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/control/validdevices` | createValidDevicesListRealTime | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<controller>: 47 rows |
| GET | `/dataservice/device/control/validvmanageid` | getValidVManageIdRealTime | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/control/validvsmarts` | createValidVSmartsListRealTime | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<controller>: 3 rows |
| GET | `/dataservice/device/control/waninterface` | createWanInterfaceListList | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/control/waninterface/color` | getPortHopColor | Real-Time Monitoring - Device Control | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/featurelist` | getFeatureList | Real-Time Monitoring - Device Feature List | read | Verified live | deviceId=<edge>: 50 rows |
| GET | `/dataservice/device/featurelist/synced` | getSyncedFeatureList | Real-Time Monitoring - Device Feature List | read | Verified live | deviceId=<edge>: 50 rows |
| GET | `/dataservice/statistics/system` | getStatDataRawData_RealTimeMonitoringDeviceSystemStats_1803 | Real-Time Monitoring - Device System Stats | read | Verified live | 10000 rows |
| POST | `/dataservice/statistics/system` | getStatsRawData_RealTimeMonitoringDeviceSystemStats_1804 | Real-Time Monitoring - Device System Stats | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/system/aggregation` | getAggregationDataByQuery_RealTimeMonitoringDeviceSystemStats_3003 | Real-Time Monitoring - Device System Stats | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/system/aggregation` | getPostAggregationDataByQuery_RealTimeMonitoringDeviceSystemStats_3004 | Real-Time Monitoring - Device System Stats | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/system/cpu` | createDeviceSystemCPUStat | Real-Time Monitoring - Device System Stats | read | Read (needs input) | query: query |
| GET | `/dataservice/statistics/system/csv` | getStatDataRawDataAsCSV_RealTimeMonitoringDeviceSystemStats_2203 | Real-Time Monitoring - Device System Stats | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/system/doccount` | getCount_RealTimeMonitoringDeviceSystemStats_2703 | Real-Time Monitoring - Device System Stats | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/system/doccount` | getCountPost_RealTimeMonitoringDeviceSystemStats_2704 | Real-Time Monitoring - Device System Stats | read | Verified live | object |
| GET | `/dataservice/statistics/system/fields` | getStatDataFields_RealTimeMonitoringDeviceSystemStats_2503 | Real-Time Monitoring - Device System Stats | read | Verified live | object |
| GET | `/dataservice/statistics/system/memory` | createDeviceSystemMemoryStat | Real-Time Monitoring - Device System Stats | read | Read (needs input) | query: query |
| GET | `/dataservice/statistics/system/page` | getStatsPaginationRawData_RealTimeMonitoringDeviceSystemStats_2303 | Real-Time Monitoring - Device System Stats | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/system/page` | getPostStatsPaginationRawData_RealTimeMonitoringDeviceSystemStats_2304 | Real-Time Monitoring - Device System Stats | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/system/query/fields` | getStatQueryFields_RealTimeMonitoringDeviceSystemStats_3103 | Real-Time Monitoring - Device System Stats | read | Verified live | 1 rows |
| GET | `/dataservice/device/vlan` | getNativeVlanInfo | Real-Time Monitoring - device/vlan | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dhcp/client` | getDHCPClient | Real-Time Monitoring - DHCP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/dhcp/interface` | getDHCPInterface | Real-Time Monitoring - DHCP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dhcp/server` | getDHCPServer | Real-Time Monitoring - DHCP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dhcpv6/interface` | getDHCPv6Interface | Real-Time Monitoring - DHCP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dns/defense/device-registration` | getDnsDefenseDeviceRegistration | Real-Time Monitoring - Dns Defense | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dns/defense/info` | getDnsDefenseInfo | Real-Time Monitoring - Dns Defense | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dot1x/clients` | getWLANDOT1xClients | Real-Time Monitoring - DOT1x | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dot1x/interfaces` | getWLANDOT1xInterfaces | Real-Time Monitoring - DOT1x | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dot1x/radius` | getDOT1xRadius | Real-Time Monitoring - DOT1x | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dpi/application-mapping` | getSupportedApplicationList | Real-Time Monitoring - DPI | read | Verified live | 1568 rows |
| GET | `/dataservice/device/dpi/application/fields` | getDPIDeviceFieldJSON | Real-Time Monitoring - DPI | read | Verified live | 2 rows |
| GET | `/dataservice/device/dpi/applications` | createDPICollectorList | Real-Time Monitoring - DPI | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dpi/common/applications` | getCommonApplicationList | Real-Time Monitoring - DPI | read | Verified live | 1480 rows |
| GET | `/dataservice/device/dpi/device/fields` | getDPIFieldJSON | Real-Time Monitoring - DPI | read | Verified live | 2 rows |
| GET | `/dataservice/device/dpi/devicedetails/fields` | getDPIDeviceDetailsFieldJSON | Real-Time Monitoring - DPI | read | Verified live | 3 rows |
| GET | `/dataservice/device/dpi/flows` | createDPIFlowsList | Real-Time Monitoring - DPI | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dpi/qosmos-static/applications` | getQosmosStaticApplicationList | Real-Time Monitoring - DPI | read | Verified live | 3427 rows |
| GET | `/dataservice/device/dpi/qosmos/applications` | getQosmosApplicationList | Real-Time Monitoring - DPI | read (deprecated) | Verified live | 1495 rows |
| GET | `/dataservice/device/dpi/summary` | createDPISummaryRealTime | Real-Time Monitoring - DPI | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/dpi/supported-applications` | createDPIStatistics | Real-Time Monitoring - DPI | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dre/auto-bypass-stats` | getDreAutoBypassStats | Real-Time Monitoring - DRE | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dre/dre-stats` | getDreStats | Real-Time Monitoring - DRE | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dre/dre-status` | getDreStatus | Real-Time Monitoring - DRE | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dre/peer-stats` | getDrePeerStats | Real-Time Monitoring - DRE | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/dualStaticRouteTracker` | getDualStaticRouteTrackerInfo | Real-Time Monitoring - Dual Static Route Tracker Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/eigrp/interface` | createEIGRPInterface | Real-Time Monitoring - EIGRP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/eigrp/route` | createEIGRPRoute | Real-Time Monitoring - EIGRP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/eigrp/topology` | createEIGRPTopology | Real-Time Monitoring - EIGRP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/endpointTrackerGroup` | getEndpointTrackerGroupInfo | Real-Time Monitoring - Endpoint Tracker Group Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/endpointTracker` | getEndpointTrackerInfo | Real-Time Monitoring - Endpoint Tracker Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/geofence/status` | getGeofenceStatus | Real-Time Monitoring - Geo-fencing | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/hardware/alarms` | createAlarmList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/hardware/environment` | createEnvironmentList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/hardware/errors` | createErrorAlarmList | Real-Time Monitoring - Hardware | read | Verified live | 0 rows |
| GET | `/dataservice/device/hardware/inventory` | createInventoryList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 5 rows |
| GET | `/dataservice/device/hardware/status/summary` | createStatusSummary | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/hardware/synced/alarms` | createSyncedAlarmList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/hardware/synced/environment` | createSyncedEnvironmentList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/hardware/synced/inventory` | createSyncedInventoryList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 5 rows |
| GET | `/dataservice/device/hardware/system` | createSystemList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/hardware/threshold` | createTempThresholdList | Real-Time Monitoring - Hardware | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/igmp/groups` | createIGMPGroupsList | Real-Time Monitoring - IGMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/igmp/interface` | createIGMPInterfaceList | Real-Time Monitoring - IGMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/igmp/statistics` | createIGMPStatisticsList | Real-Time Monitoring - IGMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/igmp/summary` | createIGMPSummary | Real-Time Monitoring - IGMP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/ignition/status` | getIgnitionStatus | Real-Time Monitoring - Ignition Status | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/insecure-config` | getDeviceInsecureConfiguration | Real-Time Monitoring - Insecure Device Configuration | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface` | getDeviceInterface | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 12 rows |
| GET | `/dataservice/device/interface/arp_stats` | getDeviceInterfaceARPStats | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface/config` | getDeviceInterfaceRunningConfig | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 7 rows |
| GET | `/dataservice/device/interface/error_stats` | getDeviceInterfaceErrorStats | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface/ipv6Stats` | getDeviceInterfaceIpv6Stats | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 12 rows |
| GET | `/dataservice/device/interface/pkt_size` | getDeviceInterfacePktSizes | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface/port_stats` | getDeviceInterfacePortStats | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface/qosStats` | getDeviceInterfaceQosStats | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/interface/queue_stats` | getDeviceInterfaceQueueStats | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface/serial` | getDeviceSerialInterface | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface/stats` | getDeviceInterfaceStats | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 12 rows |
| GET | `/dataservice/device/interface/synced` | getSyncedDeviceInterface | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 12 rows |
| GET | `/dataservice/device/interface/trustsec` | trustsec | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/interface/vpn` | generateDeviceInterfaceVPN | Real-Time Monitoring - Interface | read | Verified live | deviceId=<edge>: 12 rows |
| GET | `/dataservice/device/ip/fib` | createFibList | Real-Time Monitoring - IP | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/ip/ipRoutes` | createIetfRoutingList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 56 rows |
| GET | `/dataservice/device/ip/mfiboil` | createIPMfibOilList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ip/mfibstats` | createIPMfibStatsList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ip/mfibsummary` | createIPMfibSummaryList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ip/nat/filter` | createNatFilterList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ip/nat/interface` | createNatInterfaceList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ip/nat/interfacestatistics` | createNatInterfaceStatisticsList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/ip/nat/translation` | createNatTranslationList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 402 rows |
| GET | `/dataservice/device/ip/nat64/translation` | createNat64TranslationList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ip/routetable` | createRouteTableList | Real-Time Monitoring - IP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/identity` | createCryptoIpsecIdentity | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/ipsec/ike/inbound` | createIkeInboundList | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/ike/outbound` | createIkeOutboundList | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/ike/sessions` | createIkeSessions | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/ikev1` | createCryptov1LocalSAList | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/ikev2` | createCryptov2LocalSAList | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/inbound` | createInBoundList | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/ipsec/localsa` | createLocalSAList | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/ipsec/outbound` | createOutBoundList | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/ipsec/pwk/inbound` | createIPsecPWKInboundConnections | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/pwk/localsa` | createIPsecPWKLocalSA | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ipsec/pwk/outbound` | createIPsecPWKOutboundConnections | Real-Time Monitoring - IPsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ip/v4fib` | createIPv4FibList | Real-Time Monitoring - IPv4 FIB | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/ip/v6fib` | createIPv6FibList | Real-Time Monitoring - IPv6 FIB | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/ndv6` | getIpv6Interface | Real-Time Monitoring - IPv6 Neighbours | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/lacp/info` | getLacpInterfaceList | Real-Time Monitoring - Lacp | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/lacp/members` | getLacpMembers | Real-Time Monitoring - Lacp | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/license/evaluation` | getLicenseEvalInfo | Real-Time Monitoring - License Info | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/license/pak` | getLicensePAKInfo | Real-Time Monitoring - License Info | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/license/privacy` | getLicensePrivacyInfo | Real-Time Monitoring - License Info | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/license/registration` | getLicenseRegInfo | Real-Time Monitoring - License Info | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/license/udi` | getLicenseUDIInfo | Real-Time Monitoring - License Info | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/license/usage` | getLicenseUsageInfo | Real-Time Monitoring - License Info | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/system/lpshield` | getDeviceLpshield | Real-Time Monitoring - Lpshield | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/multicast/replicator` | createReplicatorList | Real-Time Monitoring - Multicast | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/multicast/rpf` | createRpfList | Real-Time Monitoring - Multicast | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/multicast/topology` | createTopologyList | Real-Time Monitoring - Multicast | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/multicast/tunnel` | createPimTunnelList | Real-Time Monitoring - Multicast | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/csp/resources/cpu-info/allocation` | getAllocationInfo | Real-Time Monitoring - NetworkHub Resources | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/csp/resources/cpu-info/cpus` | getCPUInfo | Real-Time Monitoring - NetworkHub Resources | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/csp/resources/cpu-info/vnfs` | getVNFInfo | Real-Time Monitoring - NetworkHub Resources | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/ngfw/engine-status` | getNgfwEngineStatus | Real-Time Monitoring - Next Generation Firewall Update Status | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ngfw/lsp-update-status` | getNgfwLspUpdateStatus | Real-Time Monitoring - Next Generation Firewall Update Status | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ngfw/vdb-update-status` | getNgfwVdbUpdateStatus | Real-Time Monitoring - Next Generation Firewall Update Status | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ngfw/version-status` | getNgfwVersionStatus | Real-Time Monitoring - Next Generation Firewall Update Status | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/nms/running` | getRunning | Real-Time Monitoring - NMS | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ntp/associations` | createAssociationsList | Real-Time Monitoring - NTP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/ntp/peer` | createPeerList | Real-Time Monitoring - NTP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ntp/status` | createNTPStatusList | Real-Time Monitoring - NTP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/virtualApplication/te` | createTeList | Real-Time Monitoring - NTP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/virtualApplication/utd` | createUtdList | Real-Time Monitoring - NTP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/virtualApplication/waas` | createWaasList | Real-Time Monitoring - NTP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/omp/cloudx` | createOMPCloudXRecv | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/omp/links` | createOMPLinkList | Real-Time Monitoring - OMP | read | Read (needs input) | query: state |
| GET | `/dataservice/device/omp/mcastautodiscoveradvt` | createOMPMcastAutoDiscoverAdvt | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/omp/mcastautodiscoverrecv` | createOMPMcastAutoDiscoverRecv | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/omp/mcastroutesadvt` | createOMPMcastRoutesAdvt | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/omp/mcastroutesrecv` | createOMPMcastRoutesRecv | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/omp/peers` | createOMPSessionList | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/omp/routes/advertised` | createAdvertisedRoutesList | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/omp/routes/advertised/ompIpv6` | createAdvertisedRoutesListIpv6 | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/device/omp/routes/received` | createReceivedRoutesList | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 108 rows |
| GET | `/dataservice/device/omp/routes/received/ompIpv6` | createReceivedRoutesListIpv6 | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 88 rows |
| GET | `/dataservice/device/omp/services` | createOMPServices | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 16 rows |
| GET | `/dataservice/device/omp/status` | getDeviceOMPStatus | Real-Time Monitoring - OMP | read | Verified live | 1 rows |
| GET | `/dataservice/device/omp/summary` | createOMPSummary | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/omp/synced/peers` | createSyncedOMPSessionList | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 2 rows |
| GET | `/dataservice/device/omp/tlocs/advertised` | createAdvertisedTlocsList | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/device/omp/tlocs/received` | createReceivedTlocsList | Real-Time Monitoring - OMP | read | Verified live | deviceId=<edge>: 14 rows |
| GET | `/dataservice/device/orchestrator/connections` | createConnectionListFromDevice | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 16 rows |
| GET | `/dataservice/device/orchestrator/connectionshistory` | createConnectionHistoryList | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 312 rows |
| GET | `/dataservice/device/orchestrator/localproperties` | createLocalPropertiesListList | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 1 rows |
| GET | `/dataservice/device/orchestrator/proxymapping` | createReverseProxyMappingList | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 0 rows |
| GET | `/dataservice/device/orchestrator/statistics` | getStatistics | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 1 rows |
| GET | `/dataservice/device/orchestrator/summary` | createConnectionSummary | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 2 rows |
| GET | `/dataservice/device/orchestrator/validvedges` | createValidDevicesList | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 47 rows |
| GET | `/dataservice/device/orchestrator/validvmanageid` | getValidVManageId | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 1 rows |
| GET | `/dataservice/device/orchestrator/validvsmarts` | createValidVSmartsList | Real-Time Monitoring - Orchestrator | read | Verified live | deviceId=<validator>: 3 rows |
| GET | `/dataservice/device/ospf/database` | createOSPFDatabaseList | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ospf/databaseexternal` | createOSPFDatabaseExternal | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ospf/databasesummary` | createOSPFDatabaseSummaryList | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ospf/interface` | createOSPFInterface | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/ospf/neighbor` | createOSPFNeighbors | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/ospf/process` | createOSPFProcess | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ospf/routes` | createOSPFRoutesList | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ospf/v3interface` | createOSPFv3Interface | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/ospf/v3neighbor` | createOSPFv3Neighbors | Real-Time Monitoring - OSPF | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/pim/interface` | createPIMInterfaceList | Real-Time Monitoring - PIM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/pim/neighbor` | createPIMNeighborList | Real-Time Monitoring - PIM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/pim/rp-mapping` | createPIMRpMappingList | Real-Time Monitoring - PIM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/pim/statistics` | createPIMStatisticsList | Real-Time Monitoring - PIM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ppp/interface` | createPPPInterfaceList | Real-Time Monitoring - PIM | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/pki/trustpoint` | getDevicePkiTrustpoint | Real-Time Monitoring - Pki Trustpoint | read | Verified live | deviceId=<edge>: 19 rows |
| GET | `/dataservice/device/policer` | getPolicedInterface | Real-Time Monitoring - Policer | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/policy/accesslistassociations` | createPolicyAccessListAssociations | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/accesslistcounters` | createPolicyAccessListCounters | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/accesslistnames` | createPolicyAccessListNames | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/accesslistpolicers` | createPolicyAccessListPolicers | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/approutepolicyfilter` | createPolicyAppRoutePolicyFilter | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 29 rows |
| GET | `/dataservice/device/policy/datapolicyfilter` | createPolicDataPolicyFilter | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 18 rows |
| GET | `/dataservice/device/policy/filtermemoryusage` | createPolicyFilterMemoryUsage | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 52 rows |
| GET | `/dataservice/device/policy/iptosgtbindings` | showVsmartIptoSgtBinding | Real-Time Monitoring - Policy | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/policy/iptouserbindings` | showVsmartIptoUserBinding | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/ipv6/accesslistassociations` | createPolicyAccessListAssociationsIpv6 | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/ipv6/accesslistcounters` | createPolicyAccessListCountersIpv6 | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/ipv6/accesslistnames` | createPolicyAccessListNamesIpv6 | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/ipv6/accesslistpolicers` | createPolicyAccessListPolicersIpv6 | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/pxgridstatus` | showVsmartPxGridStatus | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/pxgridusersessions` | showVsmartPxGridUserSessions | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/qosmapinfo` | createPolicQosMapInfo | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/qosschedulerinfo` | createPolicQosSchedulerInfo | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/rewriteassociations` | createPolicyRewriteAssociationsInfo | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/userusergroupbindings` | showVsmartUserUsergroupBindings | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/vsmart` | showSdwanPolicyFromVsmart | Real-Time Monitoring - Policy | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/policy/zbfwdropstatistics` | getZoneDropStatistics | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/policy/zbfwstatistics` | getZbfwStatistics | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/policy/zonepairsessions` | getZonePairSessions | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/zonepairstatistics` | getZonePairs | Real-Time Monitoring - Policy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/policy/zonepolicyfilter` | getZonePolicyFilters | Real-Time Monitoring - Policy | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/powerconsumption` | getPowerConsumption | Real-Time Monitoring - Power Consumption | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/powermgmt/status` | getPowerMgmtStatus | Real-Time Monitoring - Power Management | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/powermgmt/history/daily` | getPowerMgmtHistoryDaily | Real-Time Monitoring - Power Management Daily History | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/powermgmt/history/hourly` | getPowerMgmtHistoryHourly | Real-Time Monitoring - Power Management Hourly History | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/pppoe/session` | createPPPoEInterfaceList | Real-Time Monitoring - PPPoE | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/pppoe/statistic` | createPPPoENeighborList | Real-Time Monitoring - PPPoE | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/qfp/classificationmem` | getQfpClassificationMem | Real-Time Monitoring - QFP | read | Verified live | deviceId=<edge>: 52 rows |
| GET | `/dataservice/device/qfp/classificationtcam` | getQfpClassificationTcam | Real-Time Monitoring - QFP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/qfp/cpustat` | cpustat | Real-Time Monitoring - QFP | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/device/qfp/memstat` | memstat | Real-Time Monitoring - QFP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/qfp/qfpdrop` | getQfpDrop | Real-Time Monitoring - QFP | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/qos/session/details` | getPerTunnelQosDetailedInfo | Real-Time Monitoring - QoS | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/qos/session/summary` | getPerTunnelQosSummary | Real-Time Monitoring - QoS | read | Verified live | deviceId=<edge>: 0 rows |
| POST | `/dataservice/device/qos/session/summary` | getPerTunnelQosSummaryPost | Real-Time Monitoring - QoS | read | Read (needs input) | query body |
| GET | `/dataservice/device/csp/pnic` | getPnicStats | Real-Time Monitoring - RBAC | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/csp/pnic/synced` | getPNICStatsFromDevice | Real-Time Monitoring - RBAC | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/csp/rbac` | getRBACInterface | Real-Time Monitoring - RBAC | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/reboothistory` | createRebootHistoryList | Real-Time Monitoring - Reboot History | read | Verified live | deviceId=<edge>: 10 rows |
| GET | `/dataservice/device/reboothistory/details` | getRebootHistoryDetails | Real-Time Monitoring - Reboot History | read | Verified live | 1 rows |
| GET | `/dataservice/device/reboothistory/synced` | createSyncedRebootHistoryList | Real-Time Monitoring - Reboot History | read | Verified live | deviceId=<edge>: 4 rows |
| GET | `/dataservice/device/sdwan-global-drop-statistics` | getSDWanGlobalDropStatistics | Real-Time Monitoring - SDWAN Statistics | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/sdwan-stats` | getSDWanStats | Real-Time Monitoring - SDWAN Statistics | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/security/information` | createSessionList | Real-Time Monitoring - Security | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/sfp/detail` | getDetail | Real-Time Monitoring - SFP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/sfp/diagnostic` | getDiagnostic | Real-Time Monitoring - SFP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/sfp/diagnosticMeasurementAlarm` | getDiagnosticMeasurementAlarm | Real-Time Monitoring - SFP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/sfp/diagnosticMeasurementValue` | getDiagnosticMeasurementValue | Real-Time Monitoring - SFP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ondemand/local` | getOnDemandLocal | Real-Time Monitoring - Show On Demand Local | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/ondemand/remote` | getOnDemandRemote | Real-Time Monitoring - Show On Demand Remote | read | Verified live | deviceId=<edge>: 3 rows |
| GET | `/dataservice/device/sig/getSigTunnelList` | getSigTunnelList_RealTimeMonitoringSig_2803 | Real-Time Monitoring - SIG | read | Verified live | 0 rows |
| GET | `/dataservice/device/sig/getSigTunnelTotal` | getSigTunnelTotal | Real-Time Monitoring - SIG | read | Verified live | object |
| GET | `/dataservice/device/sig/tunnelDashboard` | tunnelDashboard | Real-Time Monitoring - SIG | read | Verified live | 0 rows |
| GET | `/dataservice/device/sig/umbrella/tunnels` | getSigUmbrellaTunnels | Real-Time Monitoring - SIG | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/sig/zscaler/tunnels` | getSigZscalerTunnels | Real-Time Monitoring - SIG | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/smu` | createSmuList | Real-Time Monitoring - Software | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/smu/synced` | createSyncedSmuList | Real-Time Monitoring - Software | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/software` | getAAAUcreateSoftwareListsers | Real-Time Monitoring - Software | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/software/synced` | createSyncedSoftwareList | Real-Time Monitoring - Software | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/sse/tunnels` | getSSETunnel | Real-Time Monitoring - SSE | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/sslproxy/statistics` | getSslProxyStatistics | Real-Time Monitoring - Sslproxy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/sslproxy/status` | getSslProxyStatus | Real-Time Monitoring - Sslproxy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/staticRouteTracker` | getStaticRouteTrackerInfo | Real-Time Monitoring - Static Route Tracker Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/switchport` | getSwitchPortInfo | Real-Time Monitoring - Switchport | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/csp/system/native` | createDeviceSystemSettingNativeInfo | Real-Time Monitoring - System | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/csp/system/processlist` | createDeviceSystemProcessList | Real-Time Monitoring - System | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/csp/system/settings` | createDeviceSystemSetting | Real-Time Monitoring - System | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/csp/system/status` | createDeviceSystemStatus | Real-Time Monitoring - System | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/system/clock` | getDeviceSystemClock | Real-Time Monitoring - System | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/system/info` | createDeviceInfoList | Real-Time Monitoring - System | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/system/statistics` | createDeviceSystemStatsList | Real-Time Monitoring - System | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/system/status` | createDeviceSystemStatusList | Real-Time Monitoring - System | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/system/synced/status` | createSyncedDeviceSystemStatusList | Real-Time Monitoring - System | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/tcpopt/activeflows` | getActiveTCPFlows | Real-Time Monitoring - TCP Optimization | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/tcpopt/expiredflows` | getExpiredTCPFlows | Real-Time Monitoring - TCP Optimization | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/tcpopt/summary` | getTCPSummary | Real-Time Monitoring - TCP Optimization | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/tcpproxy/statistics` | getTcpProxyStatistics | Real-Time Monitoring - Tcpproxy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/tcpproxy/status` | getTcpProxyStatus | Real-Time Monitoring - Tcpproxy | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/tools/netstat` | getDeviceToolsNetstat | Real-Time Monitoring - Tools | read | Verified live | deviceId=<controller>: object |
| GET | `/dataservice/device/tools/nslookup` | getDeviceToolsNSlookup | Real-Time Monitoring - Tools | read | Read (needs input) | query: dns |
| GET | `/dataservice/device/tools/realtimeinfo` | getRealTimeinfo | Real-Time Monitoring - Tools | read | Live error (timeout) | deviceId=<controller>: MCP error -32001: Request timed out |
| GET | `/dataservice/device/tools/ss` | getDeviceToolsSS | Real-Time Monitoring - Tools | read | Verified live | deviceId=<controller>: object |
| GET | `/dataservice/device/tools/system-netfilter` | getSystemNetfilter | Real-Time Monitoring - Tools | read | Verified live | deviceId=<controller>: object |
| GET | `/dataservice/device/transport/connection` | createTransportConnectionList | Real-Time Monitoring - Transport | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/ctsPac` | getCtsPac | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/environmentData` | getEnvironmentData | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/environmentData/radiusServer` | getRadiusServer | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/roleBasedCounters` | getRoleBasedCounters | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/roleBasedIpv6Counters` | getRoleBasedIpv6Counters | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/roleBasedIpv6Permissions` | getRoleBasedIpv6Permissions | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/roleBasedPermissions` | getRoleBasedPermissions | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/roleBasedSgtMap` | getRoleBasedSgtMap | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/sxpConnections` | getSxpConnections | Real-Time Monitoring - Trustsec | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/tunnel/bfd_statistics` | createBfdStatisticsList | Real-Time Monitoring - Tunnel | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/tunnel/fec_statistics` | createFecStatistics | Real-Time Monitoring - Tunnel | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/tunnel/gre-keepalives` | createGreKeepalivesList | Real-Time Monitoring - Tunnel | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/tunnel/ipsec_statistics` | createIpsecStatisticsList | Real-Time Monitoring - Tunnel | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/tunnel/packet-duplicate` | createPacketDuplicateStatistics | Real-Time Monitoring - Tunnel | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/tunnel/statistics` | createStatisticsList | Real-Time Monitoring - Tunnel | read | Verified live | deviceId=<edge>: 6 rows |
| GET | `/dataservice/device/ucse/stats` | createUcseStats | Real-Time Monitoring - Ucse | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/umbrella/device-registration` | getUmbrellaDevReg | Real-Time Monitoring - Umbrella | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/umbrella/dnscrypt` | getUmbrellaDNSCrypt | Real-Time Monitoring - Umbrella | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/umbrella/dp-stats` | getUmbrellaDpStats | Real-Time Monitoring - Umbrella | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/umbrella/overview` | getUmbrellaOverview | Real-Time Monitoring - Umbrella | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/umbrella/umbrella-config` | getUmbrellaConfig | Real-Time Monitoring - Umbrella | read | Verified live | deviceId=<controller>: 0 rows |
| GET | `/dataservice/device/utd/dataplane-config` | getUTDDataplaneConfig | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/dataplane-global` | getUTDDataplaneGlobal | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/dataplane-stats` | getUTDDataplaneStats | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/dataplane-stats-summary` | getUTDDataplaneStatsSummary | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/engine-instance-status` | getUTDEngineInstanceStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/engine-status` | getUTDEngineStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/file-analysis-status` | getUTDFileAnalysisStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/file-reputation-status` | getUTDFileReputationStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/ips-update-status` | getUTDIpsUpdateStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/signature/version/details` | getSignatureVersionInfo | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/urlf-con-status` | getUTDUrlfConnectionStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/urlf-update-status` | getUTDUrlfUpdateStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/utd/version-status` | getUTDVersionStatus | Real-Time Monitoring - UTD | read | Verified live | deviceId=<edge>: 1 rows |
| GET | `/dataservice/device/vdslService/coLineSpecificStats` | getCoLineSpecificStats | Real-Time Monitoring - VDSL Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vdslService/coStats` | getCoStats | Real-Time Monitoring - VDSL Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vdslService/cpeLineSpecificStats` | getCpeLineSpecificStats | Real-Time Monitoring - VDSL Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vdslService/cpeStats` | getCpeStats | Real-Time Monitoring - VDSL Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vdslService/lineBondingStats` | getLineBondingStats | Real-Time Monitoring - VDSL Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vdslService/lineSpecificStats` | getLineSpecificStats | Real-Time Monitoring - VDSL Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vdslService/vdslInfo` | getVdslInfo | Real-Time Monitoring - VDSL Service | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vm/nics` | getVbranchVMLifecycleNics | Real-Time Monitoring - VM | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/vm/notifications` | getCloudDockVMLifecycleNics | Real-Time Monitoring - VM | read | Read (needs input) | query: userGroup |
| GET | `/dataservice/device/vm/oper/state` | getVbranchVMLifecycle | Real-Time Monitoring - VM | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/vm/state` | getVMLifeCycleState | Real-Time Monitoring - VM | read | Live error (HTTP 400) | deviceId=<controller>: vManage API error 400: {"error":{"message":"Device data error","code":"DEV0001","details":"Failed to get data for device - Invalid data type |
| GET | `/dataservice/device/voice/dspActive` | getDspActive | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voice/phoneInfo` | getPhoneInfo | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voice/profiles` | getDSPFarmProfiles | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voice/sccpCcmGroups` | getSccpCcmGroups | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voice/sccpConnections` | getSccpConnections | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voice/voiceCalls` | getVoiceCalls | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voice/voipCalls` | getVoipCalls | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voiceisdninfo/isdnstatus` | getT1e1IsdnStatus | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voicet1e1controllerinfo/current15minstats` | getControllerT1e1InfoCurrent15MinStats | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/voicet1e1controllerinfo/totalstats` | getControllerT1e1InfoTotalStats | Real-Time Monitoring - Voice | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vpn` | getVPNInstances | Real-Time Monitoring - VPN | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/vrrp` | getVRRPInterface | Real-Time Monitoring - VRRP | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wireless/client` | getWirelessClients | Real-Time Monitoring - Wireless | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wireless/radio` | getWirelessRadios | Real-Time Monitoring - Wireless | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wireless/ssid` | getWirelessSsid | Real-Time Monitoring - Wireless | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wireless/status` | getWirelessStatus | Real-Time Monitoring - Wireless | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wlan/clients` | getWLANClients | Real-Time Monitoring - WLAN | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wlan/interfaces` | getWLANInterfaces | Real-Time Monitoring - WLAN | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wlan/radios` | getWLANRadios | Real-Time Monitoring - WLAN | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/wlan/radius` | getWLANRadius | Real-Time Monitoring - WLAN | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/lte450Cellular/hardware` | createHardwareList_RealTimeMonitoringLte450Cellular_3103 | Real-Time Monitoring -LTE450 Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/lte450Cellular/network` | createNetworkList_RealTimeMonitoringLte450Cellular_3003 | Real-Time Monitoring -LTE450 Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| GET | `/dataservice/device/lte450Cellular/radio` | createRadioList_RealTimeMonitoringLte450Cellular_2803 | Real-Time Monitoring -LTE450 Cellular | read | Verified live | deviceId=<edge>: 0 rows |
| DELETE | `/dataservice/resourcepool/resource/vpn` | deleteResources | Resource - Pool | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/resourcepool/resource/vpn` | getResources | Resource - Pool | read | Read (needs input) | query: tenantId |
| PUT | `/dataservice/resourcepool/resource/vpn` | createResources | Resource - Pool | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/topology-group/{topologyGroupId}/rules/preview` | getPreviewOfBulkRuleAssociation | Rules | read | Read (needs IDs) | path: topologyGroupId |
| DELETE | `/dataservice/backup/backupinfo` | deleteSchduledBackup | Scheduled Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/backup/backupinfo/{localBackupInfoId}` | getLocalBackupInfo | Scheduled Backup Restore | read | Read (needs IDs) | path: localBackupInfoId |
| GET | `/dataservice/backup/download/{path}` | downloadBackupFile | Scheduled Backup Restore | read | Read (needs IDs) | path: path |
| POST | `/dataservice/backup/export` | exportBackup | Scheduled Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/backup/list` | listBackup | Scheduled Backup Restore | read | Verified live | object |
| POST | `/dataservice/restore/import` | importScheduledBackup | Scheduled Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/restore/remoteimport` | remoteImportBackup | Scheduled Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/schedule/{schedulerId}` | deleteSchedule | Scheduled Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/schedule/{schedulerId}` | getScheduleRecordForBackup | Scheduled Backup Restore | read | Read (needs IDs) | path: schedulerId |
| POST | `/dataservice/schedule/create` | scheduleBackup | Scheduled Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/schedule/list` | listSchedules | Scheduled Backup Restore | read | Verified live | object |
| GET | `/dataservice/v1/reports` | getAllReportTemplates | Scheduled Report Management | read | Verified live | object |
| POST | `/dataservice/v1/reports` | createReportTemplate | Scheduled Report Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/reports/{reportId}` | deleteReportTemplate | Scheduled Report Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/reports/{reportId}` | getReportTemplateById | Scheduled Report Management | read | Read (needs IDs) | path: reportId |
| PUT | `/dataservice/v1/reports/{reportId}` | updateReportTemplate | Scheduled Report Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/v1/reports/{reportId}/action/{action}` | ReportAction | Scheduled Report Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/reports/{reportId}/tasks` | getAllReportTasksByReportId | Scheduled Report Management | read | Read (needs IDs) | path: reportId |
| DELETE | `/dataservice/v1/reports/{reportId}/tasks/{taskId}` | deleteReportTaskByTaskId | Scheduled Report Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/reports/{reportId}/tasks/{taskId}/download` | downloadReportDataFile | Scheduled Report Management | read | Read (needs IDs) | path: reportId, taskId |
| GET | `/dataservice/v1/reports/preview/download` | downloadReportPreviewFile | Scheduled Report Management | read | Verified live | object |
| POST | `/dataservice/sdavc/reverse-migration/custom-application/replay` | replayCustomApplications | SD AVC - Reverse Migration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/reverse-migration/custom-application/replay/status/{task-id}` | replayCustomApplicationsStatus | SD AVC - Reverse Migration | read | Read (needs IDs) | path: task-id |
| POST | `/dataservice/sdavc/reverse-migration/protocol-pack/replay` | replayProtocolPacks | SD AVC - Reverse Migration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/reverse-migration/protocol-pack/replay/status/{task-id}` | replayProtocolPacksStatus | SD AVC - Reverse Migration | read | Read (needs IDs) | path: task-id |
| GET | `/dataservice/sdavc/reverse-migration/validate` | validate | SD AVC - Reverse Migration | read | Verified live | object |
| GET | `/dataservice/sdavc/cloudconnector` | getCloudConnector | SD AVC Cloud Connector | read (deprecated) | Verified live | object |
| POST | `/dataservice/sdavc/cloudconnector` | enableCloudConnector | SD AVC Cloud Connector | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/sdavc/cloudconnector` | disableCloudConnector | SD AVC Cloud Connector | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/sdavc/cloudconnector/status` | getCloudConnectorStatus | SD AVC Cloud Connector | read (deprecated) | Verified live | object |
| GET | `/dataservice/monitor/sdavccloudconnector/domain` | getCloudConnectorDomainAppRules | SD AVC Domain-based App Rules | read | Verified live | 302 rows |
| GET | `/dataservice/monitor/sdavccloudconnector/ipaddress` | getCloudConnectorIpAddressAppRules | SD AVC IP Address based App Rules | read | Verified live | 714 rows |
| GET | `/dataservice/monitor/sdavccloudconnector/webex` | getWebexAppData | SD AVC Webex App Rules | read | Verified live | 922 rows |
| POST | `/dataservice/sdavc/saas/publish-tenants` | publishTenants | SDAVC SaaS - Publish Tenants | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/securedeviceonboarding/{accountId}/commplans` | getCommPlansByAcctId | Secure Device Onboarding - Communication Plans | read | Read (needs IDs) | path: accountId |
| GET | `/dataservice/v1/securedeviceonboarding/{accountId}/providercredentials` | getProviderCredentialsByAccountId | Secure Device OnBoarding - Provider Credentials | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| PUT | `/dataservice/v1/securedeviceonboarding/{accountId}/providercredentials` | editProviderCredentials | Secure Device OnBoarding - Provider Credentials | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| DELETE | `/dataservice/v1/securedeviceonboarding/{accountId}/providerCredentials` | deleteProviderCredentials | Secure Device OnBoarding - Provider Credentials | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/v1/securedeviceonboarding/{deviceUUID}/deviceusage` | getDeviceDataUsage | Secure Device OnBoarding - Provider Credentials | read | Read (needs IDs) | path: deviceUUID |
| POST | `/dataservice/v1/securedeviceonboarding/providercredentials` | createProviderCredentials | Secure Device OnBoarding - Provider Credentials | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/v1/securedeviceonboarding/providerscredentials` | getAllAccounts | Secure Device OnBoarding - Provider Credentials | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/v1/securedeviceonboarding/registeredproviders` | getProvidersInfo | Secure Device OnBoarding - Provider Credentials | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Secure device onBoarding is not enabled","code":"SDO00015","details":"Provider names could not b |
| GET | `/dataservice/v1/securedeviceonboarding/rateplans` | getRatePlansByAcctId | Secure Device Onboarding - Rate Plans | read | Read (needs input) | query: accountId |
| POST | `/dataservice/v1/securedeviceonboarding/fetchSdoToken` | fetchSdoToken | Secure Device OnBoarding - SDO Token | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/v1/securedeviceonboarding/getUrlForSdoIdentityService` | getUrlForSdoIdentityService | Secure Device OnBoarding - SDO Token | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Unable to connect to Cisco Control Center Identify Service.","code":"SDO00069","details":"Unable |
| GET | `/dataservice/v1/service-insertion/service-chain-mapping` | serviceChainMapping | Service Chain Mapping | read | Verified live | 0 rows |
| GET | `/dataservice/statistics/dynamic/collect` | getDynamicCollection | Setting - Dynamic Scheduler | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/statistics/dynamic/collect` | setDynamicCollection | Setting - Dynamic Scheduler | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/smartLicensing/authenticate` | sleauthenticate | Smart License | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/smartLicensing/fetchAccounts` | fetchAccounts_SmartLicense_2903 | Smart License | read | Read (needs input) | query: mode |
| GET | `/dataservice/smartLicensing/fetchAllSa` | fetchReports_SmartLicense_2603 | Smart License | read | Verified live | object |
| GET | `/dataservice/smartLicensing/fetchReportsForSa` | fetchReports_SmartLicense_3303 | Smart License | read | Read (needs input) | query: saDomain |
| POST | `/dataservice/msla/assignLicenses` | assignMslaLicensesToDevices | SmartLicensing - Licenses | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/msla/devices/{uuid}` | getLicenseByUuid_SmartlicensingLicenses_2003 | SmartLicensing - Licenses | read | Read (needs IDs) | path: uuid |
| GET | `/dataservice/msla/licenses` | getMslaLicenses | SmartLicensing - Licenses | read | Live error (rejected) | getMSLALicenses requires a request body. Use describe_api_operation to see its schema. |
| GET | `/dataservice/msla/monitoring/licensedDeviceCount` | getDeviceDetailsForDashboard | SmartLicensing - Licenses | read | Verified live | object |
| GET | `/dataservice/msla/monitoring/licensedDistributionDetails` | getLicenseDistributionDetails | SmartLicensing - Licenses | read | Verified live | object |
| GET | `/dataservice/msla/monitoring/packagingDistributionDetails` | getPackagingDistributionDetails | SmartLicensing - Licenses | read | Verified live | 0 rows |
| POST | `/dataservice/v1/smart-licensing/ea/fetch-accounts` | fetchEaVirtualAccounts | SmartLicensing - Sync EA Licenses | read | Read (needs input) | query body |
| GET | `/dataservice/v1/smart-licensing/ea/fetch-sync-status` | fetchEASyncStatus | SmartLicensing - Sync EA Licenses | read | Verified live | object |
| POST | `/dataservice/v1/smart-licensing/ea/generate` | generateEALicenses | SmartLicensing - Sync EA Licenses | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/smart-licensing/ea/sync` | syncWithEA | SmartLicensing - Sync EA Licenses | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/smart-licensing/license` | license | SmartLicensing - Sync Licenses | read | Read (needs input) | query: virtual_account_id |
| POST | `/dataservice/v1/smart-licensing/sync` | syncLicenses | SmartLicensing - Sync Licenses | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/v1/smart-licensing/user-settings` | getUserSettings | SmartLicensing - Sync Licenses | read | Verified live | object |
| GET | `/dataservice/cloudservices/accesstoken` | getAccessTokenforDevice | System - Cloud Service | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/cloudservices/authtoken` | getAzureToken | System - Cloud Service | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/cloudservices/connect` | connect_SystemCloudService_2203 | System - Cloud Service | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/cloudservices/credentials` | getCloudCredentials | System - Cloud Service | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/cloudservices/credentials` | addCloudCredentials | System - Cloud Service | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/cloudservices/devicecode` | getDeviceCode | System - Cloud Service | read | Read (needs input) | query body |
| POST | `/dataservice/cloudservices/m365/preferredpath` | getO365PreferredPathFromVAnalytics | System - Cloud Service | read | Read (needs input) | query body |
| GET | `/dataservice/cloudservices/staging` | isStaging | System - Cloud Service | read | Verified live | false |
| GET | `/dataservice/cloudservices/telemetry` | getTelemetryState | System - Cloud Service | read | Verified live | object |
| PUT | `/dataservice/cloudservices/telemetry/optin` | optIn | System - Cloud Service | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/cloudservices/telemetry/optout` | optOut | System - Cloud Service | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/cloudservices/vanalytics/dashboardlist` | getvAnalyticsDashboardList | System - Cloud Service | read | Verified live | object |
| GET | `/dataservice/dca/cloudservices` | getCloudSettings | System - Cloud Service | read | Verified live | object |
| GET | `/dataservice/dca/cloudservices/otp` | getOTP | System - Cloud Service | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| PUT | `/dataservice/dca/cloudservices/otp` | updatetOTP | System - Cloud Service | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| POST | `/dataservice/dca/cloudservices/vanalytics` | getvAnalytics | System - Cloud Service | read | Read (needs input) | query body |
| GET | `/dataservice/entityownership/list` | listEntityOwnershipInfo | System - Cloud Service | read | Verified live | object |
| GET | `/dataservice/entityownership/tree` | entityOwnershipInfo | System - Cloud Service | read | Verified live | object |
| GET | `/dataservice/cdna/sense/{tag}` | getCdnaSenseService | System - Cloud Service CDNA | read | Read (needs IDs) | path: tag |
| DELETE | `/dataservice/cdna/server` | deleteCdnaServer | System - Cloud Service CDNA | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/cdna/server` | getCdnaServer | System - Cloud Service CDNA | read | Verified live | object |
| PUT | `/dataservice/cdna/server` | enrollCdnaServer | System - Cloud Service CDNA | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/webex/accesscode` | webexAccessCode | System - Cloud Service Webex | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Failed to get webex client credentials","code":"CTEMP0021","details":"Webex access code not foun |
| DELETE | `/dataservice/webex/datacenter` | deleteWebexDataCenters | System - Cloud Service Webex | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/webex/datacenter` | getWebexDataCenters | System - Cloud Service Webex | read | Read (needs input) | query body |
| POST | `/dataservice/webex/datacenter/sync` | updateWebexDataCenters | System - Cloud Service Webex | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/webex/datacenter/syncstatus` | getWebexDataCentersSyncStatus | System - Cloud Service Webex | read | Verified live | object |
| PUT | `/dataservice/webex/datacenter/syncstatus` | setWebexDataCentersSyncStatus | System - Cloud Service Webex | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/webex/redirect` | redirectWebexDataCenters | System - Cloud Service Webex | read | Read (needs input) | query: code |
| GET | `/dataservice/sdavc/customapps` | getCustomApp | System - Container | read | Verified live | 1 rows |
| POST | `/dataservice/sdavc/test` | testLoadBalancer | System - Container | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/system/reverseproxy/{uuid}` | getReverseProxyMappings | System - Reverse Proxy | read | Read (needs IDs) | path: uuid |
| POST | `/dataservice/system/reverseproxy/{uuid}` | createReverseProxyMappings | System - Reverse Proxy | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/tenantbackup/delete` | deleteTenantBackup | Tenant Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/tenantbackup/download/{path}` | downloadExistingBackupFile | Tenant Backup Restore | read | Read (needs IDs) | path: path |
| GET | `/dataservice/tenantbackup/export` | exportTenantBackup | Tenant Backup Restore | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenantbackup/import` | importTenantBackup | Tenant Backup Restore | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/tenantbackup/list` | listTenantBackup | Tenant Backup Restore | read | Live error (HTTP 403) | vManage API error 403: Access forbidden: role not allowed |
| GET | `/dataservice/tenant` | getAllTenants | Tenant Management | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Forbidden","code":"TN0020","details":"User does not have permission to access this resource"}} |
| POST | `/dataservice/tenant` | createTenant | Tenant Management | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/tenant` | updateTenantBulk | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/tenant/{tenantId}` | deleteTenantAsync | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/tenant/{tenantId}` | getTenant | Tenant Management | read | Read (needs IDs) | path: tenantId |
| PUT | `/dataservice/tenant/{tenantId}` | updateTenant | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenant/{tenantId}/delete` | deleteTenant | Tenant Management | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenant/{tenantId}/switch` | switchTenant | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenant/{tenantId}/vsessionid` | vSessionId | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/tenant/{tenantId}/vsmart` | updateTenantvSmartPlacement | Tenant Management | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/tenant/{tenantId}/vsmarts` | updateTenantvSmartsPlacement | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenant/async` | createTenantAsync | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/tenant/bulk/async` | deleteTenantAsyncBulk | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenant/bulk/async` | createTenantAsyncBulk | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/tenant/capacity` | getTenantHostingCapacity | Tenant Management | read | Live error (HTTP 403) | vManage API error 403: Permission denied. This API is available only in Provider view of a multi-tenant vManage system. |
| GET | `/dataservice/tenant/vsmart` | getvSmartTenantMapping | Tenant Management | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Forbidden","code":"TN0020","details":"User does not have permission to access this resource"}} |
| PUT | `/dataservice/tenant/vsmart` | relocateAllTenantsFromVsmart | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/tenant/vsmart/capacity` | getvSmartTenantHostingCapacity | Tenant Management | read (deprecated) | Live error (HTTP 403) | vManage API error 403: Permission denied |
| GET | `/dataservice/tenantstatus` | getAllTenantStatuses | Tenant Management | read | Live error (HTTP 403) | vManage API error 403: Access forbidden: role not allowed |
| POST | `/dataservice/tenantstatus/force` | forceStatusCollection | Tenant Management | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/tenantmigration/download/{path}` | downloadTenantData | Tenant Migration | read | Read (needs IDs) | path: path |
| POST | `/dataservice/tenantmigration/export` | exportTenantData | Tenant Migration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenantmigration/import/{migrationKey}` | importTenantData | Tenant Migration | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/tenantmigration/migrationToken` | getMigrationToken | Tenant Migration | blocked | Blocked | Issues or exposes tokens, passwords, credentials or bootstrap secrets |
| GET | `/dataservice/tenantmigration/networkMigration` | reTriggerNetworkMigration | Tenant Migration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/tenantmigration/networkMigration` | migrateNetwork | Tenant Migration | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/opentaccase/authcode` | oauthAccess | Tools - TAC Cases | read (deprecated) | Live error (HTTP 500) | vManage API error 500: Cannot invoke "String.contains(java.lang.CharSequence)" because "redirectURI" is null |
| GET | `/dataservice/opentaccase/getClientID` | getClientID | Tools - TAC Cases | read (deprecated) | Verified live | object |
| GET | `/dataservice/v1/topology-group` | GetTopologyGroupBySolution | Topology - Topology Group | read | Verified live | 1 rows |
| POST | `/dataservice/v1/topology-group` | CreateTopologyGroup | Topology - Topology Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/v1/topology-group/{topologyGroupId}` | DeleteTopologyGroup | Topology - Topology Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/topology-group/{topologyGroupId}` | GetTopologyGroup | Topology - Topology Group | read | Read (needs IDs) | path: topologyGroupId |
| PUT | `/dataservice/v1/topology-group/{topologyGroupId}` | EditTopologyGroup | Topology - Topology Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/v1/topology-group/{topologyGroupId}/device/{deviceId}/preview` | getTopologyGroupDeviceConfigurationPreview | Topology - Topology Group | read | Read (needs IDs) | path: topologyGroupId, deviceId |
| POST | `/dataservice/v1/topology-group/{topologyGroupId}/device/deploy` | deployTopologyGroup | Topology - Topology Group | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/troubleshooting/mre/workflow/{operation}/{executionId}` | getMreWorkflowStatus | Troubleshooting MRE - Workflow | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/troubleshooting/mre/workflow/{workflowType}` | getMreExecutionId | Troubleshooting MRE - Workflow | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/admintech` | createAdminTech | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/tools/admintech/{requestID}` | deleteAdminTechFile | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/admintech/copy` | copyAdminTechOnDevice | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/admintech/delayed/cancel` | cancelDelayedAdminTechTask | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/device/tools/admintech/delete` | deleteAdminTechOnDevice | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/tools/admintech/download/{filename}` | downloadAdminTechFile | Troubleshooting Tools - Device Connectivity | read | Read (needs IDs) | path: filename |
| POST | `/dataservice/device/tools/admintech/force/generate` | forceGenerateDelayedAdminTechTask | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/device/tools/admintech/supportedfeatures/{deviceModel}/{deviceIP}/{personality}` | getSupportedAdminTechFeatures | Troubleshooting Tools - Device Connectivity | read | Read (needs IDs) | path: deviceModel, deviceIP, personality |
| POST | `/dataservice/device/tools/admintechlist` | listAdminTechsOnDevice | Troubleshooting Tools - Device Connectivity | read | Read (needs input) | query body |
| GET | `/dataservice/device/tools/admintechs` | listAdminTechs | Troubleshooting Tools - Device Connectivity | read | Verified live | 1 rows |
| GET | `/dataservice/device/tools/admintechs/inprogress` | getInProgressCount | Troubleshooting Tools - Device Connectivity | read | Verified live | 1 rows |
| POST | `/dataservice/device/tools/admintechs/upload` | uploadAdminTech | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/factoryreset` | factoryReset | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/nping/{deviceIP}` | npingDevice | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/ping/{deviceIP}` | pingDevice | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/porthopcolor/{deviceIP}` | processPortHopColor | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/reset/interface/{deviceIP}` | processInterfaceReset | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/reset/profile` | processCellularProfileReset | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/resetuser/{deviceIP}` | processResetUser | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/servicepath/{deviceIP}` | servicePath | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/traceroute/{deviceIP}` | tracerouteDevice | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/device/tools/tunnelpath/{deviceIP}` | tunnelPath | Troubleshooting Tools - Device Connectivity | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/troubleshooting/control/{uuid}` | getControlConnections | Troubleshooting Tools - Device Connectivity | read | Read (needs IDs) | path: uuid |
| GET | `/dataservice/troubleshooting/devicebringup` | getDeviceConfiguration | Troubleshooting Tools - Device Connectivity | read | Read (needs input) | query: uuid |
| GET | `/dataservice/group` | listDeviceGroupList | Troubleshooting Tools - Device Group | read | Verified live | 2 rows |
| GET | `/dataservice/group/device` | listDeviceGroups | Troubleshooting Tools - Device Group | read | Verified live | 2 rows |
| GET | `/dataservice/group/devices` | listGroupDevices | Troubleshooting Tools - Device Group | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| GET | `/dataservice/group/map/devices` | listGroupDevicesForMap | Troubleshooting Tools - Device Group | read | Verified live | 17 rows |
| GET | `/dataservice/group/map/devices/links` | listGroupLinksForMap | Troubleshooting Tools - Device Group | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| GET | `/dataservice/statistics/speedtest` | getStatDataRawData_TroubleshootingToolsDiagnostics_2103 | Troubleshooting Tools - Diagnostics | read | Verified live | 0 rows |
| POST | `/dataservice/statistics/speedtest` | getStatsRawData_TroubleshootingToolsDiagnostics_2104 | Troubleshooting Tools - Diagnostics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/speedtest/aggregation` | getAggregationDataByQuery_TroubleshootingToolsDiagnostics_3303 | Troubleshooting Tools - Diagnostics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/speedtest/aggregation` | getPostAggregationDataByQuery_TroubleshootingToolsDiagnostics_3304 | Troubleshooting Tools - Diagnostics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/speedtest/csv` | getStatDataRawDataAsCSV_TroubleshootingToolsDiagnostics_2503 | Troubleshooting Tools - Diagnostics | read | Read (needs input) | bulk CSV export |
| GET | `/dataservice/statistics/speedtest/doccount` | getCount_TroubleshootingToolsDiagnostics_3003 | Troubleshooting Tools - Diagnostics | read | Read (needs input) | query: query |
| POST | `/dataservice/statistics/speedtest/doccount` | getCountPost_TroubleshootingToolsDiagnostics_3004 | Troubleshooting Tools - Diagnostics | read | Verified live | object |
| GET | `/dataservice/statistics/speedtest/fields` | getStatDataFields_TroubleshootingToolsDiagnostics_2803 | Troubleshooting Tools - Diagnostics | read | Verified live | object |
| GET | `/dataservice/statistics/speedtest/page` | getStatsPaginationRawData_TroubleshootingToolsDiagnostics_2603 | Troubleshooting Tools - Diagnostics | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Empty query.","code":"STATS_VALIDATION0005","details":"","type":"error"}} |
| POST | `/dataservice/statistics/speedtest/page` | getPostStatsPaginationRawData_TroubleshootingToolsDiagnostics_2604 | Troubleshooting Tools - Diagnostics | read | Read (needs input) | query body |
| GET | `/dataservice/statistics/speedtest/query/fields` | getStatQueryFields_TroubleshootingToolsDiagnostics_3403 | Troubleshooting Tools - Diagnostics | read | Verified live | 1 rows |
| POST | `/dataservice/stream/device/capture` | getSessionInfoCapture | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/capture/{deviceUUID}/{sessionId}` | formPostPacketCapture | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/capture/disable/{sessionId}` | disablePacketCaptureSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/capture/download/{sessionId}` | downloadFile | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/device/capture/forcedisbale/{sessionId}` | forceStopPcapSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/capture/start/{sessionId}` | startPcapSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/capture/status/{sessionId}` | getFileDownloadStatus | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/device/capture/stop/{sessionId}` | stopPcapSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/capture/vnicsInfo/{vnfId}` | getVnicInfoByVnfId | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: vnfId |
| POST | `/dataservice/stream/device/log` | getSessionInfoLog | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/log/{logType}/{deviceUUID}/{sessionId}` | streamLog | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/log/{sessionId}` | getDeviceLog | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/device/log/disable/{sessionId}` | disableDeviceLog | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/log/download/{sessionId}` | downloadDebugLog | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/device/log/renew/{sessionId}` | renewSessionInfo | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/log/search/{sessionId}` | searchDeviceLog | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/log/sessions` | getSessions | Troubleshooting Tools - Diagnostics | read | Verified live | 0 rows |
| GET | `/dataservice/stream/device/log/sessions/clear/{sessionId}` | clearSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/log/type` | getLogType | Troubleshooting Tools - Diagnostics | read | Read (needs input) | query: uuid |
| POST | `/dataservice/stream/device/speed` | getSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/speed/{deviceUUID}/{sessionId}` | saveSpeedTestResults | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/speed/{sessionId}` | getSpeedTest | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/device/speed/disable/{sessionId}` | disableSpeedTestSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/speed/interface/bandwidth` | getInterfaceBandwidth | Troubleshooting Tools - Diagnostics | read | Read (needs input) | query: deviceUUID |
| GET | `/dataservice/stream/device/speed/start/{sessionId}` | startSpeedTest | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/speed/status/{sessionId}` | getSpeedTestStatus | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/device/speed/stop/{sessionId}` | stopSpeedTest | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/status/{deviceUUID}` | processDeviceStatus | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/dmlog` | enableDMLog | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/dmlog/client/uploadFF/{sessionId}` | clientUploadFilterFile | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/dmlog/disable/{sessionId}` | disableDMLogSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/dmlog/download/{sessionId}` | downloadDMLog | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/dmlog/start/{sessionId}` | startDMLogSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/dmlog/status/{sessionId}` | getDMLogStatus | Troubleshooting Tools - Diagnostics | read | Read (needs IDs) | path: sessionId |
| GET | `/dataservice/stream/dmlog/stop/{sessionId}` | stopDMLogSession | Troubleshooting Tools - Diagnostics | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/nwpi/exportTrace` | exportTrace | Troubleshooting Tools - Network Wide Path Insight | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/nwpi/importTrace` | importTrace | Troubleshooting Tools - Network Wide Path Insight | blocked | Blocked | File upload (multipart/form-data) is not supported over MCP |
| GET | `/dataservice/stream/device/nwpi/tasks/{taskId}/traces` | getTaskTrace | Troubleshooting Tools - Network Wide Path Insight | read | Read (needs IDs) | path: taskId |
| POST | `/dataservice/stream/device/nwpi/tasks/create` | taskCreate | Troubleshooting Tools - Network Wide Path Insight | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/stream/device/nwpi/tasks/delete/{taskId}` | taskDelete | Troubleshooting Tools - Network Wide Path Insight | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/nwpi/tasks/stop/{taskId}` | taskStop | Troubleshooting Tools - Network Wide Path Insight | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/nwpi/tasks/taskHistory` | getTaskHistory | Troubleshooting Tools - Network Wide Path Insight | read | Verified live | 0 rows |
| DELETE | `/dataservice/stream/device/nwpi/trace/delete` | traceDelete | Troubleshooting Tools - Network Wide Path Insight | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/nwpi/trace/start` | traceStart | Troubleshooting Tools - Network Wide Path Insight | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/nwpi/trace/stop/{traceId}` | traceStop | Troubleshooting Tools - Network Wide Path Insight | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/nwpi/traceHistory` | getTraceHistory | Troubleshooting Tools - Network Wide Path Insight | read | Verified live | 2 rows |
| POST | `/dataservice/stream/device/umts` | enableSession | Troubleshooting Tools - UMTS | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/stream/device/umts/{deviceUUID}/save` | saveUMTSData | Troubleshooting Tools - UMTS | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/umts/{operation}/{sessionId}` | updateUmtsSessionStatus | Troubleshooting Tools - UMTS | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/stream/device/umts/statistics/{deviceUUID}/{eventType}` | getUMTSData | Troubleshooting Tools - UMTS | read (deprecated) | Read (needs IDs) | path: deviceUUID, eventType |
| GET | `/dataservice/truststore/certificates` | getCertificates | Truststore Certificates | read | Verified live | 0 rows |
| POST | `/dataservice/truststore/certificates` | importCertificates | Truststore Certificates | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/truststore/certificates/{uuid}` | deleteCertificate | Truststore Certificates | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/truststore/certificates/{uuid}` | getCertificate_TruststoreCertificates_3103 | Truststore Certificates | read | Read (needs IDs) | path: uuid |
| POST | `/dataservice/truststore/test-connection` | testConnection | Truststore Certificates | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/truststore/test-connection/proxy` | testConnectionViaProxy | Truststore Certificates | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/umbrella/getkeys` | getAllKeysFromUmbrella | Umbrella | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| GET | `/dataservice/umbrella/getkeys/management` | getManagementKeysFromUmbrella | Umbrella | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Get Umbrella Keys Failed","code":"UK0001","details":"\"Smart Account credentials not found, plea |
| GET | `/dataservice/umbrella/getkeys/networkdevices` | getNetworkKeysFromUmbrella | Umbrella | read | Live error (HTTP 400) | vManage API error 400: {"error":{"message":"Get Umbrella Keys Failed","code":"UK0001","details":"\"Smart Account credentials not found, plea |
| GET | `/dataservice/umbrella/getkeys/reporting` | getReportingKeysFromUmbrella | Umbrella | read | Live error (HTTP 500) | vManage API error 500: {"error":{"message":"Server error","code":"REST0001","details":"The system encountered an unexpected error. If the pr |
| GET | `/dataservice/umbrella/syncnow` | sendMetaDataToUmbrella | Umbrella | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| DELETE | `/dataservice/url/monitor` | deleteUrlMonitor | url monitor | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/url/monitor` | getUrlMonitor | url monitor | read | Verified live | object |
| POST | `/dataservice/url/monitor` | createUrlMonitor | url monitor | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/url/monitor` | updateUrlMonitor | url monitor | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/util/configdb/metrics` | returnMetric | Utility - Configuration DB | read | Read (needs input) | query: metricName |
| GET | `/dataservice/util/configdb/metrics/downloadfiles` | returnMetricFiles | Utility - Configuration DB | read | Read (needs input) | query: metricName |
| GET | `/dataservice/util/configdb/metrics/listmetrics` | getMetricsList | Utility - Configuration DB | read | Verified live | 79 rows |
| GET | `/dataservice/util/configdb/size` | getDBSizeOnFile | Utility - Configuration DB | read | Verified live | object |
| GET | `/dataservice/util/logfile/appserver` | listLogFileDetails | Utility - Logging | read | Verified live | object |
| GET | `/dataservice/util/logfile/appserver/lastnlines` | listVManageServerLogLastNLines | Utility - Logging | read | Verified live | 27-Oct-2026 13:10:06 |
| GET | `/dataservice/util/logging/configurations` | listConfigurations | Utility - Logging | read | Verified live | 5 rows |
| POST | `/dataservice/util/logging/debuglog` | debugLog | Utility - Logging | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/util/logging/level` | setLogLevel | Utility - Logging | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/util/logging/loggers` | listLoggers | Utility - Logging | read | Verified live | object |
| POST | `/dataservice/util/logging/updateConfiguration` | updateLoggerConfiguration | Utility - Logging | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/util/olapdb/migration/action/{action}` | postStatsMigrationAction | Utility - OLAP DB | write (deprecated) | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/software/compliance/ip/origin/check` | checkGivenIpList | Utility - Security | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| POST | `/dataservice/policy/wani/recommendation/process` | applyWaniRecommendation | Wani Recommendations | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/wani/{listType}/{listId}/listActivationStatus` | getListActivationStatus | Wani Recommendations | read | Read (needs IDs) | path: listType, listId |
| GET | `/dataservice/wani/{policyType}/{policyId}/policyActivationStatus` | getPolicyActivationStatus | Wani Recommendations | read | Read (needs IDs) | path: policyType, policyId |
| GET | `/dataservice/wani/recommendations` | getWaniRecommendations | Wani Recommendations | read | Verified live | object |
| GET | `/dataservice/wani/recommendations/applied` | getAppliedWaniRecommendations | Wani Recommendations | read | Verified live | 0 rows |
| POST | `/dataservice/v1/controllers-upgrade` | triggerControllersUpgrade | Workflows - Controllers Upgrade | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/controllers-upgrade/available-versions` | getAvailableVersions | Workflows - Controllers Upgrade | read | Verified live | object |
| PUT | `/dataservice/v1/controllers-upgrade/cancel` | cancelUpgrade | Workflows - Controllers Upgrade | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| PUT | `/dataservice/v1/controllers-upgrade/reschedule` | rescheduleUpgrade | Workflows - Controllers Upgrade | write | Write (not executed) | Enabled with VMANAGE_ALLOW_WRITE=true + confirm |
| GET | `/dataservice/v1/controllers-upgrade/status` | getUpgradeStatus | Workflows - Controllers Upgrade | read | Read (needs input) | query: processId |
| GET | `/dataservice/v1/controllers-upgrade/version-compliance-info` | getVersionComplianceInfo | Workflows - Controllers Upgrade | read | Read (needs input) | query: version |
