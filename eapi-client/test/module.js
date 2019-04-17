/**
 * Copyright 2019 (C) IDFyed Solutions AB
 *
 * @author jonas
 *
 */
'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');

var EAPI = require('../lib');

var testData = require('./test-data');

describe('module-interface', function () {
  describe('#veirifyAuthnResponse', function () {
    it('should should verify a valid response', function () {
      assert.isTrue(EAPI.veirifyAuthnResponse(testData.responseData, testData.key));
    });
  });

  describe('#buildAuthnRequestUrl', function () {
    it('should generate a valid request url', function () {
      assert.equal(testData.prodRequestURL,
        EAPI.buildAuthnRequestUrl('prod', testData.key, testData.requestData));
    });
    it('should throw a error when a mandatory parameter is missing', function () {
      var spy = sinon.spy(EAPI.buildAuthnRequestUrl);

      try {
        spy('prod', testData.key, testData.invalidRequestData);
      } catch (err) {
      }

      assert(spy.threw());
    });
    it('should throw a error when a unknown endpoint is supplied', function () {
      var spy = sinon.spy(EAPI.buildAuthnRequestUrl);

      try {
        spy('unknown', testData.key, testData.requestData);
      } catch (err) {
      }

      assert(spy.threw());
    });
  });

  describe('#computeMac', function () {
    it('should be exported', function () {
      assert(typeof EAPI.computeMac === 'function');
    });
  });
});
