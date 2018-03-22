'use strict'
const chalk = require('chalk')
const file = require('../file')
const filenames = require('../file/filenames')
const config = require('../config')

function scan (input, start, skips, stop) { return input }
function validname (name) { return true }
function logscan (uid, block) { return false }
function qcrypt(block, length) {
  console.log('QCRYPT(' + block + ', *"", ' + length + ')')
  return block
}

function chkname(user) {
  return /^[a-z]{3,8}$/.test(user.toLowerCase())
}

var listfl = (filename) => new Promise((resolve, reject) => {
  file.requestOpenRead(filename, true).then(response => {
    return file.requestReadLines(response)
  }).then(response => {
    resolve({ motd: response })
  }).catch(error => {
    reject('[Cannot Find -> ' + filename + ']')
  })
})

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

/* Check to see if UID in banned list */
var chkbnid = user => new Promise((resolve, reject) => {
  config.BANNED.forEach(item => {
    if (!item) return
    if (item.toLowerCase() === user.toLowerCase()) {
      reject('I\'m sorry- that userid has been banned from the Game\n')
      return
    }
  })
  resolve(user)
})


var loadUser = user => new Promise((resolve, reject) => {
  if (!config.PFL) throw new Error('No persona file')
  config.PFL.forEach(block => {
    if (block.username.toLowerCase() == user.username.toLowerCase()) {
      block.isNew = false
      resolve(block)
    }
  })
  user.isNew = true
  resolve(user)
})

var saveUser = user => new Promise((resolve, reject) => {
  user.saved = false
  if ((!user.username) || (!user.password)) {
    resolve(user)
    return
  }

  let userdata = {
    username: user.username,
    password: user.password,
    v3: null,
    v4: null,
    v5: null,
    v6: null
  }
  if (!config.PFL) throw new Error('No persona file')
  config.PFL.push(userdata)

  userdata.isNew = user.isNew
  userdata.saved = true
  resolve(userdata)
})

/* Main login code */
// Password checking
var login = user => new Promise((resolve, reject) => {
  console.log('USERNAME IS ' + JSON.stringify(user.username))
  console.log('PASSWORD IS ' + JSON.stringify(user.password))

  loadUser(user).then(response => {
    console.log(response)
    console.log(config)
    if (response.isNew) return saveUser(response)
    else return response
  }).then(response => {
    resolve(response)
  }).catch(error => {
    reject(error)
  })
})

var logRecord = str => new Promise((resolve, reject) => {
  console.log(chalk.blue(str)) // syslog
  resolve(true)
})

var logEnter = user => new Promise((resolve, reject) => {
  /* Log entry */
  logRecord('Game entry by ' + user.username + ' : UID ' + user.uid) // syslog
  resolve(true)
})

var doTalker = vars => new Promise((resolve, reject) => {
  console.log('TALKER(' + JSON.stringify(vars) + ')')
  resolve(true)
})

module.exports = {
  chkbnid,
  validname: name => {
    return true
  },
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
  }),
  /* Does all the login stuff */
  /* The whole login system is called from this */
  login,
  /* list the message of the day */
  motd: vars => new Promise((resolve, reject) => {
    listfl(filenames.MOTD).then(response => {
      resolve(response)
    }).catch(error => {
      resolve(error)
    })
  }),
  // Requests
  talker: vars => new Promise((resolve, reject) => {
    console.log(vars)
    Promise.all([
      logEnter(vars.user),
      doTalker(vars.user)
    ]).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
