'use strict';

var express    	= require('express');
var http       	= require('http');
var Path       	= require('path');
var config 		= require('config');
var bodyParser 	= require('body-parser');
var logger     	= require('morgan');
var dscapp = require('./src/server.js');
var compression = require('compression');
//var log 		= require('./src/logger')

function getServer(path) {

var c = config.get('dscServer');

var app = express();
app.use(compression());
app.set('views', './app/views')
//app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');
//app.set('views', 'app/templates');

var server = http.createServer(app);
var io = require('socket.io')(server);


app.get('/', function (req, res) {
  res.render('index', { title: 'DSC Alarm' });
});
app.use(express.static(Path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
console.log("Listening on port " + (process.env.PORT || 3333));
dscapp.getServer(c, io)
return server;
}

module.exports = function(port, path, callback) {
  getServer(path).listen(port, callback);
}
if (require.main === module) {
  getServer('public').listen(process.env.PORT || 3333);
}
