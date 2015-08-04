/// <reference path="typings/node/node.d.ts" />

var net = require('net');
var config = require('config');
var log = require('./logger');

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

var MESSAGES = {0x01:	'Enter code',
				0x03:	'Close all sections',
				0x11:	'System Armed',
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
			  '*':		'*',
			  '#':		'#'
			}
			
DSCServer.prototype.beeps = BEEPS;		
			
function DSCServer() {	
	this.binMode = false;
	log.level('debug');
	this.recvBuffer = new Buffer(1024);
	this.bufLen = 0;
	this.recvOffset = 0;	
	this.statusCallback = null;
	this.ledStatus = 0;
	this.socket = null;
	this.lastStatus = null;
	this.anyCallback = null;
	
	this.doAnyCallback = function(msg) {
		if (this.anyCallback != null) {
			this.anyCallback(msg);
		}	
	}
	
	this.doStatusCallback = function(msg) {
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
			} else if (cmd == 0x0a) {				
				status.zones = msg.readUInt8(6);
				status.msgText = '. . .';
			}
			this.statusCallback(status);
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
		if (sKey != null && this.socket != null) {
			 //var sendByte = (iKey << 2) | ((((iKey >> 4) & 0x03) + ((iKey >> 2) & 0x03) + (iKey & 0x03)) & 0x03);
			 log.debug('WRITE: ' + sKey + '\n');
			 this.socket.write('WRITE: ' + sKey + '\n');			 
		}
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
			log.debug(this.messageTypes[msgType] + ': ' + (this.checksumOk(buf) ? '[OK]' : '[BAD]') );
			if (msgType == 0x00 || msgType == 0x01) {
				if (cmd == 0x05) { // 0x27 seems incorrect for LED status
					this.ledStatus = buf[4];		
					this.lastStatus = new Buffer(buf);			
				}
				if (cmd == 0x05 || cmd == 0x27 || cmd == 0x0a) {
					this.doStatusCallback(new Buffer(buf));
					if (cmd == 0x27) {
						this.doAnyCallback(new Buffer(buf));
					}
				} else {
					if (this.checksumOk(buf)) {
						this.doAnyCallback(new Buffer(buf));
					}	
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
		if (msgLen == 0) {
			log.warning("Zero length message, ignoring");
			return;
		}
		while (this.bufLen >= msgLen) {
			log.debug("Processing msg len " + msgLen + "/" + this.bufLen);				
			this.processMsg(this.recvBuffer.slice(0, msgLen));
			//this.recvBuffer = this.recvBuffer.slice(msgLen+1,this.bufLen).copy(this.recvBuffer)
			this.recvBuffer.copy(this.recvBuffer, 0, msgLen, this.bufLen);
			this.bufLen -= msgLen;
			this.recvOffset -= msgLen;
			msgLen = this.recvBuffer[0]; 											
		} 
	}
		

	this.listen = function() {
		net.createServer(function (sock) {
			log.info('Connection from ' + sock.remoteAddress + ':'+ sock.remotePort);
			dscServer.recvOffset = 0;
			dscServer.binmode = false;
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
		}).listen(dscServerConfig.port);		
	}

}




console.log("Server started");

module.exports = dscServer;