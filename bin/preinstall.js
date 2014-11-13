var fs = require('fs')
var npm = require('npm')
var path = require('path')

var libDir = path.resolve(__dirname, '../lib/')
var frontDir = path.resolve(__dirname, '../frontend/')
var noop = function() {}

npm.load(function () {
  fs.readdirSync(libDir).forEach(function (mod) {
    npm.prefix = path.join(libDir, mod)
    npm.commands.install(noop)
  })

    npm.prefix = frontDir
    npm.commands.install(noop)
})


