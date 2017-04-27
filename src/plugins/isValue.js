'use strict'

const is = require( '@mojule/is' )

const nodeTypes = [ 'file', 'directory' ]

const isValue = node => {
  const { isValue } = node
  return {
    $isValue: value =>
      isValue( value ) && is.string( value.name ) && value.name.trim() !== '' &&
      is.string( value.nodeType ) && nodeTypes.includes( value.nodeType )
  }
}

module.exports = isValue
