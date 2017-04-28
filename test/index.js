'use strict'

const assert = require( 'assert' )
const path = require( 'path' )
const fs = require( 'fs' )
const pify = require( 'pify' )
const rimraf = require( 'rimraf' )
const Vfs = require( '../src' )
const is = require( '../src/is' )

const sourceDirectory = path.join( process.cwd(), 'test/fixtures/source' )
const sourceHelloFile = path.join( process.cwd(), 'test/fixtures/source/hello.txt' )
const targetDirectory = path.join( process.cwd(), 'test/fixtures/target' )
const targetHelloFile = path.join( process.cwd(), 'test/fixtures/target/hello.txt' )
const actualizedDirectory = path.join( process.cwd(), 'test/fixtures/target/source' )

const mkdir = pify( fs.mkdir )

describe( 'VFS', () => {
  const base64png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAABlBMVEX///8AAABVwtN+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAQAAADiNnVPNjtMwEH4Vy3sBicSJm39tWLXJVuwhsCqVlqsTO1urjR3ZLs321TjwSLwCTmkKQqsKYfkw4/m+mfH83N4NPWm2zICaPXORwx/fvkPAaQ6fwsqr+oJt+IejYp+PH9fNcdukFN69B7dDNnR9xwwBQ7cTOhtySKisWWbl8RlBcIKYbQ7nowF8qR5BIRUDoRs5jT/DIE5dP0xxErwD2PMj5AXITx1/ltkbeOB8oI2maJutyuU5ltVyuDGmzxA6HA7uYeZK9Wy5aYo8jDB2LMLRL8KQwRH6ZvJQMt0o3hsuBRh1Usu9ySGcvtD1VXVxLLR7+pDbyA4NpEe+66GuQxNamxVrr6P1+qVnaMW03KuGWfjNH6GuU0egzSb7pLhtCtmVstl3TJiHMofW4lJOszAI4jCYRQ716tpp06B2kiRiTkviGLchoRh7k5/X+ElZRPEMx3iRLnz/Pk79BZ6HUXS/jHBYJvOJ+yC0IaJhE5f/5kZXuVmhGDFSraXcTVPwuJFG6o3sQVGMXQ/dELx54oLKg347NuqcL1P8K6NLJTtwqnTGX8ni3yrwi0//t4LIJoX+Gp/pyc7kKF6WwSqXdWLC7pCyy/ITNz4Nn6IenJwAAAAKSURBVBhXY2AAAAACAAGj2j2UAAAAAElFTkSuQmCC'

  describe( 'createFile', () => {
    it( 'text', () => {
      const text = Vfs.createFile( 'hello.txt', 'Hello, world!' )

      assert.equal( text.nodeType(), 'file' )
      assert.equal( text.getValue( 'data' ), 'Hello, world!' )
      assert.equal( text.getValue( 'mime' ), 'text/plain' )
      assert.equal( text.getValue( 'name' ), 'hello.txt' )
      assert.equal( text.getValue( 'ext' ), '.txt' )
    })

    it( 'from buffer', () => {
      const buffer = Buffer.from( base64png, 'base64' )
      const png = Vfs.createFile( 'bin.png', buffer )
      const data = png.getValue( 'data' )

      assert( data instanceof Buffer )
    })

    it( 'from JSON buffer', () => {
      const buffer = Buffer.from( base64png, 'base64' )
      const json = JSON.stringify( buffer )
      const obj = JSON.parse( json )
      const png = Vfs.createFile( 'bin.png', obj )
      const data = png.getValue( 'data' )

      assert( data instanceof Buffer )
      assert.equal( data.toString( 'base64' ), base64png )
    })

    it( 'from byte array', () => {
      const buffer = Buffer.from( base64png, 'base64' )
      const json = JSON.stringify( buffer )
      const obj = JSON.parse( json )
      const png = Vfs.createFile( 'bin.png', obj.data )
      const data = png.getValue( 'data' )

      assert( data instanceof Buffer )
      assert.equal( data.toString( 'base64' ), base64png )
    })

    it( 'from buffer with encoding', () => {
      const buffer = Buffer.from( base64png, 'base64' )
      const png = Vfs.createFile( 'bin.png', buffer, 'buffer' )
      const data = png.getValue( 'data' )

      assert( data instanceof Buffer )
      assert.equal( data.toString( 'base64' ), base64png )
    })

    it( 'from hex data', () => {
      const buffer = Buffer.from( base64png, 'base64' )
      const hex = buffer.toString( 'hex' )

      const png = Vfs.createFile( 'bin.png', hex, 'hex' )
      const data = png.getValue( 'data' )

      assert( is.string( data ) )
      assert.equal( data, hex )
    })

    it( 'bad filename', () => {
      assert.throws( () => Vfs.createFile( 'root/hello.txt', 'hello' ) )
      assert.throws( () => Vfs.createFile( '', 'hello' ) )
      assert.throws( () => Vfs.createDirectory( 'root/hello' ) )
      assert.throws( () => Vfs.createDirectory( '' ) )
    })
  })

  describe( 'serializes', () => {
    it( 'single directory', () => {
      const root = Vfs.createDirectory( 'root' )
      const serRoot = root.serialize()

      assert.deepEqual( serRoot, { 'root': true } )
    })

    it( 'single file', () => {
      const file = Vfs.createFile( 'hello.txt', 'Hello, World!', 'utf8' )
      const serFile = file.serialize()

      assert.deepEqual( serFile, { 'hello.txt': 'Hello, World!' } )
    })

    it( 'nested', () => {
      const root = Vfs.createDirectory( 'root' )
      const file = Vfs.createFile( 'hello.txt', 'Hello, World!', 'utf8' )

      root.add( file )

      const serTree = root.serialize()

      assert.deepEqual( serTree, { 'root/hello.txt': 'Hello, World!' } )
    })

    it( 'binary', () => {
      const expect = { 'bin.png': base64png }
      const buffer = Buffer.from( base64png, 'base64' )
      const file = Vfs.createFile( 'bin.png', buffer )
      const serFile = file.serialize()

      assert.deepEqual( serFile, expect )
    })

    it( 'hex', () => {
      const expect = { 'bin.png': base64png }
      const buffer = Buffer.from( base64png, 'base64' )
      const hex = buffer.toString( 'hex' )
      const file = Vfs.createFile( 'bin.png', hex, 'hex' )
      const serFile = file.serialize()

      assert.deepEqual( serFile, expect )
    })
  })

  describe( 'deserializes', () => {
    it( 'single directory', () => {
      const root = Vfs.createDirectory( 'root' )
      const serRoot = root.serialize()
      const rootTree = Vfs.deserialize( serRoot )

      const expect = [{ nodeType: 'directory', name: 'root' }]

      assert.deepEqual( rootTree.get(), expect )
    })

    it( 'single file', () => {
      const file = Vfs.createFile( 'hello.txt', 'Hello, World!', 'utf8' )
      const serFile = file.serialize()
      const fileTree = Vfs.deserialize( serFile )

      const expect = [
        {
          nodeType: 'file',
          name: 'hello.txt',
          data: 'Hello, World!',
          encoding: 'utf8',
          ext: '.txt',
          mime: 'text/plain'
        }
      ]

      assert.deepEqual( fileTree.get(), expect )
    })

    it( 'nested', () => {
      const root = Vfs.createDirectory( 'root' )
      const sub = Vfs.createDirectory( 'sub' )
      const sub2 = Vfs.createDirectory( 'sub2' )
      const text = Vfs.createFile( 'hello.txt', 'Hello, World!', 'utf8' )
      const js = Vfs.createFile( 'hello.js', '\'use strict\'\n', 'utf8' )

      root.add( text )
      root.add( sub )
      root.add( sub2 )
      sub.add( js )

      const serTree = root.serialize()
      const tree = Vfs.deserialize( serTree )

      const expect = [
        { nodeType: 'directory', name: 'root' },
        [
          {
            nodeType: 'file',
            name: 'hello.txt',
            data: 'Hello, World!',
            encoding: 'utf8',
            ext: '.txt',
            mime: 'text/plain'
          }
        ],
        [
          { nodeType: 'directory', name: 'sub' },
          [
            {
              nodeType: 'file',
              name: 'hello.js',
              data: '\'use strict\'\n',
              encoding: 'utf8',
              ext: '.js',
              mime: 'application/javascript'
            }
          ]
        ],
        [
          { nodeType: 'directory', name: 'sub2' }
        ]
      ]

      assert.deepEqual( tree.get(), expect )
    })

    it( 'binary', () => {
      const serFile = { 'bin.png': base64png }

      const file = Vfs.deserialize( serFile )
      const data = file.getValue( 'data' )

      assert( data instanceof Buffer )
    })
  })

  describe( 'virtualize', () => {
    it( 'virtualizes directory', done => {
      // git doesn't check in empty folders, we might need to make it
      const empty = path.join( sourceDirectory, 'depth-0/depth-1/depth-2' )

      try {
        const stats = fs.statSync( empty )
      } catch( e ){
        if( e.code === 'ENOENT' )
          fs.mkdirSync( empty )
        else
          throw e
      }

      Vfs.virtualize( sourceDirectory, ( err, tree ) => {
        assert( !err )

        const ser = tree.serialize()

        assert.deepEqual( ser, {
          'source/depth-0/depth-1/depth-2': true,
          'source/depth-0/depth-1/bin.png': base64png,
          'source/depth-0/hello.js': '\'use strict\'\n',
          'source/hello.txt': 'Hello, World!'
        })

        done()
      })
    })

    it( 'virtualizes file', done => {
      Vfs.virtualize( sourceHelloFile, ( err, tree ) => {
        assert( !err )

        const ser = tree.serialize()

        assert.deepEqual( ser, {
          'hello.txt': 'Hello, World!'
        })

        done()
      })
    })
  })

  describe( 'actualize', () => {
    it( 'actualizes directory', done => {
      Vfs.virtualize( sourceDirectory, ( err, tree ) => {
        mkdir( targetDirectory )
        .then( () => {
          tree.actualize( targetDirectory, err => {
            assert( !err )

            Vfs.virtualize( actualizedDirectory, ( err, actTree ) => {
              assert.deepEqual( tree.get(), actTree.get() )

              rimraf( targetDirectory, () => done() )
            })
          })
        })
      })
    })

    it( 'actualizes file', done => {
      Vfs.virtualize( sourceHelloFile, ( err, tree ) => {
        mkdir( targetDirectory )
        .then( () => {
          tree.actualize( targetDirectory, err => {
            assert( !err )

            Vfs.virtualize( targetHelloFile, ( err, actTree ) => {
              assert.deepEqual( tree.get(), actTree.get() )

              rimraf( targetDirectory, () => done() )
            })
          })
        })
      })
    })

    it( 'bad root path', done => {
      Vfs.virtualize( sourceDirectory, ( err, tree ) => {
        tree.actualize( '', err => {
          assert( err )
          tree.actualize( sourceHelloFile, err => {
            assert( err )
            done()
          })
        })
      })
    })
  })

  describe( 'value', () => {
    it( 'sets new file name value', () => {
      const text = Vfs.createFile( 'hello.txt', 'hello' )

      text.setValue( 'name', 'goodbye.txt' )

      assert.equal( text.getValue( 'name' ), 'goodbye.txt' )
    })

    it( 'sets new directory name value', () => {
      const directory = Vfs.createDirectory( 'hello' )

      directory.setValue( 'name', 'goodbye' )

      assert.equal( directory.getValue( 'name' ), 'goodbye' )
    })

    it( 'throws on bad value', () => {
      const text = Vfs.createFile( 'hello.txt', 'hello' )

      assert.throws( () => text.setValue( 'nodeType', 'directory' ) )
    })
  })

  describe( 'Factory', () => {
    const { Factory } = Vfs

    it( 'options', () => {
      const Tree = Factory( { exposeState: true } )

      const tree = Tree.createFile( 'hello.txt', 'hello' )

      assert( is.object( tree.state ) )
    })

    it( 'plugins', () => {
      const nameWithoutExt = node => {
        return {
          nameWithoutExt: () => {
            const name = node.getValue( 'name' )
            const parsed = path.parse( name )

            return parsed.name
          }
        }
      }

      const Tree = Factory( [ nameWithoutExt ] )

      const tree = Tree.createFile( 'hello.txt', 'hello' )

      assert.equal( tree.nameWithoutExt(), 'hello' )
    })
  })
})
