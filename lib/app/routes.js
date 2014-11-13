var express = require('express')
var router = express.Router()
var ctrl = require('./controllers')

router.get('/', ctrl.index)
router.get('/partials/:name', ctrl.partials)

router.get('*', ctrl.index);

module.exports = router
