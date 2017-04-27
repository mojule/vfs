'use strict';

var nodeType = function nodeType(node) {
  return {
    nodeType: function nodeType() {
      return node.getValue('nodeType');
    }
  };
};

module.exports = nodeType;