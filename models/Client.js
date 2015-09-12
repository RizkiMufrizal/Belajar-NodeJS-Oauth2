'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var client = new Schema({
  name: {
    type: 'String',
    required: true
  },
  clientId: {
    type: 'String',
    required: true
  },
  clientSecret: {
    type: 'String',
    required: true
  }
}, {
  collection: 'tb_client'
});

module.exports = mongoose.model('Client', client);
