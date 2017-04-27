'use strict';

var textTypes = ['application/javascript', 'application/json'];

module.exports = function (mime) {
  return (/^text\//.test(mime) || /xml$/.test(mime) || textTypes.includes(mime)
  );
};