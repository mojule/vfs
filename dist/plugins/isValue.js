'use strict';

var is = require('../is');

var isValue = function isValue(node) {
  var isValue = node.isValue;

  return {
    $isValue: function $isValue(value) {
      return is.fileValue(value) || is.directoryValue(value);
    }
  };
};

module.exports = isValue;