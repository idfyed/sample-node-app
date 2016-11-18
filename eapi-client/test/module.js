/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 *
 */

var assert = require('chai').assert;

var EAPI = require('../lib');

var testData = require('./test-data');


describe('module-interface', function () {
    it("#veirifyAuthnResponse", function () {
        assert.isTrue(EAPI.veirifyAuthnResponse(testData.responseData, testData.key));
    });

    it("#buildAuthnRequestUrl", function () {
        assert.equal(testData.prodRequestURL, EAPI.buildAuthnRequestUrl('prod', testData.key, testData.requestData));
    });

});
