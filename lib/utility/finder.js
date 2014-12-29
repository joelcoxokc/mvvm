'use strict';

var path = require('path');
var debug = require('./debugger');
var _ = require('lodash')


/**
 * Public API
 *
 * Passes it's Arguments to join, who then joins the arguments,
 *             and returns a function that is ready to concat and join the next set of arguments.
 *
 * @usage exports( process.cwd(), 'server/api' );
 */
module.exports = function(){

    var p = join(arguments)

    this.root =  function(){
        return p( soa(arguments) ) }

    this.all =  function(){

        return p( soa(arguments), '/**/*') },

    this.dirs = function(){
        return p( soa(arguments), '/**')  },

    this.find = function(){
        return p( soa(arguments) ) }

    this.use = function(){

        return p( soa(arguments) ) }

    this.glob = function(){
      return p( soa(arguments, '/**') )
    }
};


function soa(args){
  if(args.length > 1){
    return Array.prototype.slice.call(args);
  } else if(args.length) {
    return args[0];
  } else {
    return '';
  }
}



function join(args){
        args = joinArgs(args);
        args = path.join.apply(null, args)
    return globber(args)
}
function joinArgs(argsArray){
    return Array.prototype.slice.call(argsArray);
}

function globber ( root ){

  return function ( glob, last ){
    last = last || ''

    // console.log(glob);
    // return

    if ( Array.isArray( glob ) ){

      // return
       var globs = _.map( glob, function (value, key) {
        return path.join( root, value );
      });
       // console.log(globs);
       return globs;

    }
    // Else
    return path.join( root, glob );
  }

}