'use strict';

var program = require('commander'),
    request = require('superagent'),
    inquirer = require('inquirer'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    debug = require('./utility/debugger.js'),
    _ = require('lodash'),
    pj = require('prettyjson').render,
    join = require('path').join,
    banner = require('./utility/banner.js'),
    pkg = require('../package.json'),
    gulp = require('gulp'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    del    = require('del'),
    $ = require('gulp-load-plugins')({lazy:false}),
    fs  = require('fs'),
    _f  = require('fs-utils'),
    Storage = require('./modules/storage.js'),
    packages = require('./utility/packages'),
    finder   = require('./utility/finder');


/**
 * Expose the root Store.
 */

exports = module.exports = new Store;

/**
 * Expose `Store`.
 */

exports.Store = Store;
/**
 * @class Store
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Store('access_token');
 *
 * @param {String} access_token Access Token
 */
function Store(token) {

    var _this = this;

    this.local    = new finder(__dirname, '../local');


    this.config  = new Storage('store', path.join(__dirname, '../store.json'));
    this.config.set('localDir', join(__dirname, '../local'))
    this.pkg = new Storage('mvvm', join(process.cwd(), 'mvvm.json' ) )

    // this.config

    this.Prompts = {
      overwrite:[{
        type:'confirm',
        name:'overwrite',
        message: 'Already Exists. Overwrite?',
        default:false
      },{
        type:'confirm',
        name:'validate',
        message: 'Are you sure?',
        default:false,
        when:function(answers){
          console.log(answers);
          return answers.overwrite;
        }
      }]
    }

    /*
     * Public Methods
     */

    this.generateId = function(bool) {
          var newId = parseFloat(_this.config.get('idCount')) + 1;

          bool && (_this.config.set('idCount', newId));
          return newId;
    };

    // Check if this is a mvvm app
    this.isApp = function (cb) {
          var pkgName = this.pkg.get('name');
          if(this.config.get('projects')[pkgName]) return true;

          return false;
    };
    // Check app's existence in '../local'
    this.appExists = function (cb) {

          return fs.existsSync(this.pkg.get('local_path'));
    };
    this.validate  = function(input){

      if(this.isApp() && this.appExists()) return true;
      return false;
    };
    this.updateApp = function(){
      this.pkg.set('updated', Date.now());
    };


    program.on('save', function(){
        _this.cwd    = new finder(process.cwd());
    })

};

Store.prototype.__proto__ = EventEmitter.prototype;


//HandlerExceptions
process.on('uncaughtException', function(err) {
    console.log();
    console.error(err.stack);
    console.error(err);
});

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.core(options, cb);
 *
 * @method core
 * @public
 * @param {Object} npm   Boolean
 * @param {Object} bower Boolean
 * @param {Function} cb A callback
 */

Store.prototype.save = function () {
    var _this = this;

    if(this.validate()){
      this.prompt(this.Prompts.overwrite, function (answers) {
        answers.overwrite ?
          ( _this.updateApp, _this.saveApp, _this.storeApp, success() ) :
          ( fail() )
      })
    } else {

      fail();
      this.pkg.set('id', this.generateId(true));
      this.pkg.set('created', Date.now());
      this.saveApp();
      this.storeApp();
    }


    function success(){
      debug('Saving!','success')
      return true;
    }
    function fail(){
      debug('Failed to Save Your Application', 'error')
      debug('Name already exists!!', 'error');
      return false;
    }
}
/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.prompt(prompts, cb);
 *
 * @method start
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} cb A callback
 */

Store.prototype.start = function( name, callback ){

    gulp.task(name, callback).start();
}
Store.prototype.saveApp = function () {
    var _this = this;
    this.pkg.set('local_path', join(__dirname, '../local', this.pkg.get('name')));
    this.pkg.set('updated', Date.now())


    // _this.config._store.projects[this.pkg.get('name')] = this.pkg.all();
    this.config.get('projects')[this.pkg.get('name')] = this.pkg.all();
    _this.config.save();

    // console.log(this.config._store)


};

Store.prototype.storeApp = function () {
  var _this = this;
  _this.start('save', function(){
    gulp.src(_this.cwd.use(['**/*', '**/.*', './.*']) )
        .pipe( $.rename( reverseDot ) )
         .pipe( gulp.dest( _this.pkg.get('local_path') ) )
        .on('end', function(){
          debug('Sucessfully Saved', 'success')
        })
  })
};

Store.prototype.saveer = function (options) {
}

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.prompt(prompts, cb);
 *
 * @method prompt
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} cb A callback
 */

Store.prototype.prompt = function prompt(prompts, cb) {
    inquirer.prompt(prompts, function(answers) {
        cb(answers);
    });
};


/*
 * Private Methods
 */



function rename(file){

    if (file.basename.slice(0,3) === '$__') {
      file.basename = '.' + file.basename.slice(3);
    }
}
function reverseDot(file){

    if (file.basename.slice(0) === '.') {
      file.basename = '$__' + file.basename.slice(1);
    }
}

function response(err, res, pureJson, message, type) {
}