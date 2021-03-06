/**
 * Copyright 2019 (C) Idfyed Solutions AB
 *
 * @author jonas
 *
 */
'use strict';

module.exports = {
  key: 'LW4eUhQkJfwJGgQU8JCT/g==',

  responseData: {
    /* eslint-disable */
    auth_authnmethod: 'idfyed',
    auth_inresponseto: 'xxxxxxxxxxxxxxxx',
    mac: '36B6F95E8F901F60DBB4E05CADA737A6',
    auth_a_mobile: '+46708195377',
    auth_a_personalIdentificationNumber: '19750101-5050',
    auth_userid: 'f731a1e6-ebcc-4ac6-aa5a-f81899885c7e',
    auth_a_email: 'jonas@idfyed.com,user2@domain.com'
    /* eslint-enable */
  },

  responseMAC: '36B6F95E8F901F60DBB4E05CADA737A6',

  requestData: {
    /* eslint-disable */
    auth_companyname: 'playground',
    auth_returnlink: 'https://localhost:3000/authenticate/success',
    auth_cancellink: 'https://localhost:3000/authenticate/cancel',
    auth_rejectlink: 'https://localhost:3000/authenticate/reject',
    auth_requestid: 'xxxxxxxxxxxxxxxx',
    auth_timestamp: '2017-01-01T18:00:00+00:00'
    /* eslint-enable */
  },

  requestMAC: 'D715C8DD03AB5118ECAD9F83C995FE6E',

  prodRequestURL: 'https://login.idfyed.com/main-eapi/begin?auth_companyname=playground&auth_returnlink=https%3A%2F%2Flocalhost%3A3000%2Fauthenticate%2Fsuccess&auth_cancellink=https%3A%2F%2Flocalhost%3A3000%2Fauthenticate%2Fcancel&auth_rejectlink=https%3A%2F%2Flocalhost%3A3000%2Fauthenticate%2Freject&auth_requestid=xxxxxxxxxxxxxxxx&auth_timestamp=2017-01-01T18%3A00%3A00%2B00%3A00&mac=D715C8DD03AB5118ECAD9F83C995FE6E',

  invalidRequestData: {
    /* eslint-disable */
    // auth_companyname: 'playground',
    mac_key: 'LW4eUhQkJfwJGgQU8JCT/g==',
    auth_returnlink: 'https://localhost:3000/authenticate/success',
    auth_cancellink: 'https://localhost:3000/authenticate/cancel',
    auth_rejectlink: 'https://localhost:3000/authenticate/reject',
    auth_requestid: 'xxxxxxxxxxxxxxxx'
    /* eslint-enable */
  }
};
