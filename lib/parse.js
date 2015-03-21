var traverse = require('traverse')
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
      traverse(content).forEach(function (node) {
        if (!(typeof node === 'object')) {
          return
        }

        if (!node.id && this.isRoot) {
          node.id = rootPath
        } else if (!node.$id) {
          node.id = rootPath + "#" + toJsonPointer(this.path)
        }

        debug("pushing", node)
        cb(null, node)
      })
    })
  }
})
