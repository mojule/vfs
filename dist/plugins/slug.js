'use strict';

var slug = function slug(node) {
  return {
    slug: function slug() {
      return node.getValue('name');
    }
  };
};

module.exports = slug;