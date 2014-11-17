'use strict'



var sockets = function sockets(io) {
  if (!io) {
    throw new Error('Socket.io instance is required')
  }
  var self = {}
  self.io = io

  var events = require('_/events')

  io.of('timeping')
    .on('connection', function(socket) {
      var count = 1;
      var interval = setInterval(function() {
        socket.emit('timeping', {'time': JSON.stringify(new Date())})
        if (count++ === 10) { clearInterval(interval) }
      }, 1000)
    })

  self.register = io.of('register')
      .on('connection', function(socket) {
        socket.on('registration', function(from, msg) {
          events.notifyRegistration({ user: from, data: msg })
        })
      })

  events.registrationError(function(error) {
    self.register.emit('registrationError', error)
  })

  events.registrationToken(function(token) {
    self.register.emit('registrationToken', token)
  })

  return self
}


module.exports = sockets
