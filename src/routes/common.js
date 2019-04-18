/**
 * Copyright 2019 (C) IDFyed Solutions AB
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
};

/**
 * Loads configuration data from a JSON file
 */

module.exports.loadIdFyedConf = function() {

    var conf = JSON.parse(fs.readFileSync("./src/idfyed-conf.json", 'utf8'));

    // Default to using the prodTest environment if not specified
    // in the configuration file.
    if (!conf.hasOwnProperty('endPoint')) {
        conf.endPoint = 'prodTest';
    }

    return conf;
};

/**
 * Checks that a the request Id from the request is the same
 * as the one stored in the session.
 */

module.exports.validateAuthRequestId = function(req) {
    return req.session.requestId === req.body.auth_inresponseto;
};
