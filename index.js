var debug = require('debug')('fs-db')
var fs = require('fs')
var defined = require('defined')
var inherits = require('inherits')
var assign = require('lodash.assign')
var forEach = require('lodash.foreach')
var through = require('through2')
var uuid = require('node-uuid')
var pumpify = require('pumpify')
var prepend = require('prepend-stream')

var codecs = require('./codecs')

module.exports = FsDb

function FsDb (options) {
  if (!(this instanceof FsDb))
    return new FsDb(options)

  if (typeof options == 'string') {
    options = { location: options }
  } else {
    options = defined(options, {})
  }

  if (options.location == null) {
    throw new Error('fs-db: options.location is required.')
  }

  this.location = options.location
  this.codec = getCodec(options.codec)
  this.keyAttribute = defined(options.keyAttribute, 'key')
}

assign(FsDb.prototype, {
  createReadStream: createReadStream,
  createWriteStream: createWriteStream
})

function getCodec (codec) {
  var codecOptions
  if (Array.isArray(codec)) {
    codecOptions = codec[1]
    codec = codec[0]
  } else {
    codecOptions = {}
  }

  if (typeof codec === 'string') {
    codec = codecs[codec]
  } else if (!isCodec(codec)) {
    codec = codecs.csv
  }

  return {
    encode: codec.encode.bind(codec, codecOptions),
    decode: codec.decode.bind(codec, codecOptions)
  }
}

function isCodec (codec) {
  return (
    codec != null &&
    typeof codec.encode === 'function' &&
    typeof codec.decode === 'function'
  )
}

function createReadStream (options) {
  debug('createReadStream(', options, ')')

  var keyAttribute = this.keyAttribute

  return pumpify.obj([
    // read from file
    fs.createReadStream(this.location),
    // parse data into objects
    this.codec.decode(),
    through.obj(function (row, enc, cb) {
      // get key
      var key = row[keyAttribute]

      // if no key, default to UUID
      if (key == null) {
        key = uuid()
      }

      cb(null, { key: key, value: row })
    })
  ])
}

function createWriteStream (options) {
  debug('createWriteStream(', options, ')')

  var table = {}

  return pumpify.obj([
    // parse values as json
    // add current data to beginning of
    // the data that is to be written
    prepend.obj(
      this.createReadStream(options)
    ),
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
    this.codec.encode(),
    // write to file
    fs.createWriteStream(this.location)
  ])
}
