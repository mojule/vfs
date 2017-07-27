'use strict'

const deserialize = require( './deserialize' )
const registerText = require( './registerText' )
const virtualize = require( './virtualize' )

module.exports = [ deserialize, registerText, virtualize ]
