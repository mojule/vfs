'use strict';

var is = require('../is');
var path = require('path');
var Mime = require('mime');

var serializer = function serializer(node) {
  return {
    serialize: function serialize() {
      var serialized = {};

      node.walk(function (current) {
        if (current.hasChildren()) return;

        var key = current.getPath();

        var value = true;

        if (current.nodeType() === 'file') {
          var nodeValue = current.getValue();
          var encoding = nodeValue.encoding,
              filename = nodeValue.filename;
          var data = nodeValue.data;

          var mime = Mime.lookup(key);

          var _path$parse = path.parse(filename),
              ext = _path$parse.ext;

          if (encoding === 'hex') data = Buffer.from(data, 'hex');

          value = is.text(mime) || is.text(encoding) || node.isTextExtension(ext) ? data : data.toString('base64');
        }

        serialized[key] = value;
      });

      return serialized;
    },
    $deserialize: function $deserialize(obj) {
      var paths = Object.keys(obj);

      var root = void 0;

      var map = {};

      paths.forEach(function (filename) {
        var segs = filename.split('/');
        var name = segs.pop();
        var value = obj[filename];

        var file = void 0;

        if (value === true) {
          file = node.createDirectory(name);
        } else {
          var mime = Mime.lookup(filename);
          var isText = is.text(mime);
          var data = isText ? value : Buffer.from(value, 'base64');
          var encoding = void 0;

          if (isText) encoding = 'utf8';

          file = node.createFile(name, data, encoding);
        }

        var parent = void 0;
        var path = '';

        segs.forEach(function (name, i) {
          path += name;

          var directory = void 0;

          if (is.undefined(map[path])) {
            directory = node.createDirectory(name);
            map[path] = directory;

            if (i === 0) root = directory;else parent.append(directory);
          } else {
            directory = map[path];
          }

          parent = directory;

          path += '/';
        });

        if (is.undefined(parent)) {
          root = parent = file;
        } else {
          parent.append(file);
        }
      });

      return root;
    }
  };
};

module.exports = serializer;