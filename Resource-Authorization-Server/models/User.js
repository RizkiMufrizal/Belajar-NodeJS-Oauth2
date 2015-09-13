'use strict';

var mongoose = require('mongoose');
var mongoosePages = require('mongoose-pages');
var Schema = mongoose.Schema;

var user = new Schema({
  username: {
    type: 'String',
    required: true
  },
  password: {
    type: 'String',
    required: true
  }
}, {
  collection: 'tb_user'
});

mongoosePages.skip(user);

module.exports = mongoose.model('User', user);
