'use strict'

var events = require('_/events')
var database = require('_/database')
var utils = require('./utils')

database.connect()

var shoud = require('chai').should()

process.env.NODE_ENV = 'test'

describe('database', function() {
  describe('connect', function() {

  })

})
