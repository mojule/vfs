'use strict';

var is = require('../is');

var ensureValue = function ensureValue(node, value) {
  var isValue = node.nodeType() === 'file' ? is.fileValue : is.directoryValue;

  if (!isValue(value)) throw new Error('Bad value: ' + value);
};

var value = function value(node) {
  var _setValue = node.setValue;


  return {
    setValue: function setValue(arg, propertyValue) {
      if (is.object(arg)) {
        ensureValue(node, arg);

        return _setValue(arg);
      }

      var existing = node.getValue();
      var newValue = Object.assign({}, existing);

      newValue[arg] = propertyValue;

      ensureValue(node, newValue);

      return node.setValue(newValue);
    }
  };
};

module.exports = value;