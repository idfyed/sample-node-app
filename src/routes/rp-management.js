/**
 * Copyright 2017 (C) Diglias AB
 *
 * Routes for backend connect trough the RP Management API.
 *
 * @author jonas
 *
 */

var express = require('express');
var router = express.Router();
var request = require('request');

var c = require('./common');

/**
 * Base URLs for api endpoints
 */
var envEndpoints = {
    prod: 'https://api.diglias.com/rp-mgmt/attribute/v1.0/',
    test: 'https://test.diglias.com/rp-mgmt/attribute/v1.0/'
};

/**
 * Call the Diglias service trough a backend channel and add a attribute
 * to the Diglias users profile.
 */

router.post('/', function (req, res, next) {

    // Load relying party cofiguration from file
    var conf = c.loadDigliasConf();

    // Create a request body according to API specification
    var requestBody = {
        action: 'ADD',
        attributes: [
            {
                name: 'acme_loyaltyNumber',
                value: req.body.value
            }
        ]
    };

    var options = {
        auth: {                     // Use basic authentication to access
            user: conf.rpManagement.user,          // the RP Management API
            pass: conf.rpManagement.secret,
            sendImmediately: true
        },
        headers: {                  // Body to be sent as JSON
            ContentType: 'application/json'
        },
        json: true,
        body: requestBody
    };

    //
    // Validate that the configuration contains a valid endpoint.

    if (typeof envEndpoints[conf.endPoint] === 'undefined') {
        throw new Error('Invalid endpoint value: ' + endpoint);
    }

    // The base of the API endpoint
    var endpoint = envEndpoints[conf.endPoint];

    // add on the company name
    endpoint = endpoint.concat(conf.rpManagement.companyname);

    // and the user userid
    endpoint = endpoint.concat('/').concat(req.body.userid);

    request.post(endpoint, options, function (err, result) {
            if (err) {
                throw (err);
            }

            // The expected returned status code is 204 - without a body,
            // anything else is a error.
            if (result.statusCode != 204) {
                res.render('rp-management-error', result);
            } else {
                res.render('rp-management-success', {value: req.body.value});
            }
        }
    );
});

module.exports = router;
