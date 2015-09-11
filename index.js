var debug = require('debug')('fsdown')
var fs = require('fs')
var defined = require('defined')
var inherits = require('inherits')
var assign = require('lodash.assign')
var forEach = require('lodash.foreach')
var AbstractDown = require('abstract-stream-leveldown').AbstractStreamLevelDOWN
var through = require('through2')
var uuid = require('node-uuid')
var pumpify = require('pumpify')
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
    // parse data into objects
    .pipe(this.codec.decode(this.codecOptions))
    .pipe(through.obj(function (row, enc, cb) {
      // get key
      var key = row[keyAttribute]

      // if no key, default to UUID
      if (key == null) {
        key = uuid()
      }

      cb(null, {
        key: key,
        value: JSON.stringify(row)
      })
    }))
}

function createWriteStream (options) {
  debug('createWriteStream(', options, ')')

  var table = {}

  return pumpify.obj([
    // parse values as json
    through.obj(function (row, enc, cb) {
      row.value = JSON.parse(row.value)
      cb(null, row)
    }),
    // add current data to beginning of
    // the data that is to be written
    prepend.obj(this._createReadStream(options)),
    // construct in-memory table of data
    through.obj(
      function transform (row, enc, cb) {
        debug("transform row", row)
        // perform operation to table
        if (row.type === 'del') {
          delete table[row.key]
        } else {
          table[row.key] = row.value
        }
        cb()
      },
      function flush (cb) {
        // output contents of table
        debug("flush table", table)
        forEach(table, function (value, key) {
          this.push(value)
        }, this)
        cb()
      }
    ),
    // format data to string
    this.codec.encode(this.codecOptions),
    // write to file
    fs.createWriteStream(this.location)
  ])
}
