## Node DSC Server

This is a front end server written in Node.js that talks to either the dscmod kernel module or an ESP8266 based WiFi module interfacing to the DSC KeyBus via a level shifter.

Features
* Virtual Keypad
* Email notifications for arm/disarm/alarm activation events
* Scheduler to arm/stay/disarm alarm with cron syntax

Modify default.json as appropriate or add in a production/development.json file into the config directory. Install dependencies with bower/npm install and start with ```npm start``` or ```npm start | bunyan```.