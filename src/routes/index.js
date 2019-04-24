/**
 * Copyright 2019 (C) IDFyed Solutions AB
 *
 * @author jonas
 *
 */

var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* Routes for the authenticate flow */
router.use('/authenticate', require('./authenticate'));

/* Routes for RP Management */
router.use('/rp-management', require('./rp-management'));

/* Route for App Initiated */
router.use('/app-initiated', require('./app-initiated'));

/* Route for emulation of static QR code scanning */
router.use('/app-initiated', require('./app-initiated-emulation'));

module.exports = router;
