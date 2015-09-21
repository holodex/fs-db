var test = require('tape')
var fs = require('fs')
var Path = require('path')
var toStream = require('stream-array')
var toArray = require('stream-to-array')
var sortKeys = require('sort-keys')
var sortBy = require('sort-by')

var FsDb = require('../')

test('exports proper api', function (t) {
  t.equal(typeof FsDb, 'function')
  var db = FsDb('data/one.csv')
  t.equal(typeof db, 'object')
  t.equal(typeof db.createReadStream, 'function')
  t.equal(typeof db.createWriteStream, 'function')
  t.end()
})

test('csv .createReadStream()', function (t) {
  var db = ctor('one.csv', 'csv')
  var readStream = db.createReadStream()
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
    .pipe(db.createWriteStream())
    .on('finish', function () {
      t.deepEqual(
        readFile('two.csv'),
        readFile('one.csv')
      )
      t.end()
    })
})

function ctor (location, options, codecOptions) {
  return FsDb(
    Path.join(__dirname, 'data', location),
    options, codecOptions
  )
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
