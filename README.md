# fsdown

a silly **work in progress** to use the filesystem (e.g. `.csv`, `.ldjson` files) as a database.

the purpose is for apps to have human editable and readable data that can be iterated on easily (vim macros over sql migrations) and shared more openly (GitHub repos over JSON APIs).

## how to

### install

```
npm install --save fs-db
```

### use

```
var FsDb = require('fs-db')

var db = FsDb({
  location: __dirname + '/things.csv',
  codec: 'csv'
})

db.readStream()
  .on('data', console.log)
```

#### fsdown(options)

`options`:

- `location` is the path to the database file.
- `codec` is which codec to use (defaults to 'csv'). can be a name of an existing codec, a custom codec object (see [codecs](./codecs) for what is expected of a codec), or an array where the first item is one of the previous values and the second item is options to pass to the codec.
- `keyAttribute` is a string identifier of the attribute used as keys (e.g. 'id').
