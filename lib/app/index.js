'use strict'


var cfg = require('_/config')
var fs = require('fs')
var express = require('express')
var mongoose = require('mongoose')

var server = require('./config/express.js')(express, cfg)

// Connect to mongodb
var connect = function() {
  var options = {server: {socketOptions:{keepAlive: 1}}};
  mongoose.connect(cfg.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/models').forEach(function(file) {
  if (file.indexOf('.js')) { require(__dirname + '/models/' + file) }
})


var io = require('socket.io')(server)

require('./sockets.js')(io)

module.exports = server
