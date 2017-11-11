# NEEO driver for Roku
This Project allows the Control of a Roku with NEEO over TCP/IP

The driver attempt to auto-discover and manage a roku on your network.

If your network does not support audo-discovery via SSDP you can manually provide the IP addresses
for each of the devices. Set an environment variable ROKU_DEVICES to a comma separated list of the
IP addresses and port of each device. If no port number is specified the default port of 8060 
is assumed. For example `ROKU_DEVICES=192.168.1.5:8060,192.168.1.7`.   

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