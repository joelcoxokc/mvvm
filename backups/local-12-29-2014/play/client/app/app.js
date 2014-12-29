;(function(){
  'use strict';

  angular
    .module('app', [
      'ngAnimate',
      'ui.router',
      'core',
      'app.modules'
    ]);


  // window.Application = new ModuleGenerator();

  // function ModuleGenerator(){

  //   window.AppModule = angular.module('application', window.modules);
  //   return {
  //     register:register
  //   };

  //   function register(module){
  //     angular.module(module, []);
  //     window.modules.push(module);
  //   }
  // }

}).call(this);