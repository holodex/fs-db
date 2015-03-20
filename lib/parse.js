var through = require('through2')
var traverse = require('traverse')
var toJsonPointer = require('json-pointer').compile
var debug = require('debug')('fs-db:parse')

module.exports = function contentParser () {
  
  var codec = this.codec

  return through.obj(parseContent)
  
  function parseContent (item, _, next) {
    debug("item", item)

    var stream = this

    var path = item.path
    var content = item.content

    // TODO try catch
    var contentObj = codec.decode(content)

    debug("content object", contentObj)

    // identify nodes in contentObj
    traverse(contentObj).forEach(function (node) {
      if (!typeof node === 'object') {
        return
      }

      if (!node.id && this.isRoot) {
        node.id = path
      } else if (!node.$id) {
        node.id = path + "#" + toJsonPointer(this.path)
      }

      debug("pushing", node)
      stream.push(node)
    })
  }
}

