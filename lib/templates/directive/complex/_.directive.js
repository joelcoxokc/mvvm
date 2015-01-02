;(function() {

    'use strict';

    angular
        .module('<%= module %>')
        .directive('<%= names.camel %>', <%= names.camel %>);

    /* @inject */
    function <%= names.camel %>(<%=providers%>) {
        return {
            templateUrl: '<%= templateUrl %>',
            restrict: 'E',
            scope: true,
            transclude: true,
            link: link
        };

        ////////////////

        function link(scope, element, attrs) {

            ///////////////////////////////
            <% _.forEach(functions, function (func) { %>
            /**
             *      <%= func %>
             *      @description
             *      @param  {Object}        description
             *      @return {Object}        description
             */
            function <%= func %> (param) {}
            <% }) %>
        }
    }

}).call(this);
