'use strict';

var getPath = function getPath(node) {
  return {
    getPath: function getPath() {
      var slugs = [];

      node.walkUp(function (current) {
        var slug = current.slug();

        if (slug.includes('/')) throw new Error('Node slugs should not contain the separator string "/"');

        slugs.unshift(slug);
      });

      return slugs.join('/');
    }
  };
};

module.exports = getPath;