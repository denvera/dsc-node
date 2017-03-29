var bunyan = require("bunyan"); // Bunyan dependency
var logger = bunyan.createLogger({
	name: "dscserver",
	streams: [
		{
		level: 'debug',
		stream: process.stdout            // log INFO and above to stdout
		},
		{
		type: 'rotating-file',
		level: 'info',
		path: 'log/dsc-node.log',
		period: '1d',
		count: 14
		}
	]
});

module.exports = logger;