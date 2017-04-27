'use strict'

const TreeFactory = require( '@mojule/tree' ).Factory
const is = require( '@mojule/is' )
const defaultPlugins = require( './plugins' )

const defaultOptions = {}

const Factory = ( ...plugins ) => {
  let options = {}

  if( plugins.length > 0 && is.object( plugins[ plugins.length - 1 ] ) )
    options = plugins.pop()

  options = Object.assign( {}, defaultOptions, options )

  if( plugins.length === 1 && is.array( plugins[ 0 ] ) )
    plugins = plugins[ 0 ]

  plugins = defaultPlugins.concat( plugins )

  return TreeFactory( plugins, options )
}

const Tree = Factory()

Object.assign( Tree, { Factory } )

module.exports = Tree
