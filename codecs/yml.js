var yaml = require('js-yaml')

module.exports = {
  type: 'yml',
  encode: function (obj) {
    return yaml.safeDump(obj)
  },
  decode: function (str) {
    return yaml.safeLoad(str)
  }
}
