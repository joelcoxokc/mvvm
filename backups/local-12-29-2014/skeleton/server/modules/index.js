'use strict';

var auth    = require('./auth'),
    utils   = require('./utils');


module.exports = function(){


  this.utils     = utils
  this.auth      = auth;
};