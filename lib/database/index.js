'use strict'

var mongoose = require('mongoose')
var events = require('_/events')

var database = {
  connect: function(db) {

    if (!db) {
      throw new Error('database config is required')
    }

    var fs = require('fs')

    // Connect to mongodb
    var connect = function() {
      var options = {server: {socketOptions:{keepAlive: 1}}};
      mongoose.connect(db, options);
    };
    connect();

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', connect);

    // Bootstrap models
    fs.readdirSync(__dirname + '/models').forEach(function(file) {
      if (file.indexOf('.js')) { require(__dirname + '/models/' + file) }
    })
    return mongoose
  }

}

events.registration(function(data) {
  //store new user and return a token
  var User = mongoose.model('User')
  var user = new User(data)
  user.token = user.createToken();

  user.save(function(err) {
    if (err) {
      return events.notifyRegistrationError({error: err})
    }
    events.notifyRegistrationToken(user.token)
  })
})


module.exports = database
