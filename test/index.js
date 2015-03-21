var test = require('tape')
var extend = require('xtend')
var pull = require('pull-stream')
var pullToArray = require('pull-array-collate')
var streamToArray = require('stream-to-array')

var FsDb = require('../')

function ctor (options) {
  return FsDb(extend({
    location: __dirname + '/data',
  }, options || {}))
}

test('Constructor', function (t) {
  t.equal(typeof FsDb, 'function')
  var fsDb = ctor()
  t.ok(fsDb)
  t.equal(typeof fsDb, 'object')
  t.equal(typeof fsDb.createReadStream, 'function')
  t.end()
})

test('.createReadStream()', function (t) {
  var fsDb = ctor()
  var readStream = fsDb.createReadStream()
  pull(
    readStream,
    pullToArray(),
    pull.drain(function (data) {
      t.deepEqual(data, [
      ], 'data is correct')
      t.end()
    })
  )
})
