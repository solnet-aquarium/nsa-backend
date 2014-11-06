var express = require('express')
var cfg = require('_/config')

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

module.exports = server
