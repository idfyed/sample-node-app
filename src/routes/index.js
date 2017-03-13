/**
 * Copyright 2017 (C) Diglias AB
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

module.exports = router;
