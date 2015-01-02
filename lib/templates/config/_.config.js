;(function() {

    'use strict';

    // <%= module %> module config
    angular
        .module('<%= module %>')
        .config( <%= name %>Config );

    /* @ngInject */
    function <%= name %>Config(<%=providers%>) {
        // <%= name %>Config logic
        // ...
    }

}).call(this);