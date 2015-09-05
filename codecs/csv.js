module.exports = {
  decode: require('csv-parser'),
  encode: function () {
    throw new Error('FsDown: csv.encode not implemented!')
  }
}
