'use strict'

const getPath = node => {
  return {
    getPath: () => {
      const slugs = []

      node.walkUp( current => {
        const slug = current.slug()
        slugs.unshift( slug )
      })

      return slugs.join( '/' )
    }
  }
}

module.exports = getPath
