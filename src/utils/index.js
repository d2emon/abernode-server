'use strict'
const file = require('../file')
const filenames = require('../file/filenames')
const config = require('../config')

/**
 * Check we are running on the correct host
 * see the notes about the use of flock();
 * and the affects of lockf();
 */
var correctHost = hostname => new Promise((resolve, reject) => {
  if (hostname === config.HOSTNAME) resolve(true)
  else reject('AberMUD is only available on ' + config.HOSTNAME + ', not on ' +
    hostname)
})
/**
 * Check if there is a no logins file active
 */
var chknolog = vars => new Promise((resolve, reject) => {
  if (config.NOLOGIN) reject(config.NOLOGIN)
  else resolve(true)
})

module.exports = {
  testhost: host => new Promise((resolve, reject) => {
    Promise.all([
      correctHost(host),
      chknolog()
    ]).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  }),
  created_at: vars => new Promise((resolve, reject) => {
    file.stat(filenames.EXE).then(response => {
      resolve(response.atime)
    }).catch(error => {
      resolve('<unknown>')
    })
  }),
  reset_at: vars => new Promise((resolve, reject) => {
    let filedata = {}
    file.requestOpenRead(filenames.RESET_N).then(response => {
      filedata = response
      return file.requestReadLine(response)
    }).then(response => {
      file.requestClose(filedata)
      resolve(response)
    }).catch(error => {
      resolve(false)
    })
  })
}
