/// <reference path="typings/node/node.d.ts" />
var bodyParser = require('body-parser');
var express    = require('express');
var http       = require('http');
var logger     = require('morgan');
var Path       = require('path');
var dscserver = require ('./dscserver.js');
var log = require('./logger')
var util = require('util');

function start(port, path) {
	dscserver.listen();
	var app = express();	
	app.set('view engine', 'jade');
	app.set('views', 'app/templates');
  	var server = http.createServer(app);
	var io = require('socket.io')(server);
  
	
	app.get('/', function (req, res) {
  		//res.send('Hello World!');
		res.render('index', { title: 'DSC Alarm' });
	});
	app.use(express.static(Path.join(__dirname, path)));
	//app.use(express.static(__dirname));
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({ extended: true }));
	console.log("Listening on port " + port);

	dscserver.statusCallback = function(status) {		
		log.info('Sending status ' + util.inspect(status));
		io.emit('status', status);
		if (status.leds != undefined) {
			io.emit('leds', status.leds);
		}
	}

	io.on('connection', function(socket) {
		log.info('Connection received: ' + socket.id);		
		dscserver.pokeStatus();
		socket.on('key', function(data) {
			log.info('KeyPress: ' + data);
			dscserver.sendKey(data);
			
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
