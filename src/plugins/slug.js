'use strict'

const slug = node => {
  return {
    slug: () => node.getValue( 'name' )
  }
}

module.exports = slug
