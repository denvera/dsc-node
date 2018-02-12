## Node DSC Server

This is a front end server written in Node.js that talks to either the dscmod kernel module or an ESP8266 based WiFi module interfacing to the DSC KeyBus via a level shifter.

Features
* Virtual Keypad
* Email notifications for arm/disarm/alarm activation events
* Scheduler to arm/stay/disarm alarm with cron syntax


### Setup (from the `dsc-node` directory)
* node.js 6.x or greater recommended and yarn
* Install the node dependencies using `yarn install`
* Generate assets using `brunch build`
 * This may require installing brunch which can be done with npm (`yarn global add brunch`)
 * If an error is presented during the brunch build regarding `babel-preset-env` then that may also need to be installed
* Modify default.json as appropriate or add in a production/development.json file into the config directory.
 * The dscserver section can have a mode of either `socket` or `dev`.
  * `dev` mode uses [dscmod](https://github.com/denvera/dscmod) for its messages.  The user running dsc-node requires access to the devices exposed by dscmod.
  * `socket` mode uses an ESP8266 accessible by the host running dsc-node
* run the server using `npm start`

### Acessing the server
If you are running the server on the same machine as a web browser you can access the server using http://localhost:3333
