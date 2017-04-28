'use strict';

var path = require('path');
var is = require('../is');
var Mime = require('mime');

var create = function create(node) {
  return {
    $createFile: function $createFile(name, data, encoding) {
      if (!is.filename(name)) throw new Error('Expected name to be a valid filename');

      if (is.undefined(encoding) && is.bufferArg(data)) data = Buffer.from(data);

      if (is.undefined(encoding) && is.string(data)) encoding = 'utf8';

      var nodeType = 'file';
      var parsed = path.parse(name);
      var ext = parsed.ext;

      var mime = Mime.lookup(name);
      var value = { nodeType: nodeType, name: name, data: data, encoding: encoding, ext: ext, mime: mime };

      return node(node.createState(value));
    },
    $createDirectory: function $createDirectory(name) {
      if (!is.filename(name)) throw new Error('Expected name to be a valid filename');

      var nodeType = 'directory';
      var value = { nodeType: nodeType, name: name };

      return node(node.createState(value));
    }
  };
};

module.exports = create;