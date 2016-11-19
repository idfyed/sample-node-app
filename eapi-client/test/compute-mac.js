/**
 * Copyright 2016 (C) Diglias AB
 *
 * @author jonas
 *
 */
'use strict';

var assert = require('chai').assert;

var computeMac = require('../lib/compute-mac');
var testData = require('./test-data');

describe('#compute-mac', function () {
  it('should return the expected response MAC', function () {
    assert.equal(testData.responseMAC, computeMac(testData.responseData, testData.key));
  });
  it('should return the expected request MAC', function () {
    assert.equal(testData.requestMAC, computeMac(testData.requestData, testData.key));
  });
});
