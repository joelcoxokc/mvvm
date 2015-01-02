;(function() {

    'use strict';

    angular
        .module('<%= moduleName %>')
        .controller('<%= moduleName %>Controller', <%= moduleName %>Controller);

    /* @ngInject */
    function <%= moduleName %>Controller() {

    }

}).call(this);