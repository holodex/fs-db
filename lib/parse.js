var isPlainObject = require('is-plain-object')
var traverse = require('traverse')
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
    traverse(content).forEach(function (node) {
      if (!isPlainObject(node)) {
        return
      }

      if (!node.id && this.isRoot) {
        node.id = rootPath
      } else if (!node.$id) {
        node.id = rootPath + "#" + toJsonPointer(this.path)
      }

      debug("pushing", node)
      stream.queue(node)
    })
  }
}
