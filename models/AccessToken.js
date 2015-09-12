'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accessToken = new Schema({
  token: {
    type: 'String',
    required: true
  },
  tokenExpired: {
    type: 'String',
    required: true
  },
  userId: {
    type: 'String',
    required: true
  },
  clientId: {
    type: 'String'
  }
}, {
  collection: 'tb_accessToken'
});

module.exports = mongoose.model('AccessToken', accessToken);
