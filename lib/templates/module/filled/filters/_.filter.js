;(function() {

    'use strict';

    angular
        .module('<%= moduleName %>')
        .filter('<%= moduleName %>Filter', <%= moduleName %>Filter);

    /* @ngInject */
    function <%= moduleName %>Filter() {}

}).call(this);