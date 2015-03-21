var isPlainObject = require('is-plain-object')
var toJsonPointer = require('json-pointer').compile
var through = require('pull-through')
var debug = require('debug')('fs-db:parse')

module.exports = function contentParser (options) {
  
  var codec = options.codec

  return through(parseContent)

  function parseContent (file) {
    var stream = this
    debug("file", file)

    var rootPath = file.path.split('.' + codec.type)[0]

    // TODO try catch
    var content = codec.decode(file.content)

    debug("content", content)

    // identify nodes in contentObj
    traverse(content, [], function (obj, path) {

      if (!obj.id && path.length === 0) {
        obj.id = rootPath
      } else if (!obj.id) {
        obj.id = rootPath + "#" + toJsonPointer(path)
      }

      debug("pushing", obj)
      stream.queue(obj)

      return obj.id
    })
  }
}

function traverse (obj, path, cb) {
  debug("traverse", obj, path)

  if (!isPlainObject(obj)) {
    return obj
  }

  Object.keys(obj).forEach(function (key) {
    var val = obj[key]

    if (isPlainObject(val)) {
      obj[key] = traverse(val, path.concat(key), cb)
    } else if (Array.isArray(val)) {
      obj[key] = val.map(function (item, index) {
        return traverse(item, path.concat([key, index]), cb)
      })
    }
  })

  return cb(obj, path)
}
