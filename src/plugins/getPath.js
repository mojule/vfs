'use strict'

const getPath = node => {
  return {
    getPath: () => {
      const slugs = []

      node.walkUp( current => {
        const slug = current.slug()

        if( slug.includes( '/' ) )
          throw new Error(
            `Node slugs should not contain the separator string "/"`
          )

        slugs.unshift( slug )
      })

      return slugs.join( '/' )
    }
  }
}

module.exports = getPath
