# fsdown

a silly **work in progress** to use the filesystem (e.g. `.csv`, `.ldjson` files) as a database.

the purpose is for apps to have human editable and readable data that can be iterated on easily (vim macros over sql migrations) and shared more openly (GitHub repos over JSON APIs).

## how to

### install

```
npm install --save fsdown
```

### use

```
var levelup = require('levelup')

var db = levelup(
  __dirname + '/things.csv',
  {
    db: require('fsdown')()
  }
)

db.readStream()
  .on('data', console.log)
```

#### fsdown(codec, options)

`codec` is which codec to use (defaults to 'csv'). can be a name of an existing codec or a custom codec object, see [codecs](./codecs) for what is expected of a codec.

`options` are passed to the codec.
