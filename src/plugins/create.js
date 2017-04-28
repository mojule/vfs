'use strict'

const path = require( 'path' )
const is = require( '../is' )
const Mime = require( 'mime' )

const create = node => {
  return {
    $createFile: ( name, data, encoding ) => {
      if( !is.filename( name ) )
        throw new Error( 'Expected name to be a valid filename' )

      if( is.undefined( encoding ) && is.bufferArg( data ) )
        data = Buffer.from( data )

      if( is.undefined( encoding ) && is.string( data ) )
        encoding = 'utf8'

      const nodeType = 'file'
      const parsed = path.parse( name )
      const { ext } = parsed
      const mime = Mime.lookup( name )
      const value = { nodeType, name, data, encoding, ext, mime }

      return node( node.createState( value ) )
    },
    $createDirectory: name => {
      if( !is.filename( name ) )
        throw new Error( 'Expected name to be a valid filename' )

      const nodeType = 'directory'
      const value = { nodeType, name }

      return node( node.createState( value ) )
    }
  }
}

module.exports = create
