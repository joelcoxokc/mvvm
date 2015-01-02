/*
 * mvvm
 * https://github.com/joelcoxokc/mvvm
 *
 * Copyright (c) 2014, JoelCox
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Module Dependencies
 */

var program = require('commander'),
    request = require('superagent'),
    inquirer = require('inquirer'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    debug = require('./utility/debugger.js'),
    pj = require('prettyjson').render,
    join = require('path').join,
    banner = require('./utility/banner.js'),
    pkg = require('../package.json'),
    path = require('path'),
    del    = require('del'),
    mkdirp = require('mkdirp'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({lazy:false}),
    _ = require('underscore'),
    fs  = require('fs'),
    _f  = require('fs-utils'),
    Storage = require('./modules/storage.js'),
    packages = require('./utility/packages'),
    finder   = require('./utility/finder');

var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var controllers = {
    core: require('./modules/core')
}

/**
 * Expose the root Api.
 */

exports = module.exports = new Api;

/**
 * Expose `Api`.
 */

exports.Api = Api;


/*
 * Public Methods
 */


/**
 * @class Api
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Api('access_token');
 *
 * @param {String} access_token Access Token
 */



function Api(token) {

    var _this = this;

    this._config   = new Storage('mvvm', 'mvvm.json');

    this.folders = ['api', 'config', 'controllers', 'directives', 'services', 'filters', 'factories', 'views', 'tests', 'styles'];

    this.demoDir = path.join(__dirname, '../demos');


    this.stackExists = function(name){
        return this.isDir(this.localDir, name)
    }
    this.demoExists = function(name){
        return this.isDir(this.demoDir, name)
    }
    this.isDir = function(root, name){
        return _f.isDir( join( root, name ) )
    }

    program.on('start', function(){
        _this.localDir = path.join(homeDir, '/.mvvm-store')
        _this.local = new finder(__dirname, './modules/core/templates');
        _this.stacks = new finder(path.join(homeDir, '/.mvvm-store/'));
        _this.demos = new finder( _this.demoDir )
        _this.cwd = new finder(process.cwd());

        _this.config = _this._config.all();
    });

};

Api.prototype.__proto__ = EventEmitter.prototype;

Api.prototype.controllers = {};

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
 *     api.prompt(prompts, cb);
 *
 * @method start
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} cb A callback
 */

Api.prototype.start = function( name, callback ){
    gulp.task(name, callback).start();
}

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

_.extend(Api.prototype, require('./modules/core'));

Api.prototype.core = function( options ){
    var _this  = this;


    this[options.application]($, _, gulp, mkdirp, rename)
}

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.local(stack);
 *
 * @method core
 * @public
 * @param {String}   stack          local stack to install from in ../local
 */

Api.prototype.stack = function (stack) {
    var _this  = this;

    if(!this.stackExists(stack)){
        console.log()
        console.log()
        console.log('The requested package does not exist in '.red+ ' ~/.mvvm-store/'.blue)
        console.log()
        console.log()
        return;
    }

    this.start('local', function(){
        gulp.src(_this.stacks.use(stack+'/**/*', stack+'/**/.*'))
            .pipe( $.rename( rename ))
            .pipe( gulp.dest( _this.cwd.root() ) )
    })
}

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.local(stack);
 *
 * @method core
 * @public
 * @param {String}   stack          local stack to install from in ../local
 */

Api.prototype.demo = function (name) {
    var _this  = this;

    if(!this.demoExists(name)){
        console.log()
        console.log()
        console.log('The requested package does not exist in '.red+ ' ~/.mvvm-store/'.blue)
        console.log()
        console.log()
        return;
    }

    this.start('local', function(){
        gulp.src(_this.demos.use(name+'/**/*', name+'/**/.*'))
            .pipe( $.rename( rename ))
            .pipe( gulp.dest( _this.cwd.root() ) )
    })
}

/**
 * Method responsible for removing saved packages
 *
 * @example
 *
 *     api.remove(stack);
 *
 * @method core
 * @public
 * @param {String}   stack          local stack to install from in ../local
 */

Api.prototype.remove = function (name) {
    var _this  = this;

    console.log(name);

    if(!this.stackExists(name)){
        console.log()
        console.log()
        console.log('The requested package does not exist in '.red+ ' ~/.mvvm-store/'.blue)
        console.log()
        console.log()
        return;
    }

    this.prompt([{
        type:'confirm',
        name:'confirm',
        message: 'Are You Sure?'.bold.red+' Delete ' + name.blue+'?????'.bold.red,
        default:false
    }], function (answers){
        if(answers.confirm){
            console.log(path.join(homeDir,'/.mvvm-store', name));
            _f.rmdir(path.join(homeDir,'/.mvvm-store', name), function(err, result){
                console.log('err',err);
                console.log('result',result);
            })

        } else {
            console.log('Exiting');
            console.log('*** Nothing was removed ***'.red);
            process.exit()
        }
    })
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

Api.prototype.prompt = function prompt(prompts, cb) {
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

function response(err, res, pureJson, message, type) {
}