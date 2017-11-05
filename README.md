# NEEO driver for Roku
This Project allows the Control of a Roku with NEEO over TCP/IP

The driver attempt to auto-discover and manage a roku on your network.  

## Information about NEEO
- Please see https://neeo.com/ for more Information about NEEO The Thinking Remote
- For more about NEEOs SDK visit https://github.com/NEEOInc/neeo-sdk

## Requirements
- Node.js version 7.10+
- Nodeku 

## Debugging
Set an environment variable named DEBUG to "*" for debug output from all modules or 
"neeo_roku_driver" to enable debugging output from just neeo_driver_roku. 

## TODO 
- Support more than one Roku on a network
- Allow for a fixed IP address