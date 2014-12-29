;(function(){

  'use strict';

  angular
    .module('core')
    .directive('centerPanel', centerPanel);

    function centerPanel($document){
      return {
        restrict: 'E',
        scope:{
          title: '@',
          scroll: '@',
          hasBody: '@'
        },
        templateUrl: 'app/core/directives/center-panel/center-panel.view.html',
        transclude:true,
        // replace:true,
        link: link
      };

      ////////////////////////////////////
      function link (scope, element, attrs) {
          // Add the class center panel,
          // so we can natively select the element for manipulation.
          element.addClass('center-panel')
          var el = document.querySelector( '.center-panel' );

          console.log(scope.hasBody)

          scope.ngClasses = {
            'panel-body-scroll':scope.scroll,
            'has-body':scope.hasBody
          };
/*============================================================================================================
          ### IMPORTANT

          It is better to use native manipulation
          If you cannot figure out how, lookup https://docs.angularjs.org/api/ng/function/angular.element
          You can use Jquery light.
          I recommend just going to Jquery's source code and try to find how they did it natively

          ### NOTE ###
          Checkout the element in Chrome
          You will notice the div with class="col-md-6" is wrapped in our directive

          <center-panel class="center-panel">

            <div class="">

          Also note that the class we added ".center-panel" was added to the
          actual directive

            <center-panel class="center-panel">

          If we want to change this behavior, then

          uncomment line 17
          or add replace:true
          to the directive, then look at the difference in chrome.
==============================================================================================================*/


      }
    }

}).call(this);