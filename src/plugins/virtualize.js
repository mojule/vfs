'use strict'

const fs = require( 'fs' )
const path = require( 'path' )
const Mime = require( 'mime' )
const pify = require( 'pify' )
const is = require( '../is' )

const { stat, readdir, readFile } = pify( fs )

const getChildPaths = current => {
  const ls = stats => stats.isDirectory() ? readdir( current ) : []
  const toPath = filename => path.join( current, filename )
  const toPaths = files => files.map( toPath )

  return stat( current ).then( ls ).then( toPaths )
}

const virtualize = node => {
  const createDirectory = source => {
    const parsed = path.parse( source )
    const { base } = parsed

    const directory = node.createDirectory( base )

    directory.setMeta( 'source', source )

    return directory
  }

  const createNode = source => {
    const mime = Mime.lookup( source )
    const parsed = path.parse( source )
    const { base, ext } = parsed

    let encoding

    if( is.text( mime ) || node.isTextExtension( ext ) )
      encoding = 'utf8'

    const createFile = data => {
      const file = node.createFile( base, data, encoding )

      file.setMeta( 'source', source )

      return file
    }

    return readFile( source, encoding ).then( createFile )
  }

  const pathToNode = source =>
    stat( source )
    .then( stats =>
      stats.isDirectory() ?
        createDirectory( source ) :
        createNode( source )
    )

  const childPathsToNodes = paths => Promise.all( paths.map( pathToNode ) )

  const createRoot = rootPath => new Promise( ( resolve, reject ) => {
    const parsed = path.parse( rootPath )
    const { name } = parsed
    const root = node.createDirectory( name )
    const nodes = [ root ]

    root.setMeta( 'source', rootPath )

    const next = () => {
      if( !nodes.length )
        return resolve( root )

      const current = nodes.pop()
      const source = current.getMeta( 'source' )

      getChildPaths( source )
      .then( childPathsToNodes )
      .then( children => {
        children.forEach( child => {
          current.append( child )
          nodes.push( child )
        })

        next()
      })
      .catch( reject )
    }

    next()
  })

  const $virtualize = ( rootPath, callback ) =>
    stat( rootPath )
    .then( stats =>
      stats.isDirectory() ?
        createRoot( rootPath ) :
        createNode( rootPath )
    )
    .then( rootNode => callback( null, rootNode ) )
    .catch( callback )

  return { $virtualize }
}

module.exports = virtualize