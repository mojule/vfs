# vfs

Virtual file system built on mojule tree

## Install

`npm install @mojule/vfs`

## Example

```javascript
const Vfs = require( '@mojule/vfs' )

const tree = Vfs.virtualize( 'some/path' )

console.log( tree.serialize() )

const virtualFile = Vfs.createFile( 'hello.txt', 'Hello, World!', 'utf8' )
const virtualDirectory = Vfs.createDirectory( 'text' )

virtualDirectory.append( virtualFile )
virtualDirectory.actualize( 'some/path' )
```

## Plugins

vfs has the same API as [mojule tree](https://github.com/mojule/tree) but with
the following plugins:

### createFile

Creates a file node. The arguments are the same as
[fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback):

`Vfs.createFile( name, data, encoding )`

`encoding` is optional, but if included should be a
[valid node.js encoding type](http://stackoverflow.com/questions/14551608/list-of-encodings-that-node-js-supports)

If `encoding` is omitted, it will assume `'utf8'` if `data` is a string, or if
`data` is a Buffer, a JSON buffer representation or an array of
bytes it will assume convert `data` to a buffer.

```javascript
// { type: 'Buffer', data: [ 1, 2, 3 ] }
const jsonObj = JSON.parse( JSON.stringify( Buffer.from( [ 1, 2, 3 ] ) ) )

const text1 = Vfs.createFile( 'hello.txt', 'hello' )
const text2 = Vfs.createFile( 'hello.txt', 'hello', 'utf8' )
const data1 = Vfs.createFile( 'hello.bin', [ 1, 2, 3 ] )
const data2 = Vfs.createFile( 'hello.bin', Buffer.from( [ 1, 2, 3 ] ) )
const data3 = Vfs.createFile( 'hello.bin', jsonObj )
```

### createDirectory

Creates a directory node

`Vfs.createDirectory( name )`

```javascript
const hello = Vds.createDirectory( 'hello' )
const world = Vfs.createFile( 'world.txt', 'world' )

hello.append( world )
```

### actualize

Writes a vfs tree to disk, then calls callback with the error if one occured

`node.actualize( targetPath, callback )`

The directories and files in your virtual file system will be written under
`targetPath` - node.js will throw an error if any of the files or directories
already exist, so you may want to clear it out first if this may be the case.

```javascript
const hello = Vds.createDirectory( 'hello' )
const world = Vfs.createFile( 'world.txt', 'world' )

hello.append( world )

hello.actualize( './temp', err => {
  if( err ) return console.error( err )

  console.log( 'wrote vfs to ./temp' )
})
```

### getPath

Overrides the base getPath to return paths that map 1:1 to a file system - eg
the slug for the root node will be included in the path, unlike the default
implementation in which it is instead implied

```javascript
const hello = Vds.createDirectory( 'hello' )
const world = Vfs.createFile( 'world.txt', 'world' )

hello.append( world )

// 'hello/world.txt'
console.log( world.getPath() )
```

### isEmpty

Overrides the default implementation, and returns `true` for nodes with
`nodeType` of `file`, `false` for nodes with `nodeType` of `directory`

If you try to add a child node to a `file` it will throw

```javascript
const hello = Vds.createDirectory( 'hello' )
const world = Vfs.createFile( 'world.txt', 'world' )

// false
console.log( hello.isEmpty() )

// true
console.log( world.isEmpty() )
```

### isValue

Overrides the default implementation, which simply returns `true` if the node's
`value` is an object, and only returns true if the combination of `nodeType`,
`name`, `data`, `encoding` etc. are all correct. Constructing nodes with
`Vfs.createFile` and `Vfs.createDirectory` is suggested to help ensure that this
is the case. Used internally to throw whenever you attempt to set the value or
any of its properties to something invalid.

```javascript
const nodeValue1 = {
  nodeType: 'file',
  name: 'hello.txt',
  data: 'hello'
}

// true
console.log( Vfs.isValue( nodeValue1 ) )

const nodeValue2 = {
  nodeType: 'file',
  name: 'temp/hello.txt',
  data: 'hello'
}

// false - file name contains a reserved character, /
console.log( Vfs.isValue( nodeValue2 ) )
```

### nodeType

Overridden from the default (always returns the string `'node'`) to return
the `nodeType` property of the node's `value` object - will always be either
`file` or `directory`

```javascript
const hello = Vds.createDirectory( 'hello' )
const world = Vfs.createFile( 'world.txt', 'world' )

// 'directory'
console.log( hello.nodeType() )

// 'file'
console.log( world.nodeType() )
```

### serializer

Serializes to and from a compact representation suitable for storing as JSON etc

#### serialize

Serialize the current node

```javascript
const hello = Vds.createDirectory( 'hello' )
const world = Vfs.createFile( 'world.txt', 'world' )

const serialized = hello.serialize()
```

```json
{
  "hello/world.txt": "world"
}
```

#### deserialize

Deserializes the object to a vfs tree

```javascript
const data = {
  "hello/world.txt": "world"
}

const hello = Vfs.deserialize( data )
const world = hello.firstChild()

// 'directory'
console.log( hello.nodeType() )

// 'file'
console.log( world.nodeType() )
```

### slug

Overridden from the default to always returns the file or directory's name.
Used by getPath.

```javascript
const hello = Vds.createDirectory( 'hello' )
const world = Vfs.createFile( 'world.txt', 'world' )

// 'hello'
console.log( hello.slug() )

// 'world.txt'
console.log( world.slug() )
```

### virtualize

Reads a file or directory from disk and creates a vfs tree. The callback takes
an error if one occurred and the tree if successful.

`Vfs.virtualize( sourcePath, callback )`

```javascript
Vfs.virtualize( 'some/path', ( err, tree ) => {
  if( err ) return console.error( err )

  console.log( tree.serialize() )
})
```