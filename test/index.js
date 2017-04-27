'use strict'

const assert = require( 'assert' )
const path = require( 'path' )
const Vfs = require( '../src' )

const pluginsFolder = path.join( process.cwd(), 'src/plugins' )

describe( 'VFS', () => {
  it( 'virtualizes', done => {
    Vfs.virtualize( pluginsFolder, ( err, tree ) => {
      assert( !err )

      done()
    })
  })
})
