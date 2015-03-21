var through = require('pull-through')
var debug = require('debug')('fs-db')

module.exports = function contentReader (options) {

  var fs = options.fs

  return through(readContent)

  function readContent (entry) {
    var stream = this
    debug("entry", entry)

    debug('readFile(', entry.fullPath, ')')
    fs.readFile(entry.fullPath, 'utf8', function (err, content) {
      debug('readFile() ->', err, content)

      if (err) { return next(err) }

      var file = {
        path: entry.path,
        content: content,
      }
      debug('pushing', file)
      stream.queue(file)
    })
  }
}
