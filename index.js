var readdirp = require('readdirp')
var through = require('through2')
var setIn = require('set-in')
var debug = require('debug')('directory-content')

module.exports = function directoryContent(opts, cb) {
  debug('directoryContent(', opts, cb.toString(), ')')

  var fs = opts.fs || require('fs')

  var obj = {}

  readdirp(opts)
  .on('warn', function (err) {
    debug('readdirp non-fatal error', err)
  })
  .on('error', function (err) {
    debug('readdirp fatal error', err)
    cb(err)
  })
  .pipe(through.obj(function (entry, _, next) {

    debug('readFile(', entry.fullPath, ')')
    fs.readFile(entry.fullPath, {
      encoding: opts.fileEncoding || 'utf8',
    }, function (err, contents) {
      debug('readFile() ->', err, contents)
      if (err) { return next(err) }

      var objPath = fsPathToObjPath(entry.path)

      setIn(obj, objPath, contents)
      debug('set obj', obj)

      next()
    }.bind(this))
  }))
  .on('error', function (err) {
    debug('through stream fatal error', err)
    cb(err)
  })
  .on('finish', function () {
    debug('directoryContent() ->', obj)
    cb(null, obj)
  })
}

function fsPathToObjPath (fsPath) {
  debug('fsPathToObjPath(', fsPath, ')')
  var objPath = fsPath.split('/')
  debug('fsPathToObjPath() ->', objPath)
  return objPath
}
