'use strict';

var User     = require('./user');
var Message  = require('./message');

module.exports = function(){
    this.api          = {};
    this.api.user     = User;
    this.api.messages = Message;


};
