'use strict'

var database = {
  connect: function(cfg) {

    var fs = require('fs')
    var mongoose = require('mongoose')

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
  }

}

module.exports = database
