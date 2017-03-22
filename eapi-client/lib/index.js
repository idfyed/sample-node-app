/**
 * Copyright 2017 (C) Diglias AB
 *
 * @author jonas
 *
 * Helper functions to support implementation of the client side of the EAPI
 * authentication protocol.
 *
 * Please read more at: https://test.diglias.com/doc-rp/eapi.jsp
 *
 */
'use strict';

var computeMac = require('./compute-mac');

module.exports = {

  /**
   * Builds a URL including parameters that the user agent should be redirected
   * to to initiate a authentication transaction.
   *
   * Parameters:
   *  endpoint: What Diglias environment to call, can be one of:
   *      "prod" - for the live production system.
   *      "test" -  for testing purposes during integration
   *      "prodTest" - for evaluation purposes in conduction with the prod test diglias app
   *  parameters: A object containing all parameter values and the key to be used when
   *      computing the mac. The parameters should be stored as properties named according
   *      to the API specification. The mac key should be stored as a property called mac_key.
   *
   */
  buildAuthnRequestUrl: function (endpoint, macKey, parameters) {
    // Verify that all mandatory parameters are included
    var mandatoryParams = [
      'auth_companyname',
      'auth_requestid',
      'auth_returnlink',
      'auth_cancellink',
      'auth_rejectlink'
    ];

    mandatoryParams.forEach(function (param) {
      if (typeof parameters[param] === 'undefined') {
        throw new Error('Mandatory parameter [' + param + '] missing');
      }
    });

    // Compute the mac and add it to the map
    parameters.mac = computeMac(parameters, macKey);

    // Concatenate all parameters into a string sutiable as a get
    // request query string
    var keys = Object.keys(parameters);

    var paramString = '';

    keys.forEach(function (key) {
      if (paramString.length > 0) {
        paramString = paramString.concat('&');
      }
      paramString = paramString.concat(key.concat('=').concat(parameters[key]));
    });

    var envEndpoints = {
      build: 'https://build.diglias.com/main-eapi/begin',
      prod: 'https://login.diglias.com/main-eapi/begin',
      prodTest: 'https://prodtest-login.diglias.com/main-eapi/begin',
      test: 'https://test.diglias.com/main-eapi/begin'
    };

    //
    // Validate that the caller has given a valid endpoint

    if (typeof envEndpoints[endpoint] === 'undefined') {
      throw new Error('Invalid endpoint value: ' + endpoint);
    }

    // Return a complete URL
    return envEndpoints[endpoint].concat('?', paramString);
  },

  /**
   * Validates the response from the Diglias server by computing a mac and
   * comparing it with the enclosed one.
   */

  veirifyAuthnResponse: function (responseBody, macKey) {
    return computeMac(responseBody, macKey) === responseBody.mac;
  },

  /**
   * Re-export the computeMac function.
   */
  computeMac: computeMac

};

