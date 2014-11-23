'use strict'

var events = require('_/events')
var cfg = require('_/config')
var database = require('_/database')
var utils = require('./utils')

database.connect(cfg.db)

var shoud = require('chai').should()

process.env.NODE_ENV = 'test'

describe('database', function() {
  describe('connect', function() {

  })

})
