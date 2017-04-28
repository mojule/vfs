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

vfs has the same API as 