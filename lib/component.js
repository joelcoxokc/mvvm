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
 * Expose the root Component.
 */

exports = module.exports = new Component;

/**
 * Expose `Component`.
 */

exports.Component = Component;


/*
 * Public Methods
 */


/**
 * @class Component
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Component('access_token');
 *
 * @param {String} access_token Access Token
 */



function Component(token) {

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
 *     AngularJS RESTful API Service generator
 *
 *     @command  `mvvm make api`
 *
 *     @option   `--module [name]`     |  specify the module the config belongs to.
 *     @option   `--providers <list>`  |  List the providers you would like to add to this api.
 *     @option   `--functions <list>`  |  List the functions that will be provided with this api.
 *     @option   `--service [boolean]` |  Choose to use a serice over a factory.
 *     @option   `--factory [boolean]` |  Choose to use a factory over a service.
 *
 *     @if       |  if '--functions' is not provided, the generator will use a prefilled api serivce || factory.
 *     @if       |  if '--service' || `--factory` is not provided, the generator will use a factory.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make api people --module people --providers $http --service`
 *
 */
Component.prototype.api = function() {

    var _this, dest, source, apiType, isEmpty;

    _this = this;

    isEmpty = true;
    apiType = 'factory';

    if(program.service) {apiType = 'service';}
    if(program.factory) {apiType = 'factory';}

    if(_this.generating.functions) {isEmpty = false;}

    if(isEmpty) apiType = join('empty', apiType);

    source = _this.find(join('api', apiType, '**/*'));

    _this.generating.names = _this.getNames(_this.generating.name);

    _this.generate({
        src: source,
        event:emit('api'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     AngularJS Config generator
 *
 *     @command  `mvvm make config`
 *
 *     @option   `--module [name]`    |  specify the module the config belongs to.
 *     @option   `--providers <list>` |  List the providers you would like to add to this configuration.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make config person --module people --providers peopleProvider`
 *
 */
Component.prototype.config = function() {
    var _this, dest, source;

    _this = this;
    dest = _this.getDestination()
    source = _this.find('config/**/*');

    _this.generate({
        src: source,
        event:emit('config'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     AngularJS Controller generator
 *
 *     @command  `mvvm make controller`
 *
 *     @option   `--module [name]`    |  specify the module the controller belongs to.
 *     @option   `--providers <list>` |  List the providers you would like to add to this controller.
 *     @option   `--functions <list>` |  List the functions that will be provided with this controller.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make controller person --module people --functions create,like --providers peopleService`
 *
 */
Component.prototype.controller = function() {
    var _this, source, event,


    _this = this;
    source  = this.find('controller/base/**/*');

    _this.generating.names = _this.getNames(_this.generating.name);

    _this.generating.functions = _this.generating.functions || ['toggle'];

    _this.generate({
        src: source,
        event:emit('controller'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });


};

/**
 *     AngularJS Directive generator
 *
 *     @command  `mvvm make directive`
 *
 *     @option   `--module [name]`    |  specify the module the directive belongs to.
 *     @option   `--providers <list>` |  List the providers you would like to add to this directive.
 *     @option   `--functions <list>` |  List the functions that will be provided with this directive.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *     @info     |  When creating a directive place hyphens between the words, inorder to name the directories properly.
 *
 *     @usage
 *       `make directive io-item --module people --functions create,like --providers $q,SomeService`
 *
 */
Component.prototype.directive = function() {
    var _this, dest, source;

    _this = this;

    dest = _this.getDestination()

    _this.generating.names = _this.getNames(_this.generating.name);

    dest    = join(dest, _this.generating.names.camel);
    source  = this.find('directive/complex/**/*');

    // Get template URL for the directive.
    var fromClient = dest.split(_this.mvvmConfig.clientDir);
    fromClient = fromClient[fromClient.length-1].slice(1);
    _this.generating.templateUrl = join(fromClient, _this.generating.names.camel + '.template.html');

    _this.generating.functions = _this.generating.functions || ['toggle'];

    _this.generate({
        dest:dest,
        src: source,
        event:emit('directive'),
        filter: _this.generating,
        rename:_this.generating.names.camel
    });

};

/**
 *     AngularJS Service generator
 *
 *     @command  `mvvm make service`
 *
 *     @option   `--module [name]`    |  specify the module the service belongs to.
 *     @option   `--providers <list>` |  List the providers you would like to add to this service.
 *     @option   `--functions <list>` |  List the functions that will be provided with this service.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make service People --module people --functions create,show,update,delete --providers $http`
 *
 */
Component.prototype.service = function() {
    var _this, dest, source;

    _this = this;
    dest = _this.getDestination()
    source = _this.find('service/base/**/*');

    _this.generating.names = _this.getNames(_this.generating.name);

    _this.generating.functions = _this.generating.functions || ['create', 'show', 'update', 'delete'];

    _this.generate({
        src: source,
        event:emit('service'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     AngularJS Factory generator
 *
 *     @command  `mvvm make factory`
 *
 *     @option   `--module [name]`    |  specify the module the factory belongs to.
 *     @option   `--providers <list>` |  List the providers you would like to add to this factory.
 *     @option   `--functions <list>` |  List the functions that will be provided with this factory.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make factory People --module people --functions create,show,update,delete --providers $http`
 *
 */
Component.prototype.factory = function() {
    var _this, dest, source;

    _this = this;
    dest = _this.getDestination()
    source = _this.find('factory/base/**/*');

    _this.generating.names = _this.getNames(_this.generating.name);

    _this.generating.functions = _this.generating.functions || ['create', 'show', 'update', 'delete'];

    _this.generate({
        src: source,
        event:emit('factory'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     AngularJS Provider generator
 *
 *     @command  `mvvm make provider`
 *
 *     @option   `--module [name]`    |  specify the module the provider belongs to.
 *     @option   `--providers <list>` |  List the providers you would like to add to this provider.
 *     @option   `--functions <list>` |  List the functions that will be provided with this provider.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make provider People --module people --functions configure,iterate --providers someServiceProvider`
 *
 */
Component.prototype.provider = function() {
    var _this, dest, source;

    _this = this;
    dest = _this.getDestination()
    source = _this.find('provider/base/**/*');

    _this.generating.names = _this.getNames(_this.generating.name);

    _this.generating.functions = _this.generating.functions || ['configure'];

    _this.generate({
        src: source,
        event:emit('provider'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     AngularJS Filter generator
 *
 *     @command  `mvvm make filter`
 *
 *     @option   `--module [name]`    |  specify the module the filter belongs to.
 *     @option   `--providers <list>` |  List the providers you would like to add to this filter.
 *     @option   `--functions <list>` |  List the functions that will be provided with this filter.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make filter lastName --module people --functions findLastname --providers $q`
 *
 */
Component.prototype.filter = function() {
    var _this, dest, source;

    _this = this;

    dest = _this.getDestination()
    source = _this.find('filter/base/**/*');

    _this.generating.functions = _this.generating.functions || ['changeValue'];

    _this.generate({
        src: source,
        event:emit('filter'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     AngularJS Test generator
 *
 *     @command  `mvvm make test`
 *
 *     @option   `--module [name]`    |  specify the module the test belongs to.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make test container --module people
 *
 */
Component.prototype.test = function() {
    var _this, dest, source;

    _this = this;

    dest = _this.getDestination()

    source = _this.find('test/base/**/*');

    _this.generate({
        src: source,
        event:emit('test'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     AngularJS Module generator
 *
 *     @command  `mvvm make module`
 *
 *     @option   `--module [name]`  |  specify the module the view belongs to.
 *     @option   `--filled`         |  fill the module with components in each folder
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make module people
 *
 */
Component.prototype.module = function(generating) {
    var _this, dest, source, sourcePaths, filters;

    _this = this;

    dest = _this.getDestination();

    sourcePaths = program.filled ? 'module/filled' : 'module/base';

    source = [_this.find(sourcePaths + '/**/*'),_this.find(sourcePaths + '/**')];

    filters = {
        moduleName:generating.name
    };

    _this.generate({
        src: source,
        event:emit('module'),
        filter: filters,
        dest:_this.getDestination(),
        rename: _this.generating.name
    });

};

/**
 *     Styles generator
 *
 *     @command  `mvvm make styles`
 *
 *     @option   `--module [name]`    |  specify the module the styles belongs to.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make styles container --module people
 *
 */
Component.prototype.styles = function() {
    var _this = this;
    var dest   = join(_this.mvvmConfig.modulesDir, _this.generating.module, 'styles')
    var source = _this.find('style/base/**/*');

    _this.generate({
        src: source,
        event:emit('style'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};

/**
 *     View generator
 *
 *     @command  `mvvm make view`
 *
 *     @option   `--module [name]`    |  specify the module the view belongs to.
 *
 *     @info     |  if no option is specified, you will be prompted for the answers.
 *
 *     @usage
 *       `make view container --module people
 *
 */
Component.prototype.view = function() {
    var _this = this;
    var dest   = join(_this.mvvmConfig.modulesDir, _this.generating.module, 'views')
    var source = _this.find('view/base/**/*');

    _this.generate({
        src: source,
        event:emit('view'),
        filter: _this.generating,
        dest:_this.getDestination(),
        rename:_this.generating.name
    });
};


Component.prototype.start = function( name, callback ) {
    gulp.task(name, callback).start();
}


Component.prototype.prompt = function prompt(prompts, cb) {
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