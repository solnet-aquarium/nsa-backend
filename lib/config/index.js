var env = process.env.NODE_ENV || 'development'
var resolve = require('path').resolve

// env specific config
var cfg = require('./env/'+env)
cfg.env = env

if (process.env.OPENSHIFT_NODEJS_PORT) {
  cfg.port = process.env.OPENSHIFT_NODEJS_PORT
}

// env agnostic config
cfg.pubDir = resolve(__dirname, '../../public')

module.exports = cfg
