;(function(){

  'use strict';

  angular
    .module('messages')
    .controller('MessagesCOntroller', MessagesCOntroller);

  function MessagesCOntroller($scope, resolvedMessages, $storage){

    this.messages = resolvedMessages;

    $storage.sync($scope, 'person');
    console.log('test');

    // $scope.person.name = {};
    // $scope.person.name.first = 'John';
    // $scope.person.name.last = 'Doe';
    // console.log(logTest());




  }

}).call(this);