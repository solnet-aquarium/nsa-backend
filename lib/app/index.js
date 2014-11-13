var express = require('express')

var cfg = require('_/config')

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
app.locals.cfg = cfg

app.use(require('serve-static')(cfg.pubDir))
app.use(require('./routes.js'))

require('./sockets.js')(io)

module.exports = server
