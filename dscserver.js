/// <reference path="typings/node/node.d.ts" />

var net = require('net');
var config = require('config');

var dscServerConfig = config.get('dscServer');

function DSCServer() {
	this.binMode = false;

	this.recvBuffer = [];
	
	this.recvMsg = function(msg) {
		
	}
		

	this.listen = function() {
		net.createServer(function (sock) {
			console.log('Connection from ' + sock.remoteAddress + ':'+ sock.remotePort);
			sock.on('data', function(data) {
				console.log('Received: "' + data + '"');
				if (!this.binMode) {
					console.log("Switching to binary mode");
					sock.write("BIN\n");
					this.binMode = true;
				}				
			});
		
			sock.on('end', function(data) {
				console.log('Connection from ' + sock.remoteAddress + ':'+ sock.remotePort + ' closed');
			})
		}).listen(dscServerConfig.port);		
	}

}




console.log("Server started");

module.exports = new DSCServer();