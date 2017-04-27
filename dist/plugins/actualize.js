'use strict';

var fs = require('fs');
var path = require('path');
var pify = require('pify');

var _pify = pify(fs),
    stat = _pify.stat,
    writeFile = _pify.writeFile,
    mkdir = _pify.mkdir;

var actualize = function actualize(node) {
  var write = function write(root, current) {
    var filename = path.join(root, current.getPath());

    if (current.nodeType() === 'directory') return mkdir(filename);

    var value = current.getValue();
    var data = value.data,
        encoding = value.encoding;


    return writeFile(filename, data, encoding);
  };

  var actualize = function actualize(root, callback) {
    return stat(root).then(function (stats) {
      if (!stats.isDirectory()) throw new Error('root must be a path to an existing directory');
    }).then(function () {
      return node.findAll(function () {
        return true;
      });
    }).then(function (nodes) {
      return new Promise(function (resolve, reject) {
        var next = function next() {
          if (nodes.length === 0) return resolve();

          var current = nodes.shift();

          write(root, current).then(function () {
            return next();
          }).catch(reject);
        };

        next();
      });
    }).then(function () {
      return callback(null);
    }).catch(function (err) {
      return callback(err);
    });
  };

  return { actualize: actualize };
};

module.exports = actualize;