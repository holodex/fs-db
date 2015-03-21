var test = require('tape')
var fs = require('fs')
var Path = require('path')
var extend = require('xtend')
var sortKeys = require('sort-keys')
var sortBy = require('sort-by')
var pull = require('pull-stream')
var pullToArray = require('pull-array-collate')
var streamToArray = require('stream-to-array')

var FsDb = require('../')

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
      var expected = readData('./data.json')
      var actual = sortData(data)
      t.deepEqual(actual, expected)
    }, function (err) {
      t.notOk(err, 'no error')
      t.end()
    })
  )
})

function ctor (options) {
  return FsDb(extend({
    location: __dirname + '/data',
  }, options || {}))
}

function readData (file) {
  return JSON.parse(
    fs.readFileSync(
      Path.join(__dirname, file), 'utf8'
    )
  )
}

function sortData (data) {
  return data.map(function (item) {
    return sortKeys(item)
  }).sort(sortBy('id'))
}
