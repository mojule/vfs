'use strict'

const is = require( '@mojule/is' )

const registerText = node => {
  const extensions = new Set()

  const normalizeExt = ext => {
    if( !is.string( ext ) || ext.length === 0 )
      throw new Error( 'Expected a non empty string' )

    if( !ext.startsWith( '.' ) )
      ext = '.' + ext

    ext = ext.toLowerCase()

    return ext
  }

  const $registerText = ext => extensions.add( normalizeExt( ext ) )
  const $isTextExtension = ext => extensions.has( normalizeExt( ext ) )

  return {
    $registerText, $isTextExtension
  }
}

module.exports = registerText
