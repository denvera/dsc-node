/// <reference path="typings/node/node.d.ts" />

var net = require('net');
var fs = require('fs');
var config = require('config');
var log = require('./logger');
var schedule = require('node-schedule');
var util = require('util');
var mailer = require('./mailer');
var _ = require('lodash');
var Storage = require('node-storage');

var dscServerConfig = config.get('dscServer');
var dscServer = new DSCServer();


DSCServer.prototype.messageTypes = { 0x00: 'PANEL', 0x01: 'STATUS', 0x02: 'CLIENT'};

var LEDS = {'BACKLIGHT':0x80,
			'FIRE':		0x40,
			'PROGRAM':	0x20,
			'TROUBLE':	0x10,
			'BYPASS': 	0x08,
			'MEMORY':	0x04,
			'ARMED':	0x02,
			'READY':	0x01}		

// Somewhat unsure of messages with ? postfix
var MESSAGES = {0x01:	'Enter code',
				0x03:	'Close all sections',				
				0x04:	'Stay Armed?',
				0x82:	'Already Stay Armed?',
				0x11:	'System Armed',
				0x3e:	'Disarmed?',
				0x8f:	'Incorrect Code!',
				0x08:	'Arming..',
				0x05:	'Armed'
				}

var BEEPS = {	0x06:	3,
				0x0a:	4,
				0x0c:	99 // Long beep	
			}

var KEYS = 	{ 'STAY':	'+',
			  'AWAY':	',',
			  'CHIME':	'.',
			  '*':		'*',
			  '#':		'#'
			}
			
var DEV_MAP = { '*': 0x0a,
				'#': 0x0b }
			
DSCServer.prototype.beeps = BEEPS;		
			
