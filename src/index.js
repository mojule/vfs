'use strict'

const { Factory } = require( '@mojule/vfs-core' )
const plugins = require( './plugins' )

const VFS = Factory( plugins )

module.exports = VFS
