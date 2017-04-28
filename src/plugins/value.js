'use strict'

const is = require( '../is' )

const ensureValue = ( node, value ) => {
  const isValue = node.nodeType() === 'file' ?
    is.fileValue : is.directoryValue

  if( !isValue( value ) )
    throw new Error( `Bad value: ${ value }` )
}

const value = node => {
  const { setValue } = node

  return {
    setValue: ( arg, propertyValue ) => {
      if( is.object( arg ) ){
        ensureValue( node, arg )

        return setValue( arg )
      }

      const existing = node.getValue()
      const newValue = Object.assign( {}, existing )

      newValue[ arg ] = propertyValue

      ensureValue( node, newValue )

      return node.setValue( newValue )
    }
  }
}

module.exports = value
