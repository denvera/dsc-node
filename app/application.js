"use strict";

var App = { 
  init: function init() {       
    var socket = io();
    var c = require('components'); 
    c.setSocket(socket);
    console.log('App initialized.');
    
    
  }
};

module.exports = App;