/**
 * Copyright 2017 (C) Diglias AB
 *
 * Common functions used in the different flows.
 *
 * @author jonas
 *
 */

var fs = require('fs');

/**
 * Finds our protocol, hostname and port from the request and
 * adds the supplied URL to it.
 */

module.exports.buildEndpointUrl = function(req, endpoint) {
    var prot = "http";
    if (req.connection.encrypted) {
        prot = "https";
    }

    return prot.concat("://", req.headers.host, "/", endpoint);
}

/**
 * Loads configuration data from a JSON file
 */

module.exports.loadDigliasConf = function() {

    var conf = JSON.parse(fs.readFileSync("./src/diglias-conf.json", 'utf8'));

    // Default to using the prodTest environment if not specified
    // in the configuration file.
    if (!conf.hasOwnProperty('endPoint')) {
        conf.endPoint = 'prodTest';
    }

    return conf;
}

/**
 * Checks that a cookie set has the same content as the
 * resonponse code.
 */

function validateRequestId(req, cookie) {
    return req.cookies[cookie] == req.body.auth_inresponseto;
}

module.exports.validateAuthRequestId = function(req) {
    return validateRequestId(req, 'authRequestId');
}
