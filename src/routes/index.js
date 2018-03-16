'use strict'
var express = require('express')
var utils = require('../utils')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

router.get('/stats', (req, res, next) => {
  Promise.all([
    // utils.testhost(req.query.host),
    utils.testhost(req.hostname),
    utils.created_at(req),
    utils.reset_at(req)
  ]).then(response => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      created: response[1],
      reset: response[2]
    }))
  }).catch(error => {
    console.log(error)
    // reject(error)
    res.status(403).send(JSON.stringify({
      error: error
    }))
  })
})

module.exports = router
