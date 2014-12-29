//////////////////////////////////////////////
///
///     mvvm
///     https://github.com/joelcoxokc/mvvm
///     2014, JoelCox
///
'use strict';

/////////////////////////////
///     Module Dependencies
var User     = require('./user'),
    Message  = require('./message');

//////////////////////////
///
///     @Expose Api Endpoints
///     @Module            Api
///
module.exports = function(){

    this.api = {};
    this.api.messages = new Message
    this.api.users = new User


};
