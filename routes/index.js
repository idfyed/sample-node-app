/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 * 
 */

var express = require('express');
var Diglias = require('../diglias');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});


/* Redirect the users agent to the Diglias GO athentication server */
var callbackBaseUrl = "https://localhost:3000/";
var startAuthURL = 'https://prodtest-login.diglias.com/main-eapi/begin';

router.get('/authenticate', function(req, res, next) {

    var params = Diglias.authnRequestParams(callbackBaseUrl);
    res.redirect(startAuthURL.concat('?', params));
});

/* POST sucess message from Diglias. */
router.post('/authenticate/success', function(req, res, next) {
    if ( Diglias.veirifyAuthnResponse(req.body)) {
        res.render('success', {  body: req.body });
    } else {
        res.render('invalid-mac' );
    }
});

/* GET cancel message from Diglias. */
router.get('/authenticate/cancel', function(req, res, next) {
    res.render('cancel');
});

/* GET reject message from Diglias */
router.get('/authenticate/reject', function(req, res, next) {
    res.render('reject', { code: req.query.error_code, message: req.query.error_message});
});

module.exports = router;
