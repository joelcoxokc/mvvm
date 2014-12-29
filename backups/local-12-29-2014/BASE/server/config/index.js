//////////////////////////////////////////////
///
///     mvvm
///     https://github.com/joelcoxokc/mvvm
///     2014, JoelCox
///
'use strict';

/////////////////////////////
///     Module Dependencies
var environment = require('./environment'),
    _           = require('lodash');

/////////////////////////////////
///     @Expose     conig module
///     @dir        ./config
///
module.exports      = function () {

  var _this = this;

      this.config           = {};

      this.config.env       = environment.getEnvironment();

      this.config.set       = function (key, val) {};

      this.config.get       = function (key) {};

      this.config.remove    = function (key) {};

      this.config.reset     = function (bool) {};

};
