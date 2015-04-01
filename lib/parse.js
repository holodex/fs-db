var isPlainObject = require('is-plain-object')
var toJsonPointer = require('json-pointer').compile
var pull = require('pull-stream')
var debug = require('debug')('fs-db:parse')

module.exports = pull.Through(function contentParser (read, options) {
  
  var codec = options.codec

  return function parseContent (end, cb) {
    read(end, function (end, file) {
      if (end) { return cb(end) }
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
        cb(null, obj)

        return obj.id
      })
    })
  }
})

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
