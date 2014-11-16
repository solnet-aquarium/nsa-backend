'use strict'

module.exports = function sockets(io) {
  if (!io) {
    throw new Error('Socket.io instance is required')
  }

  io.of('timeping')
    .on('connection', function(socket) {
      var count = 1;
      var interval = setInterval(function() {
        socket.emit('timeping', {'time': JSON.stringify(new Date())})
        if (count++ === 10) { clearInterval(interval) }
      }, 1000)
    })
}
