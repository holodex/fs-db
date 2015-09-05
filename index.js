var debug = require('debug')('fsdown:')
var AbstractDown = require('abstract-stream-leveldown').AbstractStreamLevelDOWN
var defined = require('defined')
var inherits = require('inherits')
var assign = require('object-assign')

var codecs = require('./codecs')

module.exports = getFsDownCtor

function FsDown (location) {
  if (!(this instanceof FsDown))
    return new FsDown(location)

  AbstractDown.call(this, location)
}
inherits(FsDown, AbstractDown)

assign(FsDown.prototype, {
  _createReadStream: createReadStream,
  _createWriteStream: createWriteStream
})

function getFsDownCtor (options) {
  options = defined(options, {})

  var codec = getCodec(options)

  function FsDownCtor (location) {
    if (!(this instanceof FsDownCtor))
      return new FsDownCtor(location)

    this.codec = codec
    this.options = options
    FsDown.call(this, location)
  }
  inherits(FsDownCtor, FsDown)

  return FsDownCtor
}

function getCodec (options) {
  var codec = options.codec
  if (typeof codec === 'string') {
    codec = codecs[codec]
  } else if (!codec || typeof codec !== 'object') {
    codec = codecs.csv
  }
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
