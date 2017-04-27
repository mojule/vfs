'use strict';

var isEmpty = function isEmpty(node) {
  return {
    isEmpty: function isEmpty() {
      return node.nodeType() === 'file';
    }
  };
};

module.exports = isEmpty;