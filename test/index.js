var test = require('tape')
var fs = require('fs')
var Path = require('path')
var extend = require('xtend')
var sortJson = require('sort-json')
var pull = require('pull-stream')
var pullToArray = require('pull-array-collate')
var streamToArray = require('stream-to-array')

var FsDb = require('../')

function ctor (options) {
  return FsDb(extend({
    location: __dirname + '/data',
  }, options || {}))
}

function readJson (file) {
  return JSON.parse(
    fs.readFileSync(
      Path.join(__dirname, file), 'utf8'
    )
  )
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
      var expected = readJson('./data.json')
      var actual = sortJson(data)
      t.deepEqual(actual, expected)
    }, function (err) {
      t.notOk(err, 'no error')
      t.end()
    })
  )
})
