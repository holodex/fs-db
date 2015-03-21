var readdirp = require('readdirp')
var debug = require('debug')('fs-db:read-dir')

module.exports = function readDir (options) {

  var readdirpOptions = {
    root: options.location,
    fileFilter: '*.' + options.codec.type,
  }
  debug("readdirp", readdirpOptions)
  return readdirp(readdirpOptions)
}
