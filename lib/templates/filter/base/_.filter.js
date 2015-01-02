;(function() {
    'use strict';

    angular
        .module('<%= module %>')
        .filter('<%= name %>', <%= name %>);
    /* @ngInject */
    function <%= name %>(<%=providers%>) {

        var out;

        return function (input) {

            return out;
        };

        ////////////////////
        <% _.forEach( functions, function (func) { %>
        /**
         *      <%= func %>
         *      @description
         *      @param  {Object}        description
         *      @return {Object}        description
         */
        function <%=func%> (param) {}<% }) %>

    }

}).call(this);