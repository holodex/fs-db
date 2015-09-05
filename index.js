var debug = require('debug')('fsdown:')
var stampit = require('stampit')
var AbstractDown = stampit.convertConstructor(require('abstract-stream-leveldown'))
var defined = require('defined')

var codecs = require('./codecs')

module.exports = configureFsDown

var FsDown = stampit({
  props: {
    _createReadStream: createReadStream,
    _createWriteStream: createWriteStream,
  },
}).compose(AbstractDown)

function configureFsDown (options) {
  options = defined(options, {})

  return FsDown.props({
    codec: getCodec(options),
    options: options
  })
}

module.exports = configureFsDown

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
