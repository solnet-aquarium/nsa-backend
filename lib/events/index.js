'use strict'

var EventEmitter = require('events').EventEmitter
var util = require('util')

var events = function() {
  EventEmitter.call(this)
}

util.inherits(events, EventEmitter)

events.prototype.registration = function(callback) {
  this.on('registration', function(data) {
    callback(data)
  })
}

events.prototype.notifyRegistration = function(data) {
  this.emit('registration', data)
}

events.prototype.registrationError = function(callback) {
  this.on('registrationError', function(error) {
    callback(error)
  })
}

events.prototype.notifyRegistrationError = function(data) {
  this.emit('registrationError', data)
}

events.prototype.registrationToken = function(callback) {
  this.on('registrationToken', function(token) {
    callback(token)
  })
}

events.prototype.notifyRegistrationToken = function(token) {
  this.emit('registrationToken', token)
}

var eventInst = new events()

module.exports = eventInst




