;(function(tw){

  'use strict';

  angular
    .module('core')
    .controller('AppController',AppController)

  function AppController($scope, $storage){

    this.components = [
    {title:'Module',text:'Some text goes here'},
    {title:'Config',text:'Some text goes here'},
    {title:'Controller',text:'Some text goes here'},
    {title:'Directive',text:'Some text goes here'},
    {title:'Service',text:'Some text goes here'},
    {title:'Factory',text:'Some text goes here'},
    {title:'Constant',text:'Some text goes here'},
    {title:'Provider',text:'Some text goes here'},
    {title:'Filter',text:'Some text goes here'}]

  }

}).call(this, TweenMax);
