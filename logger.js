var bunyan = require("bunyan"); // Bunyan dependency
var logger = bunyan.createLogger({name: "dscserver"});

module.exports = logger;