'use strict';

var slug = function slug(node) {
  return {
    slug: function slug() {
      return node.filename();
    }
  };
};

module.exports = slug;