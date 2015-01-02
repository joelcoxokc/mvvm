;(function() {

    'use strict';

    angular
        .module('<%= moduleName %>')
        .service('<%= moduleName %>Service', <%= moduleName %>Service)
        .factory('<%= moduleName %>Factory', <%= moduleName %>Factory);

    /* @ngInject */
    function <%= moduleName %>Service() {}

    /* @ngInject */
    function <%= moduleName %>Factory() {}

}).call(this);