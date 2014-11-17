'use strict'

module.exports = function(express, cfg) {
  var app = express()
  var server = require('http').Server(app)

  app.locals.cfg = cfg

  app.use('/js', express.static(cfg.pubDir + '/js'));
  app.use('/img', express.static(cfg.pubDir + '/img'));
  app.use('/styles', express.static(cfg.pubDir + '/styles'));
  app.use('/partials', express.static(cfg.pubDir + '/partials'));
  // app.use('/templates', express.static(cfg.pubDir + '/app/templates'));

  app.all('/*', function(req, res) {
    res.sendFile('index.html', {root: cfg.pubDir});
  });

  return server
}

