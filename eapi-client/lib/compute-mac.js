/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 *
 */

'use strict';

/**
 * Computes a MAC according to the API specification.
 */

// Used to compute the mac as a HMAC-MD5
var Hashes = require('jshashes');

module.exports = function (values, macKey) {
  // Sort the values in alphabetical order bye name
  var keys = Object.keys(values).sort();

  // Concatenate all valid parameters to one string
  var macData = '';

  keys.forEach(function (key) {
    // Only values prefixed with "auth_" should be hashed
    // noinspection JSCheckFunctionSignatures
    if (key.match('auth_.*')) {
      if (macData.length > 0) {
        // Separate parameters with "&"
        macData = macData.concat('&');
      }
      macData = macData.concat(key.concat('=').concat(values[key]));
    }
  });

  // Compute mac based on the values
  return new Hashes.MD5().hex_hmac(macKey, macData).toUpperCase();
};
