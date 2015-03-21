# fs-db

a silly **work in progress** to use the filesystem as a database.

the purpose is for apps to have human editable and readable data that can be iterated on easily (vim macros over sql migrations) and shared more openly (GitHub repos over JSON APIs).

## how to

### install

```
npm install --save fs-db
```

### use

```
var FsDb = require('fs-db')

var fsDb = FsDb({
  location: __dirname + '/data',
})

fsDb.createReadStream()
  .pipe(process.stdout)
```

#### FsDb(options)

possible `options` are:

- `location`: root filesystem directory of the database
- `codec`: codec to use (defaults to 'json'), see [codecs](./codecs)

#### fsDb.createReadStream()

returns a readable [pull stream](https://npmjs.org/package/pull-stream) of objects with [JSON Pointer](https://npmjs.org/package/json-pointer) `id`s based on the path.
