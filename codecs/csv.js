var csv = require('comma-separated-values')

module.exports = {
  type: 'csv',
  encode: function (obj) {
    return csv.encode(obj, { header: true })
  },
  decode: function (str) {
    return csv.parse(str, { header: true })
  }
}
