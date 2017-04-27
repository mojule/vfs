'use strict';

var create = function create(node) {
  return {
    $createFile: function $createFile(name, data, encoding) {
      var nodeType = 'file';
      var value = { nodeType: nodeType, name: name, data: data, encoding: encoding };

      return node(node.createState(value));
    },
    $createDirectory: function $createDirectory(name) {
      var nodeType = 'directory';
      var value = { nodeType: nodeType, name: name };

      return node(node.createState(value));
    }
  };
};

module.exports = create;