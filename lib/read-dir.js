var readdirp = require('readdirp')
var streamToPull = require('stream-to-pull-stream')
var debug = require('debug')('fs-db:read-dir')

module.exports = function readDir (options) {

  var readdirpOptions = {
    root: options.location,
    fileFilter: '*.' + options.codec.type,
  }
  debug("readdirp", readdirpOptions)
  return streamToPull.source(
    readdirp(readdirpOptions)
  )
}
