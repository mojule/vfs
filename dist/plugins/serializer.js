'use strict';

var is = require('@mojule/is');
var Mime = require('mime');
var isText = require('../is-text');

var serializer = function serializer(node) {
  return {
    serialize: function serialize() {
      var serialized = {};

      node.walk(function (current) {
        if (current.hasChildren()) return;

        var key = current.getPath();

        var value = true;

        if (current.nodeType() === 'file') {
          var mime = Mime.lookup(key);
          var data = current.getValue('data');
          value = isText(mime) ? data : data.toString('base64');
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
          var data = isText(mime) ? value : Buffer.from(value, 'base64');
          var encoding = void 0;

          if (isText(mime)) encoding = 'utf8';

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

        parent.append(file);
      });

      return root;
    }
  };
};

module.exports = serializer;