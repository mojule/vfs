'use strict';

var is = require('@mojule/is');

var serializer = function serializer(node) {
  return {
    serialize: function serialize() {
      var serialized = {};

      node.walk(function (current) {
        if (current.nodeType() !== 'file') return;

        var key = current.getPath();
        var data = current.getValue('data');

        serialized[key] = data.toString('base64');
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
        var buffer = obj[filename];
        var data = Buffer.from(buffer, 'base64');
        var file = node.createFile(name, data);

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