'use strict'

const create = node => {
  return {
    $createFile: ( name, data, encoding ) => {
      const nodeType = 'file'
      const value = { nodeType, name, data, encoding }

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
