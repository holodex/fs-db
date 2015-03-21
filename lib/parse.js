var through = require('through2')
var traverse = require('traverse')
var toJsonPointer = require('json-pointer').compile
var debug = require('debug')('fs-db:parse')

module.exports = function contentParser (options) {
  
  var codec = options.codec

  return through.obj(parseContent)
  
  function parseContent (file, _, next) {
    debug("file", file)

    var stream = this
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
      stream.push(node)
    })
  }
}

