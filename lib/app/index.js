'use strict'


var cfg = require('_/config')
var express = require('express')
var database = require('_/database')

database.connect(cfg)

var server = require('./config/express.js')(express, cfg)

var io = require('socket.io')(server)

require('./sockets.js')(io)

module.exports = server
