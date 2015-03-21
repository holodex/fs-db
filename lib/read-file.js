var through = require('through2')
var debug = require('debug')('fs-db')

module.exports = function contentReader (options) {

  var fs = options.fs

  return through.obj(readContent)

  function readContent (entry, _, next) {
    debug("entry", entry)

    var stream = this

    debug('readFile(', entry.fullPath, ')')
    fs.readFile(entry.fullPath, 'utf8', function (err, content) {
      debug('readFile() ->', err, content)

      if (err) { return next(err) }

      var item = {
        path: entry.path,
        content: content,
      }
      debug('pushing', item)
      this.push(item)

      next()
    }.bind(this))
  }
}
