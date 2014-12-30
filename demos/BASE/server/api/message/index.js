//////////////////////////////////////////////
///
///     mvvm
///     https://github.com/joelcoxokc/mvvm
///     2014, JoelCox
///
'use strict';

/////////////////////////////
///     Module Dependencies
var _    = require('lodash');

////////////////////////////
///
///     @Expose Message Api
///     @Api            Message
///
var Message = module.exports = function (app) {

  this.index   = function (req, res, next) {};
  this.show    = function (req, res, next) {};
  this.create  = function (req, res, next) {};
  this.update  = function (req, res, next) {};
  this.destroy = function (req, res, next) {};

};