/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 * 
 */

var express = require('express');
var fs = require('fs');
var Diglias = require('diglias-eapi-client');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});


/* Redirect the users agent to the Diglias GO athentication server */
var callbackBaseUrl = "https://localhost:3000/";


/**
 * Finds our protocol, hostname and port from the request and 
 * adds the supplied URL to it.
 */

function buildEndpointUrl(req, endpoint) {
    // TODO Dynamically findput protocol, hostname, port etc...
    
    var prot = "http";
    if ( req.connection.encrypted ) {
        prot = "https";
    }
    
    return prot.concat("://", req.headers.host, "/", endpoint);
}

/**
 * Loads configuration data from a JSON file
 */

function loadDigliasConf() {
    return JSON.parse(fs.readFileSync("./src/diglias-conf.json", 'utf8'));
}

/**
 * Prepare a message to the Diglias server and redirect the users
 * browser to Diglias to ask the user to authentica.
 */

router.get('/authenticate', function(req, res, next) {

    // Load relying party cofiguration from file
    var conf = loadDigliasConf();

    params = {};
    
    params.auth_companyname = conf.auth_companyname;
    
    // Add application specific options (URL:s)
    params.auth_returnlink = buildEndpointUrl(req, "authenticate/success");
    params.auth_cancellink = buildEndpointUrl(req, "authenticate/cancel");
    params.auth_rejectlink = buildEndpointUrl(req, "authenticate/reject");

    // Add request id - in this example it is a dummy, in a real world 
    // application it should be a unique identifier of the login reqest
    // that is stable bewteen HTTP requests.
    params.auth_requestid = "xxxxxxxxxxxxxxxx";

    // Build the URL and redirect the users browser to it.
    res.redirect(Diglias.buildAuthnRequestUrl('prodTest', conf.mac_key, params));
});

/**
 * The Diglias server will redirect the users browser to POST to this URL 
 * once the authenitcation has been sucessfullty completed.
 */

router.post('/authenticate/success', function(req, res, next) {

    // Validate that the reponse has not been tampered with
    if (Diglias.veirifyAuthnResponse(req.body, loadDigliasConf().mac_key)) {
        // Render the content of the reponse
        res.render('success', { body: req.body });
    } else {
        res.render('invalid-mac');
    }
});

/**
 * The Diglias server will redirect the users browser this URL 
 * if the user cancels the authentication.
 */

router.get('/authenticate/cancel', function(req, res, next) {
    res.render('cancel');
});

/**
 * The Diglias server will redirect the users browser this URL 
 * if the authentication gets rejected by the Diglais server.
 */

router.get('/authenticate/reject', function(req, res, next) {
    res.render('reject', { code: req.query.error_code, message: req.query.error_message });
});

module.exports = router;
