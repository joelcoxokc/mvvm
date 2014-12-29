'use strict';


var environment = require('./environment');


module.exports = function(){

  var _this = this;

      this.config           = {};

      this.config.env       = environment.getEnvironment();

      this.config.set       = function (key, val) {};

      this.config.get       = function (key) {};

      this.config.remove    = function (key) {};

      this.config.reset     = function (bool) {};

};