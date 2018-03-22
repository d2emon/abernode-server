'use strict'
const express = require('express')
const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')
const utils = require('../utils')
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

router.post('/login', [
  check('uid')
    /**
     * Check if banned first
     */
    .custom(value => utils.chkbnid(value)),
  check('username')
    .exists()
    .trim()
    .isLength({ min: 3, max: 15 })
    /**
     * Check for legality of names
     */
    .matches(/^[a-z]*$/).withMessage('Illegal characters in user name')
    .custom(value => {
      if (!utils.validname(value)) throw new Error('Bye Bye')
      return true
    }),
  // General error messages can be given as a 2nd argument in the check APIs
  check('password', 'passwords must be at least 5 chars long and contain one number')
    // .exists()
    .isLength({ min: 3, max: 15 })
    .matches(/^[a-z\d]*$/).withMessage('Illegal characters in password')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }


  const user = matchedData(req)
  console.log('USER IS ' + JSON.stringify(user.username))
  // createUser(user).then(user => res.json(user));

  // let isNew = !server_logscan(user)
  user.isNew = true
  console.log(user)
  console.log(req.body)
  Promise.all([
    // utils.testhost(req.query.host),
    utils.testhost(req.hostname),
    utils.login(user)
  ]).then(response => {
    // res.setHeader('Content-Type', 'application/json')
    // res.send(JSON.stringify(response[1]))
    console.log(response)
    res.json(response[1])
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
