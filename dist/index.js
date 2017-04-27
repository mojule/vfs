'use strict';

var TreeFactory = require('@mojule/tree').Factory;
var is = require('@mojule/is');
var defaultPlugins = require('./plugins');

var defaultOptions = {};

var Factory = function Factory() {
  for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  var options = {};

  if (plugins.length > 0 && is.object(plugins[plugins.length - 1])) options = plugins.pop();

  options = Object.assign({}, defaultOptions, options);

  if (plugins.length === 1 && is.array(plugins[0])) plugins = plugins[0];

  plugins = defaultPlugins.concat(plugins);

  return TreeFactory(plugins, options);
};

var Tree = Factory();

Object.assign(Tree, { Factory: Factory });

module.exports = Tree;