'use strict'

const textTypes = [
  'application/javascript', 'application/json'
]

module.exports = mime =>
  ( /^text\// ).test( mime ) || ( /xml$/ ).test( mime ) ||
  textTypes.includes( mime )
