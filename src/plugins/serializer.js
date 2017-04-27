'use strict'

const is = require( '@mojule/is' )

const serializer = node => {
  return {
    serialize: () => {
      const serialized = {}

      node.walk( current => {
        if( current.nodeType() !== 'file' ) return

        const key = current.getPath()
        const data = current.getValue( 'data' )

        serialized[ key ] = data.toString( 'base64' )
      })

      return serialized
    },
    $deserialize: obj => {
      const paths = Object.keys( obj )

      let root

      const map = {}

      paths.forEach( filename => {
        const segs = filename.split( '/' )
        const name = segs.pop()
        const buffer = obj[ filename ]
        const data = Buffer.from( buffer, 'base64' )
        const file = node.createFile( name, data )

        let parent
        let path = ''

        segs.forEach( ( name, i ) => {
          path += name

          let directory

          if( is.undefined( map[ path ] ) ){
            directory = node.createDirectory( name )
            map[ path ] = directory

            if( i === 0 )
              root = directory
            else
              parent.append( directory )
          } else {
            directory = map[ path ]
          }

          parent = directory

          path += '/'
        })

        parent.append( file )
      })

      return root
    }
  }
}

module.exports = serializer
