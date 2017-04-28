'use strict'

const is = require( '../is' )

const isValue = node => {
  const { isValue } = node
  return {
    $isValue: value => is.fileValue( value ) || is.directoryValue( value )
  }
}

module.exports = isValue
