'use strict'

const nodeType = node => {
  return {
    nodeType: () => node.getValue( 'nodeType' )
  }
}

module.exports = nodeType
