'use strict'


var cfg = require('_/config')
var express = require('express')
var database = require('_/database')

database.connect(cfg.db)

var server = require('./config/express.js')(express, cfg)

var io = require('socket.io')(server)

require('_/sockets')(io)


module.exports = server
