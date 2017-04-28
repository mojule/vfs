'use strict';

var getPath = function getPath(node) {
  return {
    getPath: function getPath() {
      var slugs = [];

      node.walkUp(function (current) {
        var slug = current.slug();
        slugs.unshift(slug);
      });

      return slugs.join('/');
    }
  };
};

module.exports = getPath;