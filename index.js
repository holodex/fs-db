var readdirp = require('readdirp')
var combiner = require('stream-combiner2')
var debug = require('debug')('fs-db')

var codecs = require('./codecs')

module.exports = FsDb

function FsDb (options) {
  if (!(this instanceof FsDb)) {
    return new FsDb(options)
  }
  debug("constructor(", options, ")")

  this.location = options.location || process.cwd()
  this.fs = options.fs || require('fs')

  var codec = options.codec || 'json'
  this.codec = (typeof codec === 'string') ?
    codecs[codec] : codec
}

FsDb.prototype = {
  createReadStream: createReadStream,
}

function createReadStream () {
  debug('createReadStream()')

  return combiner(
    readdirp({
      root: this.location,
      fileFilter: "*." + this.codec.type
    }),
    require('./lib/read')({
      fs: this.fs,
    }),
    require('./lib/parse')({
      codec: this.codec,
    })
  )
}
