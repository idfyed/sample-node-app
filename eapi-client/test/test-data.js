/**
 * Copyright 2017 (C) Diglias AB
 *
 * @author jonas
 *
 */
'use strict';

module.exports = {
  key: 'LW4eUhQkJfwJGgQU8JCT/g==',

  responseData: {
    /* eslint-disable */
    auth_authnmethod: 'diglias',
    auth_inresponseto: 'xxxxxxxxxxxxxxxx',
    mac: '01470A49FD2547D8F432F863F6A55CDB',
    auth_a_mobile: '+46708195377',
    auth_a_personalIdentificationNumber: '19750101-5050',
    auth_userid: 'f731a1e6-ebcc-4ac6-aa5a-f81899885c7e',
    auth_a_email: 'jonas@diglias.com,user2@domain.com'
    /* eslint-enable */
  },

  responseMAC: '01470A49FD2547D8F432F863F6A55CDB',

  requestData: {
    /* eslint-disable */
    auth_companyname: 'playground',
    mac_key: 'LW4eUhQkJfwJGgQU8JCT/g==',
    auth_returnlink: 'https://localhost:3000/authenticate/success',
    auth_cancellink: 'https://localhost:3000/authenticate/cancel',
    auth_rejectlink: 'https://localhost:3000/authenticate/reject',
    auth_requestid: 'xxxxxxxxxxxxxxxx'
    /* eslint-enable */
  },

  requestMAC: '2AE3ACA4F918DD2ED0A562CA74031B5C',

  prodRequestURL: 'https://login.diglias.com/main-eapi/begin?auth_companyname=playground&mac_key=LW4eUhQkJfwJGgQU8JCT/g==&auth_returnlink=https://localhost:3000/authenticate/success&auth_cancellink=https://localhost:3000/authenticate/cancel&auth_rejectlink=https://localhost:3000/authenticate/reject&auth_requestid=xxxxxxxxxxxxxxxx&mac=2AE3ACA4F918DD2ED0A562CA74031B5C',

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
