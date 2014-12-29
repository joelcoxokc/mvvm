'use strict';



var path = require('path'),
    fs = require('fs'),
    _f = require('fs-utils');


var files = {
  npm:   path.resolve(process.cwd(), 'package.json'),
  bower: path.resolve(process.cwd(), 'bower.json')
}


/**
 * npm      get the package.json from process.cwd()
 * @return {Object} returns the package.json from the current working directory
 */
exports.npm = function(){

    return {
      path: function(){
        return exists('npm');
      },
      pkg: function(){
        return  getPackage('npm');
      },
      update: function(options){
        return updatePkg('npm', options);
      }
    };
};


/**
 * bower      get the bower.json from process.cwd()
 * @return {Object} returns the bower.json from the current working directory
 */
exports.bower = function(){

    return {
      path: function(){
        return exists('bower');
      },
      pkg: function(){
        getPackage('bower');
      }
    };
};

/**
 * npmFile  get the package.json from process.cwd()
 * @return {Object} returns the package.json from the current working directory
 */
function exists(pkg){
    var file = path.resolve(process.cwd(), files[pkg]);
    return fs.existsSync( file ) && file;
};


/**
 * npm      get the package file from process.cwd()
 * @return {Object} returns the package file from the current working directory
 */
function getPackage(pkg){
    var file   = exists(pkg),
        data   = file ? _f.readJSONSync(file) : {name:'', repository:{}};

    return data;
};

function updatePkg(pkg, options){
  var file = getPackage(pkg);
  file.name = options.name,
  file.description = options.description,
  file.autor = options.autor + ' <'+options.email+'>'

  file.repository || (file.repository = {url:''});
  file.licenses   || (file.licenses   = {url:''});
  file.bugs       || (file.bugs       = {url:''});

  file.repository.url = options.repo + '.git';
  file.bugs.url       = options.repo + '/issues';
  file.licenses.url   = options.repo + '/blob/master/LICENSE';
  file.homepage       = options.repo;

  _f.writeJSONSync(file, files[pkg])


}
