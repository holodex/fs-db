var debug = require('debug')('fsdown:')
var AbstractStreamLevelDown = require('abstract-stream-leveldown')
var inherits = require('inherits')
var defined = require('defined')

module.exports = FsDown

function FsDown (location, options) {
  if (!(this instanceof FsDown)) {
    return new FsDown(location, options)
  }

  debug("constructor(", location, options, ")")

  this.location = defined(location, process.cwd())
}
inherits(FsDown, AbstractStreamLevelDown)

FsDown.prototype = {
  _createReadStream: createReadStream,
  _createWriteStream: createWriteStream,
}

function createReadStream () {
  debug('createReadStream()')

  // get file read stream
  // read file
  // parse input
}

function createWriteStream () {
  debug('createWriteStream()')

  // get file write stream
  // format output
  // write to file
}
