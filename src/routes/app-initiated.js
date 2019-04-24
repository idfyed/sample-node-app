/**
 * Copyright 2019 (C) IDFyed Solutions AB
 *
 * Implements a route for returning a page that will be rendered in a web view in the Diglias app
 * when the user has scanned a static QR code.
 *
 * @author jonas
 *
 */

var dateParse = require('date-parse');
var express = require('express');

var Diglias = require('diglias-eapi-client');
var router = express.Router();
var _ = require('lodash');

var c = require('./common');

/**
 *
 * The main entrypoint to the application in the app initiated flow. This URL will be receive
 * a GET request once the user has scanned a static QR code. The reponse will be rendered in a webview
 * in the Diglias app and the user perception is that the user is still in the context of the App.
 */

router.get('/entrypoint', function (req, res, next) {

    // Validate that the response has not been tampered with
    if (!Diglias.veirifyAuthnResponse(req.query, c.loadDigliasConf().login.mac_key)) {
        res.render('invalid-mac');
        return;
    }

    // Check that the timestamp is reasonably fresh - of not a replay attack might be suspected,
    // allow it to be max 2000 msec old.
    if (new Date().getTime() - dateParse(req.query.auth_timestamp).getTime() > 2000) {
        res.render('to-old-timestamp');
        return;
    }

    // Check that the request id has not been used before, if it has it might be a replay attack.
    if (!validateRequestId(req.query.auth_inresponseto)) {
        res.render('request-already-used');
        return;
    }

    // Render a result in the app
    res.render('app-initiated-success', {body: _.clone(req.query)});
});

module.exports = router;

/**
 * Keeps track of request id that have been used, for the sake of the sample implemented
 * as a in memory array. In a real world scenario it should probably be implemented in a way that the
 * id:s are persisted between server restarts and cleaned up in a structured manner.
 *
 * @param id
 * @returns {boolean} false if the id has been used before
 */

var requestIds = [];

function validateRequestId(id) {
    if (requestIds.find(function (elem) {
            return elem === id;
        })) {
        return false;
    } else {
        requestIds.push(id);
        return true;
    }
}
