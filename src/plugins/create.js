'use strict'

const path = require( 'path' )
const is = require( '@mojule/is' )
const Mime = require( 'mime' )

const create = node => {
  return {
    $createFile: ( name, data, encoding ) => {
      const nodeType = 'file'
      const parsed = path.parse( name )
      const { ext } = parsed
      const mime = Mime.lookup( name )
      const value = { nodeType, name, data, encoding, ext, mime }

      return node( node.createState( value ) )
    },
    $createDirectory: name => {
      const nodeType = 'directory'
      const value = { nodeType, name }

      return node( node.createState( value ) )
    }
  }
}

module.exports = create
