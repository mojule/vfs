'use strict';

var Is = require('@mojule/is');
var isValidFilename = require('valid-filename');

var mimetypesText = ['application/javascript', 'application/json'];

var encodingsText = ['utf8', 'ascii', 'utf-8', 'binary', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le'];

var encodingsBinaryString = ['hex', 'base64'];

var encodingsBinary = encodingsBinaryString.concat(['buffer']);

var encodings = encodingsText.concat(encodingsBinary);

var isText = function isText(subject) {
  return (/^text\//.test(subject) || /xml$/.test(subject) || mimetypesText.includes(subject) || encodingsText.includes(subject)
  );
};

var isEncoding = function isEncoding(subject) {
  return encodings.includes(subject);
};

var isJsonBuffer = function isJsonBuffer(subject) {
  return Is.object(subject) && Is.toString(subject.type) && subject.type === 'Buffer' && isByteArray(subject.data);
};

var isByte = function isByte(subject) {
  return Is.integer(subject) && subject >= 0 && subject < 256;
};

var isByteArray = function isByteArray(subject) {
  return Is.array(subject) && subject.every(isByte);
};

var isBuffer = function isBuffer(subject) {
  return subject instanceof Buffer;
};

var isBufferArg = function isBufferArg(subject) {
  return isBuffer(subject) || isJsonBuffer(subject) || isByteArray(subject);
};

var isValue = function isValue(subject) {
  return Is.object(subject) && isValidFilename(subject.name) && Is.string(subject.nodeType);
};

var isDirectoryValue = function isDirectoryValue(subject) {
  return isValue(subject) && subject.nodeType === 'directory';
};

var isFileValue = function isFileValue(subject) {
  return isValue(subject) && subject.nodeType === 'file' && (isStringData(subject) || isBinaryData(subject));
};

var isStringData = function isStringData(subject) {
  return isEncoding(subject.encoding) && encodingsText.includes(subject.encoding) && Is.string(subject.data) || is.undefined(subject.encoding) && Is.string(subject.data);
};

var isBinaryStringData = function isBinaryStringData(subject) {
  return Is.string(subject.data) && encodingsBinaryString.includes(subject.encoding);
};

var isBufferData = function isBufferData(subject) {
  return Is.undefined(subject.encoding) && isBufferArg(subject.data) || subject.encoding === 'buffer' && isBuffer(subject.data);
};

var isBinaryData = function isBinaryData(subject) {
  return isBinaryStringData(subject) || isBufferData(subject);
};

var predicates = {
  text: isText,
  jsonBuffer: isJsonBuffer,
  buffer: isBuffer,
  bufferArg: isBufferArg,
  filename: isValidFilename,
  byte: isByte,
  byteArray: isByteArray,
  encoding: isEncoding,
  value: isValue,
  fileValue: isFileValue,
  directoryValue: isDirectoryValue
};

var is = Is(predicates);

module.exports = is;