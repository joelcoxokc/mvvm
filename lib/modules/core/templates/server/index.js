'use strict';


var api     = require('./api'),
    config  = require('./config'),
    modules = require('./modules');


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = {};

    config.call(app);

    modules.call(app);

    api.call(app);


    console.log(app);