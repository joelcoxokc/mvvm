;(function() {

    'use strict';

    angular
        .module('<%= moduleName %>')
        .directive('<%= moduleName %>', <%= moduleName %>);

    /* @ngInject */
    function <%= moduleName %>() {

        var directive = {
            restrict: 'EA',
            scope:true,
            template:'<div data-ng-transclude></div>',
            transclude:true,
            controller: '<%= moduleName %>Controller as vm',
            link:link
        };

        return directive;

        function link(scope, element, attrs, ctrl, transclude) {}

    }

}).call(this);