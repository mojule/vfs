'use strict'

const is = require( '../is' )
const Mime = require( 'mime' )

const serializer = node => {
  return {
    serialize: () => {
      const serialized = {}

      node.walk( current => {
        if( current.hasChildren() ) return

        const key = current.getPath()

        let value = true

        if( current.nodeType() === 'file' ){
          const nodeValue = current.getValue()
          const { encoding } = nodeValue
          let { data } = nodeValue
          const mime = Mime.lookup( key )

          if( encoding === 'hex' )
            data = Buffer.from( data, 'hex' )

          value = is.text( mime ) || is.text( encoding ) ? data : data.toString( 'base64' )
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
          const isText = is.text( mime )
          const data = isText ? value : Buffer.from( value, 'base64' )
          let encoding

          if( isText )
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

        if( is.undefined( parent ) ){
          root = parent = file
        } else {
          parent.append( file )
        }

      })

      return root
    }
  }
}

module.exports = serializer
