'use strict';

var actualize = require('./actualize');
var atPath = require('./atPath');
var create = require('./create');
var getPath = require('./getPath');
var isEmpty = require('./isEmpty');
var isValue = require('./isValue');
var registerText = require('./registerText');
var serializer = require('./serializer');
var slug = require('./slug');
var value = require('./value');
var virtualize = require('./virtualize');

module.exports = [actualize, atPath, create, getPath, isEmpty, isValue, registerText, serializer, slug, value, virtualize];