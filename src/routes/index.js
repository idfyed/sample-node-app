/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 *
 */

var dateFormat = require('dateformat');
var randomString = require('randomstring');
var express = require('express');
var fs = require('fs');
var Diglias = require('diglias-eapi-client');

var router = express.Router();

var _ = require('lodash');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

/**
 * Finds our protocol, hostname and port from the request and
 * adds the supplied URL to it.
 */

function buildEndpointUrl(req, endpoint) {
    var prot = "http";
    if (req.connection.encrypted) {
        prot = "https";
    }

    return prot.concat("://", req.headers.host, "/", endpoint);
}

/**
 * Loads configuration data from a JSON file
 */

function loadDigliasConf() {

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

function validateAuthRequestId(req) {
    return validateRequestId(req, 'authRequestId');
}

/**
 * Prepare a message to the Diglias server and redirect the users
 * browser to Diglias to ask the user to authenticate.
 */

router.get('/authenticate', function (req, res, next) {

    // Load relying party cofiguration from file
    var conf = loadDigliasConf();

    params = {};

    params.auth_companyname = conf.login.auth_companyname;

    // Add application specific options (URL:s)
    params.auth_returnlink = buildEndpointUrl(req, "authenticate/success");
    params.auth_cancellink = buildEndpointUrl(req, "authenticate/cancel");
    params.auth_rejectlink = buildEndpointUrl(req, "authenticate/reject");

    // Generate a random request id and store it in a cookie to be able
    // to validate the response.
    params.auth_requestid = randomString.generate(16);
    res.cookie('authRequestId', params.auth_requestid);

    // Build the URL and redirect the users browser to it.
    res.redirect(Diglias.buildAuthnRequestUrl(conf.endPoint, conf.login.mac_key, params));
});

/**
 * The Diglias server will redirect the users browser to POST to this URL
 * once the authenitcation has been sucessfullty completed.
 */
router.post('/authenticate/success', function (req, res, next) {

    // Validate that the reponse has not been tampered with
    if (Diglias.veirifyAuthnResponse(req.body, loadDigliasConf().login.mac_key)) {
        // Validate that the response is related to our request
        if (validateAuthRequestId(req)) {
            // Render the content of the reponse
            res.render('success', {body: _.clone(req.body)});
        } else {
            res.render('invalid-request');
        }
    } else {
        res.render('invalid-mac');
    }
});

/**
 * The Diglias server will redirect the users browser this URL
 * if the user cancels the authentication.
 */

router.get('/authenticate/cancel', function (req, res, next) {
    res.render('cancel');
});

/**
 * The Diglias server will redirect the users browser this URL
 * if the authentication gets rejected by the Diglais server.
 */

router.get('/authenticate/reject', function (req, res, next) {
    res.render('reject', {
        code: req.query.error_code,
        message: req.query.error_message
    });
});

module.exports = router;
