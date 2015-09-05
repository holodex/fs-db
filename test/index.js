var test = require('tape')
var fs = require('fs')
var Path = require('path')
var Abstract = require('abstract-leveldown')

var FsDown = require('../')

test('exports', function (t) {
  t.equal(typeof FsDown, 'function')
  var Ctor = FsDown()
  t.equal(typeof Ctor, 'function')
  var db = Ctor()
  t.ok(Abstract.isLevelDown(db))
  t.end()
})

/*
test('.createReadStream()', function (t) {
  var fsDb = ctor()
  var readStream = fsDb.createReadStream()
  pull(
    readStream,
    pullToArray(),
    pull.drain(function (data) {
      var expected = readData('./data/.json')
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
*/
