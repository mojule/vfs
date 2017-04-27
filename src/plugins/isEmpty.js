'use strict'

const isEmpty = node => {
  return {
    isEmpty: () => node.nodeType() === 'file'
  }
}

module.exports = isEmpty
