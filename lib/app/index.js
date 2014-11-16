'use strict'

var express = require('express')
var path = require('path')
var cfg = require('_/config')

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
app.locals.cfg = cfg

app.use('/js', express.static(cfg.pubDir + '/js'));
app.use('/img', express.static(cfg.pubDir + '/img'));
app.use('/css', express.static(cfg.pubDir + '/css'));
app.use('/partials', express.static(cfg.pubDir + '/partials'));
// app.use('/templates', express.static(cfg.pubDir + '/app/templates'));

require('./sockets.js')(io)

app.all('/*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../../public')});
});

module.exports = server
