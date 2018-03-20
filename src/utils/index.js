'use strict'
const file = require('../file')
const filenames = require('../file/filenames')
const config = require('../config')

function any (ch, str) { return false }
function scan (input, start, skips, stop) { return input }
function validname (name) { return true }

function chkname(user) {
  return /^[a-z]{3,8}$/.test(user.toLowerCase())
}

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

var chkbnid = (user) => new Promise((resolve, reject) => {
  /* Check to see if UID in banned list */
  config.BANNED.forEach(item => {
    if (!item) return
    if (item.toLowerCase() === user.toLowerCase()) {
      reject('I\'m sorry- that userid has been banned from the Game\n')
      return
    }
  })
  resolve(user)
})

var testUsername = user => new Promise((resolve, reject) => {
  console.log('USER IS ' + JSON.stringify(user.username))
  if (!user.username) {
    reject({
      isNew: false,
      username: false,
      password: false,
      error: 'By what name shall I call you ?'
    })
    return
  }
  user.username = user.username.slice(0, 15)
  /**
   * Check for legality of names
   */
  if (!user.username) {
    reject({
      isNew: false,
      username: false,
      password: false,
      error: 'By what name shall I call you ?'
    })
    return
  }
  if (any('.', user.username)) {
    reject({
      isNew: false,
      username: false,
      password: false,
      error: 'Illegal characters in user name'
    })
    return
  }
  user.username = user.username.trim()
  user.username = scan(user.username, 0, ' ', '')

  if (!user.username) {
    reject({
      isNew: false,
      username: false,
      password: false,
      error: 'By what name shall I call you ?'
    })
    return
  }
  if (!chkname(user.username)) {
    reject({
      isNew: false,
      username: false,
      password: false,
      error: 'By what name shall I call you ?'
    })
    return
  }
  let usrnam = user.username
  if (!validname(usrnam)) {
    reject({
      isNew: false,
      username: false,
      password: false,
      error: 'By what name shall I call you ?'
    })
    return
  }
  resolve(true)
})

// Password checking
var testPassword = user => new Promise((resolve, reject) => {
  console.log('PASSWORD IS ' + JSON.stringify(user.password))
  let newUser = true
  /*
  logpass(user).then(response => {
    console.log(chalk.magenta('LOGPASS\t') +
      chalk.yellow(response))
    resolve(response)
  }).catch(error => {
    // console.error(chalk.red('Username Error:\t' + JSON.stringify(error)))
    reject(error)
  })
  */

  if (any('.', user.password)) {
    reject({
      isNew: newUser,
      username: user.username,
      password: false,
      error: 'Illegal character in password'
    })
    return
  }
  if (!user.password) reject({
    isNew: newUser,
    username: user.username,
    password: false,
    error: ''
  })
  let uid = user.username
  let pwd = user.password
  let block = JSON.stringify(uid) + '.' + pwd + '....'

  console.log(JSON.stringify(user))
  console.log(chalk.yellow(block))

  file.requestOpenAppend(PFL, true).then(response => {
    let lump = qcrypt(block, block.length)
    block = lump
    return file.requestPrint(response, block + '\n')
  }).then(response => {
    file.requestClose(response)
    user.block = block
    user.pfl = response
    user.isNew = newUser
    resolve(user)
  }).catch(error => {
    console.log('New User Error' + JSON.stringify(error))
    reject({
      isNew: newUser,
      username: user.username,
      password: user.password,
      error: 'No persona file....'
    })
  })
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
  }),
  /* Does all the login stuff */
  login: vars => new Promise((resolve, reject) => {
    /* The whole login system is called from this */
    console.log('LOGGING IN AS ' + JSON.stringify(vars.username))
    // Check if banned first
    chkbnid('' + vars.uid).then(response => {
      // Get the user name
      console.log(JSON.stringify(vars.uid) + ' IS NOT BANNED')
      return testUsername(vars)
    }).then(response => {
      return testPassword(vars)
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
      // user = getkbd().slice(0, 15)
    })
  })
}