function DSCServer() {	
	this.binMode = false;
	log.level('trace');
	this.recvBuffer = new Buffer(8192);
	this.bufLen = 0;
	this.recvOffset = 0;	
	this.statusCallback = null;
	this.ledStatus = 0;
	this.socket = null;
	this.fd = null;
	this.lastStatus = null;
	this.anyCallback = null;
	this.events = [];
	
	this.store = new Storage('storage.json');
	this.jobs = this.store.get('jobs');
	
	this.actions = { 'arm': function() {		
						log.info('Scheduled action arm');
						this.sendKey('AWAY');	
				   }.bind(this),
				  'disarm': function() {
					  	if ((this.ledStatus & LEDS['ARMED']) == LEDS['ARMED']) {
					  		log.info('Scheduled action disarm');
					  		this.socket.write('WRITE: ' + dscServerConfig.code + '\n');
						  } else {
							log.warn('Not disarming already unarmed alarm');
						  }
				  }.bind(this),
				  'stay': function() {
					  	log.info('Scheduled action stay');
					  	this.sendKey('STAY');
				  }.bind(this)
	};
	
	_.forEach(this.jobs, function(job) {
		var j;
		try {
			j = schedule.scheduleJob(job.spec, this.actions[job.action]);			
		} catch (e) {
			log.error('Error adding job: ' + e);
			return;
		}
		log.debug('Added job ' + job.name + ' with spec ' + job.spec + ' to ' + job.action);
		job['job'] = j;
	}.bind(this));
	

	this.doAnyCallback = function(msg) {
		this.events.push(msg);
		if (this.events.length > 100) {
			this.events.shift();
		}
		if (this.anyCallback != null) {
			this.anyCallback(msg);
		}	
	}
	
	this.getEvents = function () {
		return this.events;
	}
	this.doAlarmCb = function(zones) {		
		if (this.alarmCb != null) {
			this.alarmCb(zones);
		}
	}
	
	this.doStatusCallback = function(msg) {
		try {
			var cmd = msg[2];		
			if (this.statusCallback != null) {
				var status = {};
				if (cmd == 0x05) {
					var leds = msg.readUInt8(4);
					var msgText = MESSAGES[msg[5]];
					status.leds = leds;
					status.msgText = msgText;				
				} else if (cmd == 0x27) {
					var zones = msg.readUInt8(8);
					status.zones = zones;
				} else if (cmd == 0x2d) { // Zone expander zone report?
					var zones = msg.readUInt8(8) + 0xff;
					status.zones = zones;							
				} else if (cmd == 0x0a && msg[3] == 0x00) {				
					status.zones = msg.readUInt8(6);
					status.msgText = '. . .';
				} else {
					return;
				}
				this.statusCallback(status);
			}
		} catch (e) {
			log.error('Exception in status callback: ' + e.toString());
		}
	}
	
	this.sendKey = function(key) {
		var sKey = null;
		if (key % 1 === 0) {
			sKey = key;
		} else {
			sKey = KEYS[key.toUpperCase()];
		}
		log.debug('SendKey: ' + key);
		if (dscServerConfig.mode != "dev") {
			if (sKey != null && this.socket != null) {
				log.debug('WRITE: ' + sKey + '\n');
				try {
					this.socket.write('WRITE: ' + sKey + '\n');
				} catch (e) {
					log.error('Error writing to socket: ' + e); 
				}			 
			}
		} else {
			var sendBytes = _.map(sKey, function(iKey) {
				if (!(iKey % 1 === 0)) {
					if (iKey in DEV_MAP) {
						iKey = DEV_MAP[iKey];
					}  else {
						iKey = iKey.charCodeAt();
					}					
				}											
			 	return ((iKey << 2) | ((((iKey >> 4) & 0x03) + ((iKey >> 2) & 0x03) + (iKey & 0x03)) & 0x03));
			 });
			 var bufSendBytes = new Buffer(sendBytes); 
			 fs.write(this.fd, bufSendBytes, 0, bufSendBytes.length, function(err, written, s) {
				if (err != null) {
					log.error('Error writing string: ' + err);
				} else {
					log.debug('Wrote ' + written + ' bytes of ' + s.length);
				}
			 });
		}
	}
	
	this.sendMsg = function(msg) {
		log.debug('Sending: '+ msg);
		this.socket.write(msg + '\n');
	}
	
	this.upgrade = function() {
		log.debug('Upgrading');
		this.socket.write('UPGRADE\n');
	}
		
	this.addJob = function(spec, action, name) {
		var job = { cancel: function() { console.log("Cancelled!"); }};
		log.debug('Job ' + name + ' [' + spec + '] to ' + action + ' added' );	
		
		var j = schedule.scheduleJob(spec, this.actions[action]);
		if (j) {	
			this.jobs.push({
				spec: spec,
				action: action,
				name: name,
				job: j
			});
			this.store.put('jobs', this.jobs);
			return true;
		} else {
			log.warn('Error adding job: [' + spec + ',' + action + ',' + name + ']');
			return false;
		}
		
	}
	this.delJob = function(idx) {
		if (this.jobs[idx].job instanceof schedule.Job) {
			if (this.jobs[idx].job.cancel()) {
				log.info('Delete job at ' + idx + ' successfully');
			} else {
				log.error('Error deleting job at ' + idx);
			}
		} else {
			log.warn('Removed a job that wasn\'t a Job');
		}
		_.pullAt(this.jobs, idx);
		this.store.put('jobs', this.jobs);
	}
	this.checksumOk = function(msg) {
		var cksum = 0;
		var payload = msg.slice(2, -2);
		var cmd = msg[2];
		var noCkSum = [0x05,0x11]
		if (noCkSum.indexOf(cmd) == -1 || msg[0] != 0x00) return true;
		for (var i = 0; i < payload.length; i++) {
			cksum += payload[i];
		}
		return ((cksum & 0xff) == msg[msg.length-2])
	}
	
	this.pokeStatus = function() {
		if (this.lastStatus != null) {
			this.doStatusCallback(this.lastStatus);
		}
	}
	
	this.processMsg = function(buf) {
		var msgType = buf[1];
		var cmd = buf[2];
		if (msgType in this.messageTypes) {
			log.trace(this.messageTypes[msgType] + ': ' + buf.slice(2).toString('hex') + ' ' + (this.checksumOk(buf) ? '[OK]' : '[BAD]') );
			if (msgType == 0x00 || msgType == 0x01) {
				if (cmd == 0x05 && buf.length >= 9 && buf[4] != 0x00) { // 0x27 seems incorrect for LED status
					/*if ((this.ledStatus & LEDS['ARMED']) ^ (buf[4] & LEDS['ARMED'])) {
						// Armed LED status changed:
						if (buf[4] & LEDS['ARMED']) {
							mailer.sendMail('Alarm has been armed', 'Alarm Armed');
						} else {
							mailer.sendMail('Alarm has been disarmed', 'Alarm Disarmed');
						}
					} */
                    if (this.lastStatus != null && (this.lastStatus[5] ^ buf[5]) && (buf[5] == 0x08 || buf[5] == 0x3e)) {                       
                        mailer.sendMail('Alarm is ' + MESSAGES[buf[5]], 'Alarm ' + MESSAGES[buf[5]]);
                    }
					this.ledStatus = buf[4];
					this.lastStatus = new Buffer(buf);
				} else if (cmd == 0x05) {
					log.warn("Short status message received");
				}
				if (cmd == 0x05 || cmd == 0x27 || cmd == 0x0a) {
					if (this.lastStatus != null && (!this.lastStatus.equals(buf)) ) {
						this.doStatusCallback(new Buffer(buf));
						if (cmd == 0x27) {
							this.doAnyCallback(new Buffer(buf));
						}
					}
					//this.lastStatus = new Buffer(buf);	
				} else if (cmd == 0xbb || cmd == 0x5d) { // Alarm
					// 0xbb is alarm
					// 0x5d, byte 3 is zone
					if (cmd == 0x5d && buf[5] != 0x00 && buf[4] != 0x04) { // byte 4 = 0x04 == recall alarm zones
						if (buf.length >= 7) {
							log.warn("ALARM!!! Zone: " + buf[5]);	
							mailer.sendMail('Alarm activation: ' + buf[5] + ' !!!!', 'ALARM ACTIVATION');
							this.doAlarmCb(buf[5]);
						} else {
							log.warn("Spurious alarm message received");
						}
					} else if (cmd == 0xbb && buf[4] == 0x20 && buf[6] == 0xdb) { // 0xbb may happen after disarming after alarm. Check bytes 4 and 6.
						log.warn("Detected Alarm!!!");
					}
				} else if (cmd == 0x64) { // also 0xCE messages could indicate arm/disarm
					if (buf[4] == 0x06) {
						// armed	
						//mailer.sendMail('Alarm has been armed', 'Alarm Armed');					
					} else if (buf[4] == 0x0c) {
						// disarmed
						//mailer.sendMail('Alarm has been disarmed', 'Alarm Disarmed');
					}
					this.doAnyCallback(new Buffer(buf));
				} else {
					if (this.checksumOk(buf)) {
						this.doAnyCallback(new Buffer(buf));
					}
				}																		
			} else {
				if (this.checksumOk(buf)) {
					this.doAnyCallback(new Buffer(buf));
				}	
			}						
		} else {
			log.warn('Unknown message type ' + msgType);
		}
		//console.log("Process msg len " + buf.length);
	}
	
	this.recvMsg = function(data) {
		data.copy(this.recvBuffer, this.recvOffset);		
		this.recvOffset += data.length;
		this.bufLen += data.length;				
		var msgLen = this.recvBuffer[0];
		//if (dscServerConfig.mode == "dev") msgLen += 1;
		if (msgLen == 0) {
			log.warn("Zero length message, ignoring");			
			return;
		}
		while (this.bufLen >= msgLen) {
			log.trace("Processing msg len " + msgLen + "/" + this.bufLen);		
			if (dscServerConfig.mode == "dev") {												
				this.processMsg(Buffer.concat([new Buffer([this.recvBuffer[0]+1, (this.recvBuffer[1] == 0x05) ?  0x01 : 0x00]), 
											   this.recvBuffer.slice(1, msgLen)]));
			} else {
				this.processMsg(this.recvBuffer.slice(0, msgLen));
			}
			//this.recvBuffer = this.recvBuffer.slice(msgLen+1,this.bufLen).copy(this.recvBuffer)
			this.recvBuffer.copy(this.recvBuffer, 0, msgLen, this.bufLen);
			this.bufLen -= msgLen;
			this.recvOffset -= msgLen;
			msgLen = this.recvBuffer[0]; 
			if (msgLen == 0) {
				log.warn("Zero length message, ignoring. Zeroing msg buffer");
				this.recvBuffer = new Buffer(8192);
				return;
			}											
		} 
	}
		

	this.listen = function() {
		net.createServer(function (sock) {
			log.info('Connection from ' + sock.remoteAddress + ':'+ sock.remotePort);
			dscServer.recvOffset = 0;
			dscServer.binMode = false;
			dscServer.socket = sock;
			
			sock.on('data', function(data) {
				//console.log('Received: "' + data + '"');
				if (!dscServer.binMode) {
					log.info("Switching to binary mode");
					sock.write("BIN\n");
					dscServer.binMode = true;
				} else {
					dscServer.recvMsg(data);
				}			
			});
		
			sock.on('close', function(data) {
				log.info('Connection from ' + sock.remoteAddress + ':'+ sock.remotePort + ' closed');
			})
			
			sock.on('error', function(err) {
				console.log("Socket error: ");
				console.log(err.stack);
			});
		}).listen(dscServerConfig.port);		
	}
	
	this.readDev = function(path) {
		fs.open(path, 'r+', function(err, fd) {	
			this.fd = fd;		
			var rs = fs.createReadStream(null, {fd: fd});
			rs.on('data', function(chunk) {
				log.trace("Reading from dev " + path);
				dscServer.recvMsg(chunk);
			});
			rs.on('end', function() {
				log.warn('dev stream ended');
			});
		}.bind(this));
	}	
}




console.log("Server started");

module.exports = dscServer;
