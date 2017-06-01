'use strict'

const actualize = require( './actualize' )
const atPath = require( './atPath' )
const create = require( './create' )
const getPath = require( './getPath' )
const isEmpty = require( './isEmpty' )
const isValue = require( './isValue' )
const registerText = require( './registerText' )
const serializer = require( './serializer' )
const slug = require( './slug' )
const value = require( './value' )
const virtualize = require( './virtualize' )

module.exports = [
  actualize, atPath, create, getPath, isEmpty, isValue, registerText,
  serializer, slug, value, virtualize
]
