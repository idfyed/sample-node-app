/**
 * Copyright 2019 (C) Idfyed Solutions AB
 *
 * @author jonas
 *
 * Helper functions to support implementation of the client side of the EAPI
 * authentication protocol.
 *
 * Please read more at: https://test.idfyed.com/doc-rp/eapi.jsp
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
   *  endpoint: What Idfyed environment to call, can be one of:
   *      "prod" - for the live production system.
   *      "test" -  for testing purposes during integration
   *      "prodTest" - for evaluation purposes in conduction with the prod test Idfyed app
   *  macKey: The key te be used to compute the mac
   *  parameters: A object containing all parameter values and the key to be used when
   *      computing the mac. The parameters should be stored as properties named according
   *      to the API specification.
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

    // Url encode parameter values and concatenate them into a string suitable as a get
    // request query string
    var keys = Object.keys(parameters);

    var paramString = '';

    keys.forEach(function (key) {
      if (paramString.length > 0) {
        paramString = paramString.concat('&');
      }
      paramString = paramString.concat(key.concat('=').concat(encodeURIComponent(parameters[key])));
    });

    var envEndpoints = {
      build: 'https://build.idfyed.com/main-eapi/begin',
      prod: 'https://login.idfyed.com/main-eapi/begin',
      prodTest: 'https://prodtest-login.idfyed.com/main-eapi/begin',
      test: 'https://test.idfyed.com/main-eapi/begin'
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
   * Validates the response from the Idfyed server by computing a mac and
   * comparing it with the enclosed one.
   */

  verifyAuthnResponse: function (responseBody, macKey) {
    return computeMac(responseBody, macKey) === responseBody.mac;
  },

  /**
   * Re-export the computeMac function.
   */
  computeMac: computeMac

};
