'use strict'

const fs = require( 'fs' )
const path = require( 'path' )
const pify = require( 'pify' )

const { stat, writeFile, mkdir } = pify( fs )

const actualize = node => {
  const write = ( root, current ) => {
    const filename = path.join( root, current.getPath() )

    if( current.nodeType() === 'directory' )
      return mkdir( filename )

    const value = current.getValue()
    const { data, encoding } = value

    return writeFile( filename, data, encoding )
  }

  const actualize = ( root, callback ) =>
    stat( root )
    .then( stats => {
      if( !stats.isDirectory() )
        throw new Error( 'root must be a path to an existing directory' )
    })
    .then( () => node.findAll( () => true ) )
    .then( nodes => new Promise( ( resolve, reject ) => {
      const next = () => {
        if( nodes.length === 0 )
          return resolve()

        const current = nodes.shift()

        write( root, current ).then( () => next() ).catch( reject )
      }

      next()
    }))
    .then( () => callback( null ) )
    .catch( err => callback( err ) )

  return { actualize }
}

module.exports = actualize