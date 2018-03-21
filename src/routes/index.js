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

router.post('/login', (req, res, next) => {
  console.log(req.body)
  Promise.all([
    // utils.testhost(req.query.host),
    utils.testhost(req.hostname),
    utils.login(req.body)
  ]).then(response => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(response[1]))
  }).catch(error => {
    console.log(error)
    // reject(error)
    res.status(403).send(JSON.stringify(error))
  })
})

router.get('/motd', (req, res, next) => {
  utils.motd().then(response => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(response))
  }).catch(error => {
    console.log(error)
    res.status(500).send(JSON.stringify({
      error: error
    }))
  })
})

router.post('/main', (req, res, next) => {
  utils.talker(req.body).then(response => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(response))
  }).catch(error => {
    console.log(error)
    res.status(500).send(JSON.stringify({
      error: error
    }))
  })
})

module.exports = router
