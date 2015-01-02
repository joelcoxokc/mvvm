;(function() {

    'use strict';

    angular
        .module('<%= module %>')
        .controller('<%= names.classed %>Controller', <%= names.classed %>Controller);

    /* @ngInject */
    function <%= names.classed %>Controller(<%=providers%>) {

        // <%= names.humanized %> controller logic
        var vm = this;

        ///////////////////////////////
        <% _.forEach( functions, function (func) { %>
        vm.<%=func%> = <%=func%>;<% }) %>
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

}).call(this);
