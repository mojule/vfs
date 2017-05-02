'use strict'

const slug = node => {
  return {
    slug: () => node.filename()
  }
}

module.exports = slug
