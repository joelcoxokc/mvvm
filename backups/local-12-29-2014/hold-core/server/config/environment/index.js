'use strict';

var join  = require('path').join;

exports.getEnvironment = function(){


  return require( './'+process.env.NODE_ENV +'.js' )

};