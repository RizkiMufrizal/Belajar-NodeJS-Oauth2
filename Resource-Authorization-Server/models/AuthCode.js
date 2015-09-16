'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authCode = new Schema({
  code: {
    type: 'String',
    required: true
  },
  userId: {
    type: 'String',
    required: true
  },
  clientId: {
    type: 'String',
    required: true
  }
}, {
  collection: 'tb_authCode'
});

module.exports = mongoose.model('AuthCode', authCode);
