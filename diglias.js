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

// Used to comåute the mac as a MD5 HMAC
var Hashes = require('jshashes');

var diglias = {};

// Constants, please adopt according to the specific 
// confih´guration.
var companyName = "playground";
var returnLink = "authenticate/success";
var cancelLink = "authenticate/cancel";
var rejectLink = "authenticate/reject";
var requestId = "xxxxxxxxxxxxxxxx";
var macKey = "LW4eUhQkJfwJGgQU8JCT/g==1";

/**
 * Computes a mac according to the API specification.
 */

function computeMac( values ) {
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
 * Prepars a query string to be sent to the Diglias server
 */
diglias.authnRequestParams = function(callbackBaseUrl) {
    var paramsMap = {};

    // Add mandatory parameters to a map
    paramsMap.auth_companyname = companyName;
    paramsMap.auth_requestid = requestId;
    paramsMap.auth_returnlink = callbackBaseUrl.concat(returnLink);
    paramsMap.auth_cancellink = callbackBaseUrl.concat(cancelLink);
    paramsMap.auth_rejectlink = callbackBaseUrl.concat(rejectLink);

    // Compute the mac and add it to the map
    paramsMap.mac = computeMac(paramsMap);
    
    // Concatenate all patameters into a string sutiable as a get request query string
    var keys = Object.keys(paramsMap);

    var params = "";

    keys.forEach(function(key) {
        if (params.length > 0) {
            params = params.concat("&");
        }
        params = params.concat(key.concat("=").concat(paramsMap[key]));
    });

    return params;
};

/**
 * Validates the response from the Diglias server by computing a mac and
 * comparing it with the enclosed one.
 */

diglias.veirifyAuthnResponse = function( responseBody ) {
    var mac = computeMac( responseBody );
    return mac === responseBody.mac;
};

module.exports = diglias;