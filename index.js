var debug = require('debug')('fsdown')
var fs = require('fs')
var defined = require('defined')
var inherits = require('inherits')
var assign = require('lodash.assign')
var forEach = require('lodash.foreach')
var AbstractDown = require('abstract-stream-leveldown').AbstractStreamLevelDOWN
var through = require('through2')
var uuid = require('node-uuid')
var combine = require('stream-combiner2')
var prepend = require('prepend-stream')

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

function getFsDownCtor (options, codecOptions) {
  options = defined(options, {})
  codecOptions = defined(codecOptions, {})

  var codec = getCodec(options.codec)
  var keyAttribute = defined(options.keyAttribute, 'key')

  function FsDownCtor (location) {
    if (!(this instanceof FsDownCtor))
      return new FsDownCtor(location)

    this.codec = codec
    this.codecOptions = codecOptions
    this.keyAttribute = keyAttribute

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

function createReadStream (options) {
  debug('createReadStream(', options, ')')

  var keyAttribute = this.keyAttribute

  // read from file
  return fs.createReadStream(this.location)
    // parse input
    .pipe(this.codec.decode(this.codecOptions))
    .pipe(through.obj(function (row, enc, cb) {
      var key = row[keyAttribute]

      if (key == null) {
        key = uuid()
      }

      cb(null, {
        key: key,
        value: row
      })
    }))
}

function createWriteStream (options) {
  debug('createWriteStream(', options, ')')

  var table = {}

  // write current content
  // plus additional changes
  return combine.obj([
    through.obj(function (row, enc, cb) {
      row.value = JSON.parse(row.value)
      cb(null, row)
    }),
    prepend.obj(this._createReadStream(options)),
    through.obj(
      function transform (row, enc, cb) {
        debug("transform row", row)
        // construct in-memory table
        if (row.type === 'del') {
          delete table[row.key]
        } else {
          table[row.key] = row.value
        }
        cb()
      },
      function flush (cb) {
        // output in-memory table
        debug("flush table", table)
        forEach(table, function (value, key) {
          this.push(value)
        }, this)
        cb()
      }
    ),
    this.codec.encode(this.codecOptions),
    fs.createWriteStream(this.location)
  ])
}
