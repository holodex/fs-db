var pull = require('pull-stream')
var debug = require('debug')('fs-db')

module.exports = function contentReader (options) {

  var fs = options.fs

  return pull.asyncMap(readContent)

  function readContent (entry, cb) {
    debug("entry", entry)

    debug('readFile(', entry.fullPath, ')')
    fs.readFile(entry.fullPath, 'utf8', function (err, content) {
      debug('readFile() ->', err, content)

      if (err) { return cb(err) }

      var file = {
        path: entry.path,
        content: content,
      }
      debug('pushing', file)
      cb(null, file)
    })
  }
}
