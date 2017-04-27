# vfs

Virtual file system built on mojule tree

v0.0.1 - npm/tests/coverage/docs still to come

## Install

`npm install @mojule/vfs`

## Example

```javascript
const Vfs = require( '@mojule/vfs' )

const tree = Vfs.virtualize( 'some/path' )

const virtualFile = Vfs.createFile( 'hello.txt', 'Hello, World!', 'utf8' )
const virtualDirectory = Vfs.createDirectory( 'temp' )
```