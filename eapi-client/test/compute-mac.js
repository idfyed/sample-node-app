/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 * 
 */

var assert = require('chai').assert;

var computeMac = require('../src/compute-mac');
var testData = require('./test-data');

describe('compute-mac', function () {
    it("#computeMac-response Should return the expected MAC", function () {
        assert.equal(testData.responseMAC, computeMac(testData.responseData, testData.key));
    });
    it("#computeMac-request Should return the expected MAC", function () {
        assert.equal(testData.requestMAC, computeMac(testData.requestData, testData.key));
    });
});