'use strict'

const is = require( '@mojule/is' )
const Mime = require( 'mime' )
const isText = require( '../is-text' )

const serializer = node => {
  return {
    serialize: () => {
      const serialized = {}

      node.walk( current => {
        if( current.hasChildren() ) return

        const key = current.getPath()

        let value = true

        if( current.nodeType() === 'file' ){
          const mime = Mime.lookup( key )
          const data = current.getValue( 'data' )
          value = isText( mime ) ? data : data.toString( 'base64' )
        }

        serialized[ key ] = value
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
        const value = obj[ filename ]

        let file

        if( value === true ){
          file = node.createDirectory( name )
        } else {
          const mime = Mime.lookup( filename )
          const data = isText( mime ) ? value : Buffer.from( value, 'base64' )
          let encoding

          if( isText( mime ) )
            encoding = 'utf8'

          file = node.createFile( name, data, encoding )
        }

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
