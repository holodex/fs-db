var debug = require('debug')('fsdown')
var fs = require('fs')
var defined = require('defined')
var inherits = require('inherits')
var assign = require('object-assign')
var AbstractDown = require('abstract-stream-leveldown').AbstractStreamLevelDOWN
var through = require('through2')
var uuid = require('node-uuid')

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

function getFsDownCtor (codec, options) {
  codec = getCodec(codec)
  options = defined(options, {})

  function FsDownCtor (location) {
    if (!(this instanceof FsDownCtor))
      return new FsDownCtor(location)

    this.codec = codec
    this.options = options
    this.keyAttribute = defined(options.keyAttribute, 'key')

    FsDown.call(this, location)
  }
  inherits(FsDownCtor, FsDown)

  return FsDownCtor
}

function getCodec (codec) {
  if (typeof codec === 'string') {
    codec = codecs[codec]
  } else if (codec == null || typeof codec !== 'object') {
    codec = codecs.csv
  }
  return codec
}

function createReadStream () {
  debug('createReadStream()')

  var keyAttribute = this.keyAttribute

  // read from file
  return fs.createReadStream(this.location)
    // parse input
    .pipe(this.codec.decode(this.options))
    .pipe(through.obj(function (row, enc, cb) {
      var key = row[keyAttribute]

      if (key == null) {
        key = uuid()
      }

      cb(null, {
        key: row[keyAttribute],
        value: row
      })
    }))
}

function createWriteStream () {
  debug('createWriteStream()')

  // get file write stream
  // format output
  // write to file
}
