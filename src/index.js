'use strict'

const is = require( '@mojule/is' )
const TreeFactory = require( '@mojule/tree' ).Factory
const FactoryFactory = require( '@mojule/tree' ).FactoryFactory
const defaultPlugins = require( './plugins' )
const defaultOptions = { exposeProperties: [ 'filename', 'data', 'ext', 'mime' ] }
const Factory = FactoryFactory( TreeFactory, defaultPlugins, defaultOptions )
const Tree = Factory()

Object.assign( Tree, { Factory } )

module.exports = Tree
