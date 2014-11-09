'use strict'

exports.index = function(req, res) {
  res.type('text/plain')
  // res.render('index')
  res.send('Hello There')
}
