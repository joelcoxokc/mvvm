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
    // join = require('path').join,
    banner = require('./utility/banner.js'),
    pkg = require('../package.json'),
    path = require('path'),
    del    = require('del'),
    mkdirp = require('mkdirp'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({lazy:false}),
    _ = require('lodash'),
    _s = require('underscore.string'),
    fs  = require('fs'),
    _f  = require('fs-utils'),
    Storage = require('./modules/storage.js'),
    packages = require('./utility/packages'),
    finder   = require('./utility/finder'),
    promise  = require('q');

var generatorTypes = {api:'api', config:'config',controller:'controller',service:'service',factory:'factory',directive:'directive', test:'test',view:'view'};

var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var controllers = {
    core: require('./modules/core')
}

/**
 * Expose the root Application.
 */

exports = module.exports = new Application;

/**
 * Expose `Application`.
 */

exports.Application = Application;


/*
 * Public Methods
 */


/**
 * @class Application
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Application('access_token');
 *
 * @param {String} access_token Access Token
 */



function Application(token) {

    var _this = this;

    _this.folders = ['api', 'config', 'controllers', 'directives', 'services', 'filters', 'factories', 'views', 'tests', 'styles'];

    _this.find = function(val){
        return __dirname + '/templates/' + val
    }


    _this.generate = function(options){
        this.start(options.event, function(){
            return gulp.src(options.src)
                .pipe($.template(options.filter) )
                .pipe($.rename(replace(options.rename)))
                .pipe($.conflict(options.dest))
                .pipe(gulp.dest(options.dest));
        });
    }

};


/**
 *     AngularJS Application generator
 *
 *     @command  `mvvm application [name]`
 *
 *     @usage
 *       `core --module people --providers $http --service`
 *
 */

Application.prototype.application = function( answers ) {
    var _this, dest, source, sourcePath, type;
    _this = this;

    dest = process.cwd();
    var appLevel;
    // type = program.args[0] || 'core';

    if (program.beginner) {appLevel = 'beginner';}
    if (program.advanced) {appLevel = 'advanced';}
    if (program.expert)   {appLevel = 'expert';}

    if (answers.appLevel) {appLevel = answers.appLevel;}

    sourcePath = join(__dirname, 'templates', 'application', appLevel);

    source = [join(sourcePath, '**/*'), join(sourcePath, '**/.*')]

    _this.start(emit('application'), function(){
        return gulp.src(source)
            .pipe($.conflict(dest))
            .pipe(gulp.dest(dest))
            .pipe($.install())
            .on('end', function(){
                // _this.log('RUN npm install && bower install'.bold.red);
                _this.log('All Done'.bold.blue);
            });

    });

}



/**
 *     AngularJS Core Application generator
 *
 *     @command  `mvvm core`
 *
 *     @usage
 *       `core --module people --providers $http --service`
 *
 */

Application.prototype.core = function(){
    var _this, dest, source, sourcePath, type;
    _this = this;

    dest = process.cwd();

    // type = program.args[0] || 'core';

    sourcePath = join(__dirname, 'templates', 'application', 'core');

    source = [join(sourcePath, '**/*'), join(sourcePath, '**/.*')]

    _this.start(emit('application'), function(){
        return gulp.src(source)
            .pipe($.conflict(dest))
            .pipe(gulp.dest(dest))
            .on('end', function(){
                _this.log('RUN npm install && bower install'.bold.red);
            });
    });

}


Application.prototype.start = function( name, callback ) {
    gulp.task(name, callback).start();
}


Application.prototype.prompt = function prompt(prompts, cb) {
    inquirer.prompt(prompts, function(answers) {
        cb(answers);
    });
};


/*
 * Private Methods
 */

function rename(file) {

    if (file.basename.slice(0,3) === '$__') {
      file.basename = '.' + file.basename.slice(3);
    }
}

function replace(name) {
    return function (file){
        if (file.basename.slice(0,1) === '_') {
          file.basename = name + file.basename.slice(1);
        }
    }
}

function emit(name){
    return ['generating',name].join(':');
}

function join(){
    return Array.prototype.slice.call(arguments).join('/')
}