'use strict'

var events = require('_/events')
var shoud = require('chai').should()


describe('events', function() {
  describe('registration', function() {
    it('should emit a registration event', function(done) {
      var hasRegistered = false
      events.registration(function(data) {
        hasRegistered = true
        done();
      })

      events.notifyRegistration({test: true})

      hasRegistered.should.equal(true)
    });

    it('should emit a registration error', function(done) {
      var hasRegistered = false
      events.registrationError(function(data) {
        hasRegistered = true
        done();
      })

      events.notifyRegistrationError({test: true})

      hasRegistered.should.equal(true)
    });


    it('should emit a registration token', function(done) {
      var hasRegistered = false
      events.registrationToken(function(data) {
        hasRegistered = true
        done();
      })

      events.notifyRegistrationToken({test: true})

      hasRegistered.should.equal(true)
    });
  })
})
