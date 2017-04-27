'use strict';

var is = require('@mojule/is');

var nodeTypes = ['file', 'directory'];

var isValue = function isValue(node) {
  var isValue = node.isValue;

  return {
    $isValue: function $isValue(value) {
      return isValue(value) && is.string(value.name) && value.name.trim() !== '' && is.string(value.nodeType) && nodeTypes.includes(value.nodeType);
    }
  };
};

module.exports = isValue;