'use strict';

var is = require('@mojule/is');

var atPath = function atPath(node) {
  return {
    atPath: function atPath(path) {
      var root = node.getRoot();

      var slugs = path.split('/');

      var target = root;

      slugs.forEach(function (slug, i) {
        if (i === 0 || is.undefined(target)) return;

        var children = target.getChildren();

        target = children.find(function (child) {
          return child.slug() === slug;
        });
      });

      return target;
    }
  };
};

module.exports = atPath;