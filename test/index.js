'use strict'

const assert = require( 'assert' )
const path = require( 'path' )
const Vfs = require( '../src' )

const pluginsFolder = path.join( process.cwd(), 'test/fixtures/source' )

describe( 'VFS', () => {
  it( 'serializes', () => {
    const root = Vfs.createDirectory( 'root' )
    const file = Vfs.createFile( 'hello.txt', 'Hello, World!', 'utf8' )

    const serFile = file.serialize()

    root.add( file )

    const serRoot = root.serialize()

    assert.deepEqual( serRoot, { 'root/hello.txt': 'Hello, World!' } )
    assert.deepEqual( serFile, { 'hello.txt': 'Hello, World!' } )
  })

  it( 'virtualizes', done => {
    Vfs.virtualize( pluginsFolder, ( err, tree ) => {
      assert( !err )

      const ser = tree.serialize()

      assert.deepEqual( ser, {
        'source/depth-0/depth-1/depth-2': true,
        'source/depth-0/depth-1/bin.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAABlBMVEX///8AAABVwtN+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAQAAADiNnVPNjtMwEH4Vy3sBicSJm39tWLXJVuwhsCqVlqsTO1urjR3ZLs321TjwSLwCTmkKQqsKYfkw4/m+mfH83N4NPWm2zICaPXORwx/fvkPAaQ6fwsqr+oJt+IejYp+PH9fNcdukFN69B7dDNnR9xwwBQ7cTOhtySKisWWbl8RlBcIKYbQ7nowF8qR5BIRUDoRs5jT/DIE5dP0xxErwD2PMj5AXITx1/ltkbeOB8oI2maJutyuU5ltVyuDGmzxA6HA7uYeZK9Wy5aYo8jDB2LMLRL8KQwRH6ZvJQMt0o3hsuBRh1Usu9ySGcvtD1VXVxLLR7+pDbyA4NpEe+66GuQxNamxVrr6P1+qVnaMW03KuGWfjNH6GuU0egzSb7pLhtCtmVstl3TJiHMofW4lJOszAI4jCYRQ716tpp06B2kiRiTkviGLchoRh7k5/X+ElZRPEMx3iRLnz/Pk79BZ6HUXS/jHBYJvOJ+yC0IaJhE5f/5kZXuVmhGDFSraXcTVPwuJFG6o3sQVGMXQ/dELx54oLKg347NuqcL1P8K6NLJTtwqnTGX8ni3yrwi0//t4LIJoX+Gp/pyc7kKF6WwSqXdWLC7pCyy/ITNz4Nn6IenJwAAAAKSURBVBhXY2AAAAACAAGj2j2UAAAAAElFTkSuQmCC',
        'source/depth-0/hello.js': '\'use strict\'\n',
        'source/hello.txt': 'Hello, World!'
      })

      done()
    })
  })
})
