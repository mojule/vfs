'use strict'

const path = require( 'path' )
const is = require( '../is' )
const Mime = require( 'mime' )

const create = node => {
  return {
    $createFile: ( filename, data, encoding ) => {
      if( !is.filename( filename ) )
        throw new Error( 'Expected filename to be a valid file name' )

      if( is.undefined( encoding ) && is.bufferArg( data ) )
        data = Buffer.from( data )

      if( is.undefined( encoding ) && is.string( data ) )
        encoding = 'utf8'

      const nodeType = 'file'
      const parsed = path.parse( filename )
      const { ext } = parsed
      const mime = Mime.lookup( filename )
      const value = { nodeType, filename, data, encoding, ext, mime }

      return node( node.createState( value ) )
    },
    $createDirectory: filename => {
      if( !is.filename( filename ) )
        throw new Error( 'Expected filename to be a valid file name' )

      const nodeType = 'directory'
      const value = { nodeType, filename }

      return node( node.createState( value ) )
    }
  }
}

module.exports = create
