/**
 * Copyright 2019 (C) Idfyed Solutions AB
 *
 * Routes for the normal authentication flow and web flow connect
 *
 * @author jonas
 *
 */

var dateFormat = require('dateformat');
var randomString = require('randomstring');
var express = require('express');

var Idfyed = require('idfyed-eapi-client');
var router = express.Router();
var _ = require('lodash');

var c = require('./common');

/**
 * Prepare a message to the Idfyed server and redirect the users
 * browser to Idfyed to ask the user to authenticate.
 */

router.post('/', function (req, res, next) {

    // Load relying party cofiguration from file
    var conf = c.loadIdfyedConf();

    var params = {};

    params.auth_companyname = conf.login.auth_companyname;

    // Determine if the default set of attributes should be used or if a subset
    // has been chosen.
    if (Object.keys(req.body).length > 0) {

        // To use a sub set of the attributes, supply the names as a comma separated
        // list on the parameter auth_attributes.
        params.auth_attributes = "";
        for (var attr in req.body) {
            if (params.auth_attributes.length > 0) {
                params.auth_attributes = params.auth_attributes.concat(',');
            }
            params.auth_attributes = params.auth_attributes.concat(attr);
        }
    }

    // Add application specific options (URL:s)
    params.auth_returnlink = c.buildEndpointUrl(req, "authenticate/success");
    params.auth_cancellink = c.buildEndpointUrl(req, "authenticate/cancel");
    params.auth_rejectlink = c.buildEndpointUrl(req, "authenticate/reject");

    // Generate a random request id and store it in the session to be able
    // to validate the response.
    params.auth_requestid = randomString.generate(16);
    req.session.requestId = params.auth_requestid;

    // Build the URL and redirect the users browser to it.
    res.redirect(Idfyed.buildAuthnRequestUrl(conf.endPoint, conf.login.mac_key, params));
});

/**
 * Prepare a message to the Idfyed server and redirect the users
 * browser to Idfyed to ask the user to have a attribute added to
 * their Idfyed.
 */

router.post('/connect', function (req, res, next) {

    // Load relying party cofiguration from file
    var conf = c.loadIdfyedConf();

    var params = {};

    params.auth_companyname = conf.login.auth_companyname;

    // Add the value from the form as a auth_rp_* attribute
    // For this to work, the RP will have to be configured as a ambassador for the attribute.
    params.auth_rp_acme_loyaltyNumber = req.body.value;

    // Only show the ambassador attribute to the user, if this is omitted the user will be requested to give
    // all attributes specified in the RP - this might seem illogical depending on use case.
    params.auth_attributes = 'acme_loyaltyNumber';

    // Add the timestamp required when performing a connect
    params.auth_timestamp = dateFormat(Date(), "isoUtcDateTime");

    // Add application specific options (URL:s)
    params.auth_returnlink = c.buildEndpointUrl(req, "authenticate/success");
    params.auth_cancellink = c.buildEndpointUrl(req, "authenticate/cancel");
    params.auth_rejectlink = c.buildEndpointUrl(req, "authenticate/reject");

    // Generate a random request id and store it in the sessione to be able
    // to validate the response.
    params.auth_requestid = randomString.generate(16);
    req.session.requestId = params.auth_requestid;

    // Build the URL and redirect the users browser to it.
    res.redirect(Idfyed.buildAuthnRequestUrl(conf.endPoint, conf.login.mac_key, params));
});

/**
 * The Idfyed server will redirect the users browser to POST to this URL
 * once the authentication has been successfully completed.
 */
router.post('/success', function (req, res, next) {

    // Validate that the reponse has not been tampered with
    if (Idfyed.verifyAuthnResponse(req.body, c.loadIdfyedConf().login.mac_key)) {
        // Validate that the response is related to our request
        if (c.validateAuthRequestId(req)) {
            // Render the content of the response
            res.render('success', { body: _.clone(req.body) });
        } else {
            res.render('invalid-request');
        }
    } else {
        res.render('invalid-mac');
    }
});

/**
 * The Idfyed server will redirect the users browser this URL
 * if the user cancels the authentication.
 */

router.get('/cancel', function (req, res, next) {
    res.render('cancel');
});

/**
 * The Idfyed server will redirect the users browser this URL
 * if the authentication gets rejected by the Idfyed server.
 */

router.get('/reject', function (req, res, next) {
    res.render('reject', {
        code: req.query.error_code,
        message: req.query.error_message
    });
});

module.exports = router;
