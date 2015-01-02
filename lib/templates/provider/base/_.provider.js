;(function() {

    'use strict';

    angular
        .module('<%= module %>')
        .provider('<%= names.camel %>Provider', <%= names.camel %>Provider)
        .config(<%= name %>Config);

    /**
     *      <%= names.camel %>Provider
     *      @description [description]
     *      @return {[type]}
     *      @ngInject
     */
    function <%= names.camel %>Provider() {
        /* jshint validthis:true */
        var _this = this;
        <% _.forEach( functions, function(func) { %>
        /**
         *      <%= func %>
         *      @description
         *      @param  {Object}        description
         *      @return {Object}        description
         */
         _this.<%=func%> = function (param) {};<% }) %>

        _this.$get = function() {
            return {config: _this.config};
        };
    }

    /**
     *      <%= name %>Config
     *      @description [description]
     *      @param  {[type]} $provide
     *      @return {[type]}
     *      @ngInject
     */
    function <%= name %>Config(<%= names.camel %>Provider) {
        <% _.forEach( functions, function(func) { %>
         <%= names.camel %>Provider.<%=func%>()<% }) %>
    }

}).call(this);
