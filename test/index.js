var test = require('tape')
var fs = require('fs')
var Path = require('path')
var Abstract = require('abstract-leveldown')

var FsDown = require('../')

test('exports proper api', function (t) {
  t.equal(typeof FsDown, 'function')
  var Db = FsDown()
  t.equal(typeof Db, 'function')
  var db = Db('data/one.csv')
  t.ok(Abstract.isLevelDOWN(db))
  t.end()
})

// TODO use abstract-leveldown tests
// https://github.com/Level/abstract-leveldown/blob/master/test.js
// https://github.com/calvinmetcalf/SQLdown/blob/master/test/test.js

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
