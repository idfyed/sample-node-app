/**
 * Copyright 2019 (C) IDFyed Solutions AB
 *
 * Emulates a request from the Diglias app without having to actually have to scan a static QR code.
 *
 * @author jonas
 *
 */

var dateFormat = require('dateformat');
var randomString = require('randomstring');
var express = require('express');

var Diglias = require('diglias-eapi-client');
var router = express.Router();
var _ = require('lodash');

var c = require('./common');

/**
 * Prepare a message to the Diglias GO service and redirect the users
 * browser to Diglias to ask the user to authenticate. This step is intended
 * for emulation of the App-Initated flow, this is not part of the normal
 * application flow.
 */

router.post('/emulate', function (req, res, next) {

    // Load relying party cofiguration from file
    var conf = c.loadDigliasConf();

    var params = {};

    params.auth_companyname = conf.login.auth_companyname;

    // Add application specific options (URL:s)
    params.auth_returnlink = c.buildEndpointUrl(req, "app-initiated/transform");
    params.auth_cancellink = c.buildEndpointUrl(req, "authenticate/cancel");
    params.auth_rejectlink = c.buildEndpointUrl(req, "authenticate/reject");

    // Pass the QR code payload as RelayState for the purpose of emulation.
    params.RelayState = req.body.payload;

    // Generate a random request id, in the case of app initiated this value will
    // be generated by the Diglias Go service and included as input.
    params.auth_requestid = randomString.generate(16);

    // Build the URL and redirect the users browser to it.
    res.redirect(Diglias.buildAuthnRequestUrl(conf.endPoint, conf.login.mac_key, params));
});

/**
 * Receives the authnResponse from the Diglias GO service and transforms it to
 * a request that normally would be sent to the application in the app-initiated flow.
 */

router.post('/transform', function(req, res, next){
    // Add a timestamp to the response, it would in the response from the Diglias Go service
    // as part of a app-initiated flow.
    req.body.auth_timestamp = dateFormat(Date(), "isoUtcDateTime");

    // Since we add a auth_* parameter , we need to compute a new MAC.
    req.body.mac = Diglias.computeMac(req.body,c.loadDigliasConf().login.mac_key);

    // Transform the POST body to a string of parameters suitable for a GET request
    var urlParams = '';

    Object.keys(req.body).forEach(function (key) {
        if ( urlParams.length > 0) {
            urlParams += '&';
        }

        if ( key === 'RelayState') {
            // Rename RelayState to payload
            urlParams = urlParams.concat('payload=').concat(encodeURIComponent(req.body[key]));
        } else {
            urlParams = urlParams.concat(key).concat('=').concat(encodeURIComponent(req.body[key]));
        }
    });

    // Redirect to the entry point - this GET request would normally originate from
    // a web view in the Diglias app to the web application.
    res.redirect('entrypoint?'.concat(urlParams));
});

module.exports = router;
