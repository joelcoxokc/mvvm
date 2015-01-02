;(function() {

    'use strict';

    angular
        .module('<%= moduleName %>')
        .factory('<%= moduleName %>Factory', <%= moduleName %>Factory);

    /* @ngInject */
    function <%= moduleName %>Factory() {

    }

}).call(this);