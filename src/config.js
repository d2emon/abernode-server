'use strict'

function pfl () {
  return {
    username: '',
    password: '',
    dcrypt: function () {
      // scan(dcrypt(block), 0, "", ".").output
      // scan(block, wkng.id + 1, "", ".").output
      return {
        username,
        password,
        v3: null,
        v4: null,
        v5: null,
        v6: null
      }
    }
  }
}

module.exports = {
  HOSTNAME: '127.0.0.1',
  // NOLOGIN: 'No login example\nCould be multilined',
  NOLOGIN: false,
  BANNED: [],
  PFL: []
}
