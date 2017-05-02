'use strict';

var path = require('path');
var is = require('../is');
var Mime = require('mime');

var create = function create(node) {
  return {
    $createFile: function $createFile(filename, data, encoding) {
      if (!is.filename(filename)) throw new Error('Expected filename to be a valid file name');

      if (is.undefined(encoding) && is.bufferArg(data)) data = Buffer.from(data);

      if (is.undefined(encoding) && is.string(data)) encoding = 'utf8';

      var nodeType = 'file';
      var parsed = path.parse(filename);
      var ext = parsed.ext;

      var mime = Mime.lookup(filename);
      var value = { nodeType: nodeType, filename: filename, data: data, encoding: encoding, ext: ext, mime: mime };

      return node(node.createState(value));
    },
    $createDirectory: function $createDirectory(filename) {
      if (!is.filename(filename)) throw new Error('Expected filename to be a valid file name');

      var nodeType = 'directory';
      var value = { nodeType: nodeType, filename: filename };

      return node(node.createState(value));
    }
  };
};

module.exports = create;