;(function(){

  'use strict';

  angular
    .module('core')
    .directive('listGroup', listGroup);

    function listGroup($document){
      return {
        restrict: 'E',
        scope:{
          items: '=',
        },
        templateUrl: 'app/core/directives/list-group/list-group.view.html',
        transclude:true,
        link: link
      };

      ////////////////////////////////////
      function link (scope, element, attrs) {
          // Add the class center panel,
          // so we can natively select the element for manipulation.
/*============================================================================================================
          ### IMPORTANT

          It is better to use native manipulation
          If you cannot figure out how, lookup https://docs.angularjs.org/api/ng/function/angular.element
          You can use Jquery light.
          I recommend just going to Jquery's source code and try to find how they did it natively
*============================================================================================================*/

      }
    }

}).call(this);