/// <reference path="typings/node/node.d.ts" />

'use strict';


var dscapp     = require('./server.js');

module.exports = function startServer(port, path, callback) {
	dscapp.getServer(port, path).listen(port, callback);
};