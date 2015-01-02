;(function() {

    'use strict';

    angular
        .module('<%= module %>')
        .factory('<%= names.classed %>', <%= names.classed %>);

    /* @inject */
    function <%= names.classed %>(<%=providers%>) {

        var instance = {<% _.forEach( functions, function (func, index) { %>
            <%=func%>:<%=func%><% if (index < functions.length-1){%>,<%}%><% }) %>
        };

        return instance;

        ////////////////////////////////
        <% _.forEach( functions, function(func) { %>
        /**
         *      <%= func %>
         *      @description
         *      @param  {Object}        description
         *      @return {Object}        description
         */
         function <%=func%> (param) {}
        <% }) %>
    }

}).call(this);