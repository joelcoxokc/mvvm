//////////////////////////////////////////////
///
///     mvvm
///     https://github.com/joelcoxokc/mvvm
///     2014, JoelCox
///
'use strict';

/////////////////////////////
///     Module Dependencies
var _       = require('lodash'),
    api     = require('./api'),
    config  = require('./config'),
    modules = require('./modules'),
    pretty  = require('prettyjson');
require('colors');
//////////////////////////////
///
///     @NODE_ENV        development
///     @process.env     set node environment
///
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


///////////////////////////////
///     @Expose     Main Access point to node server
///     @export     app
///     @dir        ./server
///
var app     = {};
///
///   initialize config
///
config.call(app);
///
///   initialize modules
///
modules.call(app);
///
///   initialize Api Endpoints
///
api.call(app);
///////////////
///
console.log(app);


