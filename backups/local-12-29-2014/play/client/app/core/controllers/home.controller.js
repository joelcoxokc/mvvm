;(function(tw){

  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController)
    .controller('myCtrl',myCtrl)
    .controller('MainController', function($scope, $storage){})
    .controller('ChildController', function($scope, $storage){})
    .directive('slideMe', slideMe)
    .animation('.slide', function(){
      return {
        addClass: function(element, className){
          tw.to(element, 1, {transform:'rotate(90deg)'});
        },
        removeClass: function(element, className){
          tw.to(element, 1, {transform:'rotate(0)'});

        }
      }
    })

  function HomeController($scope, $storage){

    this.things = ['one','tow'];
    $scope.people = ['joel','abby']


    $storage.sync($scope, 'person');

    $scope.person.name = {};
    $scope.person.name.first = 'John';
    $scope.person.name.last = 'Doe';
    // console.log(logTest());


    function logTest(){
      console.log('$scope', $scope.person);
      console.log('$local =====', $local.get('person'));
      console.log('storage =====', localStorage.getItem('person'));
    }

    this.stuff = $storage.get('stuff')

    // console.log('before save============',this.stuff);

    this.stuff.save()

    // console.log('after save==============',localStorage.getItem('stuff'));

    this.stuff.name = 'Abby'
    this.stuff.age = '23'
    this.stuff.height = '100px'

    this.stuff.save()

    // console.log('after save==============',localStorage.getItem('stuff'));

  }
  function myCtrl($scope, $storage){

    this.isHidden = false;
    this.fadeIt = function(){
      console.log('yolo');
      this.isHidden = !this.isHidden
    }

  }

  function slideMe($animate){
    return function (scope, element, attrs){
      // var endX = 300;
      // var box = $(".myBlock")[0];
      // var tween = tw.to(box, 0.2, {x:endX, ease:Linear.easeNone}).reverse();

      // tween.reversed(!tween.reversed());

      scope.$watch(attrs.slideMe, function (newVal){
        if(newVal){
          $animate.addClass(element, "slide");
        } else {
          $animate.removeClass(element, "slide")
        }
      })
    }

  }

}).call(this, TweenMax);


// jQuery(document).on('ready', function($, tw){
  // var endX = 300;
  //     var box = $(".myBlock")[0];
  //     var tween = tw.to(box, 0.2, {x:endX, ease:Linear.easeNone}).reverse();

  //     $('.myBtn').on('click', function(){
  //       if(!tween.isActive()){
  //         tween.reversed(!tween.reversed());
  //       }

  //     })
// }(jQuery, TweenMax))
