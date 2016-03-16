/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 * 
 * Helper functions to support implementation of the client side of the EAPI
 * athentication protocol.
 * 
 * Please read more at: https://test.diglias.com/doc-rp/eapi.jsp
 *
 */

// Used to compute the mac as a HMAC-MD5
var Hashes = require('jshashes');

var diglias = {};

/**
 * Computes a mac according to the API specification.
 */

function computeMac( values, macKey ) {
    // Sort the values in alphabetical order bye name
    var keys = Object.keys(values).sort();

    // Concatenate all valid paramateres to one string
    var macData = "";

    keys.forEach(function(key) {
        // Only values prefixed with "auth_" should be hashed
        if (key.match("auth_.*")) {
            if (macData.length > 0) {
                // Separate parameters with "&"
                macData = macData.concat("&");
            }
            
            // Sort the values of a parameter alphabetically
            value = ""
            values[key].split(',').sort().forEach(function(val){
                if ( value.length > 0 ) {
                    value = value.concat(',');
                }
                value = value.concat( val );
            });
            
            macData = macData.concat(key.concat("=").concat(value));
        }
    });

    // Compute mac based on the values
    return new Hashes.MD5().hex_hmac(macKey, macData).toUpperCase();
}

/**
 * Builds a URL including parametrers that the uset agent should be redirected
 * to to initiate a authentication transaction.
 *
 * Parameters:
 *  endpoint: What Diglias envirioment to call, can be one of:
 *      "prod" - for the live production system.
 *      "test" -  for testing purposes during integration
 *      "prodTest" - for evaliation purposes in conjucton with the prod test diglias app
 *  parameters: A object containing all parameter values and the key to be used when
 *      computing the mac. The parameters should be stored as proprties nameed according
 *      to the API specification. The mac key shold be stored as a property called mac_key. 
 *  
 */
diglias.buildAuthnRequestUrl = function(endpoint, parameters ) {

    // Verify that all mandotory parameters are included
    var mandatoryParams = [
        "auth_companyname",
        "auth_requestid",
        "auth_returnlink",
        "auth_cancellink",
        "auth_rejectlink",
    ];
    
    mandatoryParams.forEach( function( param ){
        if (typeof parameters[param] === "undefined") {
            throw new Error("Mandotory parameter [" + param + "] missing");
        }
    });
    
    // Compute the mac and add it to the map
    parameters.mac = computeMac(parameters, parameters.mac_key);
    
    // Remove the mac key from the map
    delete parameters.mac_key;
    
    // Concatenate all patameters into a string sutiable as a get
    // request query string
    var keys = Object.keys(parameters);

    var paramString = "";

    keys.forEach(function(key) {
        if (paramString.length > 0) {
            paramString = paramString.concat("&");
        }
        paramString = paramString.concat(key.concat("=").concat(parameters[key]));
    });

    var envEndpoints = {
        prod : "https://login.diglias.com/main-eapi/begin",
        prodTest : "https://prodtest-login.diglias.com/main-eapi/begin",
        test : "https://test.diglias.com/main-eapi/begin"
    };

    //
    // Validate that the caller has given a valid endpoint
 
    if ( typeof envEndpoints[endpoint] === "undefined") {
        throw new Error("Invalid endpoint value: " + endpoint);
    }
 
    // Return a complete URL
    return envEndpoints[endpoint].concat('?',paramString);
};

/**
 * Validates the response from the Diglias server by computing a mac and
 * comparing it with the enclosed one.
 */

diglias.veirifyAuthnResponse = function( responseBody, macKey ) {
    var mac = computeMac( responseBody, macKey );
    return mac === responseBody.mac;
};

module.exports = diglias;