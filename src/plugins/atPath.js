'use strict'

const is = require( '@mojule/is' )

const atPath = node => {
  return {
    atPath: path => {
      let root = node.getRoot()

      const slugs = path.split( '/' )

      let target = root

      slugs.forEach( ( slug, i ) => {
        if( i === 0 || is.undefined( target ) ) return

        const children = target.getChildren()

        target = children.find( child =>
          child.slug() === slug
        )
      })

      return target
    }
  }
}

module.exports = atPath
