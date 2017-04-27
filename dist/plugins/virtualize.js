'use strict';

var fs = require('fs');
var path = require('path');
var pify = require('pify');

var _pify = pify(fs),
    stat = _pify.stat,
    readdir = _pify.readdir,
    readFile = _pify.readFile;

var getChildPaths = function getChildPaths(current) {
  var ls = function ls(stats) {
    return stats.isDirectory() ? readdir(current) : [];
  };
  var toPath = function toPath(filename) {
    return path.join(current, filename);
  };
  var toPaths = function toPaths(files) {
    return files.map(toPath);
  };

  return stat(current).then(ls).then(toPaths);
};

var virtualize = function virtualize(node) {
  var createDirectory = function createDirectory(source) {
    var parsed = path.parse(source);
    var base = parsed.base;


    var directory = node.createDirectory(base);

    directory.setMeta('source', source);

    return directory;
  };

  var createNode = function createNode(source) {
    var parsed = path.parse(source);
    var base = parsed.base;


    var createFile = function createFile(data) {
      var file = node.createFile(base, data);

      file.setMeta('source', source);

      return file;
    };

    return readFile(source).then(createFile);
  };

  var pathToNode = function pathToNode(source) {
    return stat(source).then(function (stats) {
      return stats.isDirectory() ? createDirectory(source) : createNode(source);
    });
  };

  var childPathsToNodes = function childPathsToNodes(paths) {
    return Promise.all(paths.map(pathToNode));
  };

  var createRoot = function createRoot(rootPath) {
    return new Promise(function (resolve, reject) {
      var parsed = path.parse(rootPath);
      var name = parsed.name;

      var root = node.createDirectory(name);
      var nodes = [root];

      root.setMeta('source', rootPath);

      var next = function next() {
        if (!nodes.length) return resolve(root);

        var current = nodes.pop();
        var source = current.getMeta('source');

        getChildPaths(source).then(childPathsToNodes).then(function (children) {
          children.forEach(function (child) {
            current.append(child);
            nodes.push(child);
          });

          next();
        }).catch(reject);
      };

      next();
    });
  };

  var $virtualize = function $virtualize(rootPath, callback) {
    return stat(rootPath).then(function (stats) {
      return stats.isDirectory() ? createRoot(rootPath) : createNode(rootPath);
    }).then(function (rootNode) {
      return callback(null, rootNode);
    }).catch(callback);
  };

  return { $virtualize: $virtualize };
};

module.exports = virtualize;