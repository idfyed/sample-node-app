/**
 * Copyright 2017 (C) Diglias AB
 *
 * @author jonas
 *
 */
'use strict';

var assert = require('chai').assert;

var computeMac = require('../lib/compute-mac');
var testData = require('./test-data');

describe('#compute-mac', function () {
  it('should compute different MACS for different alphabetical orders', function () {
    var mac1 = computeMac(
      /* eslint-disable camelcase */
      {auth_parameter: 'a,b,c'},
      /* eslint-enable camelcase */
      testData.key
    );

    var mac2 = computeMac(
      /* eslint-disable camelcase */
      {auth_parameter: 'c,b,a'},
      /* eslint-enable camelcase */
      testData.key
    );

    assert.notEqual(mac1, mac2);
  });
  it('should only include auth_ parameters in the mac', function () {
    var mac1 = computeMac(
      {
        /* eslint-disable camelcase */
        auth_parameter: 'value',
        other_parameter: 'value1'
        /* eslint-enable camelcase */
      },
      testData.key);

    var mac2 = computeMac(
      {
        /* eslint-disable camelcase */
        auth_parameter: 'value',
        other_parameter: 'different'
        /* eslint-enable camelcase */
      },
      testData.key);

    assert.equal(mac1, mac2);
  });

  it('should return the expected response MAC', function () {
    assert.equal(testData.responseMAC, computeMac(testData.responseData, testData.key));
  });
  it('should return the expected request MAC', function () {
    assert.equal(testData.requestMAC, computeMac(testData.requestData, testData.key));
  });
});
