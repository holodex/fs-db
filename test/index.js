var test = require('tape')
var fs = require('fs')
var Path = require('path')
var toStream = require('stream-array')
var toArray = require('stream-to-array')
var sortKeys = require('sort-keys')
var sortBy = require('sort-by')
var Abstract = require('abstract-leveldown')
var levelup = require('levelup')
var levelws = require('level-ws')

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

test('csv .createReadStream()', function (t) {
  var db = ctor('one.csv', 'csv')
  var readStream = db.createReadStream({ valueEncoding: 'json' })
  toArray(readStream, function (err, data) {
    t.error(err, 'no error')
    var expected = readData('one.json')
    t.deepEqual(data, expected, 'data is correct')
    t.end()
  })
})

test('csv .createWriteStream()', function (t) {
  var db = ctor('two.csv', 'csv')
  toStream(readData('one.json'))
    .pipe(db.createWriteStream({ valueEncoding: 'json' }))
    .on('finish', function () {
      t.deepEqual(
        readFile('two.csv'),
        readFile('one.csv')
      )
      t.end()
    })
})

function ctor (location, codec, options) {
  return levelws(levelup(
    Path.join(__dirname, 'data', location),
    {
      db: FsDown(codec, options)
    }
  ))
}

function readFile (file) {
  return fs.readFileSync(
    Path.join(__dirname, 'data', file), 'utf8'
  )
}

function readData (file) {
  return JSON.parse(readFile(file))
}

function sortData (data) {
  return data.map(function (item) {
    return sortKeys(item)
  }).sort(sortBy('id'))
}
