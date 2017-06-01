'use strict';

var is = require('@mojule/is');

var registerText = function registerText(node) {
  var extensions = new Set();

  var normalizeExt = function normalizeExt(ext) {
    if (!is.string(ext) || ext.length === 0) throw new Error('Expected a non empty string');

    if (!ext.startsWith('.')) ext = '.' + ext;

    ext = ext.toLowerCase();

    return ext;
  };

  var $registerText = function $registerText(ext) {
    return extensions.add(normalizeExt(ext));
  };
  var $isTextExtension = function $isTextExtension(ext) {
    return extensions.has(normalizeExt(ext));
  };

  return {
    $registerText: $registerText, $isTextExtension: $isTextExtension
  };
};

module.exports = registerText;