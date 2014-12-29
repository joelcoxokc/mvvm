;(function(){
  'use strict';

  angular
    .module('core')
    .directive('mvVm', mvVm)
    .animation('.step-one', function(){
      return {
        addClass: function(element, className){

        },
        removeClass: function(element, className){

        }
      }
    })

  /* @inject */
  function mvVm($animate) {
    return {
      templateUrl: 'app/core/directives/mvVm/mvVm.view.html',
      restrict: 'E',
      scope: true,
      transclude: true,
      replace: true,
      link: link
    };

    ////////////////

    function link(scope, element, attrs) {
      // Mv vm directive logic


      /**
       * actionOne description
       * @return {[type]} description
       */
      function actionOne (){}

      /**
       * actionTwo description
       * @return {[type]} description
       */
      function actionTwo (){}


    }
  }
}).call(this);
