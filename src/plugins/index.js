'use strict'

const actualize = require( './actualize' )
const create = require( './create' )
const getPath = require( './getPath' )
const isEmpty = require( './isEmpty' )
const isValue = require( './isValue' )
const nodeType = require( './nodeType' )
const serializer = require( './serializer' )
const slug = require( './slug' )
const virtualize = require( './virtualize' )

module.exports = [
  actualize, create, getPath, isEmpty, isValue, nodeType, serializer, slug,
  virtualize
]
