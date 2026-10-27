# Skill: Get SD-WAN Devices

Description:
Retrieve all devices from Cisco Catalyst SD-WAN vManage.

When to use:
Use this skill when the user asks for SD-WAN routers, edges, or controllers.

Steps:
1. Authenticate to vManage API
2. Call endpoint `/dataservice/device`
3. Return device hostname, system-ip, site-id, and status.

Example prompt:
"List all SD-WAN devices"
