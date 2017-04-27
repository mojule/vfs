'use strict';

var path = require('path');
var is = require('@mojule/is');
var Mime = require('mime');

var create = function create(node) {
  return {
    $createFile: function $createFile(name, data, encoding) {
      var nodeType = 'file';
      var parsed = path.parse(name);
      var ext = parsed.ext;

      var mime = Mime.lookup(name);
      var value = { nodeType: nodeType, name: name, data: data, encoding: encoding, ext: ext, mime: mime };

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