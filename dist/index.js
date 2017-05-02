'use strict';

var is = require('@mojule/is');
var TreeFactory = require('@mojule/tree').Factory;
var FactoryFactory = require('@mojule/tree').FactoryFactory;
var defaultPlugins = require('./plugins');
var defaultOptions = { exposeProperties: ['filename', 'data', 'ext', 'mime'] };
var Factory = FactoryFactory(TreeFactory, defaultPlugins, defaultOptions);
var Tree = Factory();

Object.assign(Tree, { Factory: Factory });

module.exports = Tree;