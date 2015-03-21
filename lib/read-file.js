var pull = require('pull-stream')
var debug = require('debug')('fs-db')

module.exports = pull.Through(function contentReader (read, options) {

  var fs = options.fs

  return function readContent (end, cb) {
    read(end, function (end, entry) {
      if (end) { return cb(end) }
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
        cb(null, file)
      })
    })
  }
})
