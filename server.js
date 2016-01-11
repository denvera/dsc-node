/// <reference path="typings/node/node.d.ts" />
var bodyParser 	= require('body-parser');
var express    	= require('express');
var http       	= require('http');
var logger     	= require('morgan');
var Path       	= require('path');
var dscserver	= require ('./dscserver.js');
var log 		= require('./logger')
var util 		= require('util');
var _  			= require('lodash');
var config 		= require('config'); 
var Storage = require('node-storage');

function start(port, path) {	
	var c = config.get('dscServer');
	if (c.mode == "dev") {
		dscserver.readDev("/dev/dsc_bin");
	} else {
		dscserver.listen();
	}
	var app = express();
	app.set('view engine', 'jade');
	app.set('views', 'app/templates');
  	var server = http.createServer(app);
	var io = require('socket.io')(server);


	app.get('/', function (req, res) {  		
		res.render('index', { title: 'DSC Alarm' });
	});
	app.use(express.static(Path.join(__dirname, path)));	
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({ extended: true }));
	console.log("Listening on port " + port);

	dscserver.statusCallback = function(status) {
		log.debug('Sending status ' + util.inspect(status));
		io.emit('status', status);
		if (status.leds != undefined) {
			io.emit('leds', status.leds);
		}
	}
	
	dscserver.anyCallback = function(event) {
		var e = {};
		e.type = dscserver.messageTypes[event[1]];
		e.cmd = event[2];
		e.time = new Date().toISOString();
		e.body = _.map(event.slice(2), function(n) { return "0x"+ n.toString(16).toUpperCase() } ).join(" ");
		io.emit('event', e);
		if (e.cmd == 0x64) {
			var beep = {};			
			beep.long = dscserver.beeps[event[4]] == 99;
			beep.count = dscserver.beeps[event[4]];
			io.emit('beep', beep); 			
		}
	}
	io.on('connection', function(socket) {
		log.info('Connection received: ' + socket.id);
		dscserver.pokeStatus();
		socket.on('key', function(data) {
			log.info('KeyPress: ' + data);
			dscserver.sendKey(data);

		});
		socket.on('poke', function(data) { 
			log.info('Poke: ' + data);
			if (data == 'status') {
				dscserver.pokeStatus();
			} else if (data == 'jobs') {
				io.emit('jobs', dscserver.jobs);
			}
		});
		socket.on('addjob', function(job, cb) {
			log.info('Add job: ' + util.inspect(job));			
			cb(dscserver.addJob(job.spec, job.action, job.name));
		});
		socket.on('deljob', function(idx) {
			log.info('Delete job at index ' + idx);
			dscserver.delJob(idx);
		});
		socket.on('upgrade', function(c) {
			log.warn('Performing upgrade');
			dscserver.upgrade();
		});
		/*socket.on('disconnect', function(socket) {
			dscserver.statusCallback = null;
		});*/
	});


	return server;
}

module.exports.getServer = function getServer(port, path) {
	return start(port, path);
}

//start(3333, "public");
