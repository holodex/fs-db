var test = require('tape')

var dirToObj = require('../')

test('correctly represents test data directory', function (t) {
  dirToObj({
    root: __dirname + '/data',
  }, function (err, obj) {
    t.notOk(err, 'no error')
    t.deepEqual(obj, {
      1: {
        2: {
        '13.txt': '12\n',
          3: {
            '10.txt': '11\n'
          },
          '9.txt': '8\n',
        },
      },
      '14.txt': '15\n',
      5: {
        '6.txt': '7\n',
      },
    }, 'object is correct')
    t.end()
  })
})
