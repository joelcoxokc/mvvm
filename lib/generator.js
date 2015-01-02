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
    _s = require('underscore.string'),
    Storage = require('./modules/storage.js'),
    packages = require('./utility/packages'),
    finder   = require('./utility/finder'),
    promise  = require('q');

var questions = {
    type: {
        type:'list',
        name:'type',
        message:'What do you want to Generate?',
        validate:function(answer) {
            return !!answer
        },
        choices:[
        {name:'api', value:'api'},
        {name:'config', value:'config'},
        {name:'controller', value:'controller'},
        {name:'service', value:'service'},
        {name:'factory', value:'factory'},
        {name:'directive', value:'directive'},
        {name:'test', value:'test'},
        {name:'view', value:'view'}]
    },
    name:{
        type:'input',
        name:'name',
        message:'Name?',
        validate:function(answer) {
            return !!answer
        }
    },
    module: {
        type:'list',
        name:'module',
        message:'Angular Module',
        choices:[
            {name:'core', value:'core'}
        ]
    },
    functions:{
        type:'input',
        name:'functions',
        message:'Create functions?',
        filter:function(answers){
            if(answers) { return answers.split(','); }
            return null
        }
    },
    providers:{
        type:'input',
        name:'providers',
        message:'Add providers?',
        filter:function(answers){
            if(answers) { return answers.split(','); }
            return null
        }
    }
}
var generatorTypes = {module:'module', api:'api', config:'config', controller:'controller', service:'service', filter:'filter', provider:'provider', factory:'factory', directive:'directive', test:'test', view:'view', styles:'styles'};

var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var controllers = {
    core: require('./modules/core')
}
var mvvmConfigDefaults = [
    "name",
    "version",
    "author",
    "username",
    "email",
    "id",
    "created",
    "local_path",
    "updated",
    "serverDir",
    "clientDir",
    "appDir",
    "coreDir",
    "modulesDir",
    "cwd"
]

/**
 * Expose the root Generator.
 */

exports = module.exports = new Generator;

/**
 * Expose `Generator`.
 */

exports.Generator = Generator;


/*
 * Public Methods
 */


/**
 * @class Generator
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Generator('access_token');
 *
 * @param {String} access_token Access Token
 */



function Generator(token) {

    var _this = this;

    this._config     = new Storage('mvvm', 'mvvm.json');

    this.demoDir     = path.join(__dirname, '../demos');

    this.localDir    = path.join(homeDir, '/.mvvm-store');

    this.localConfig = require( join( homeDir, '.mvvm.json' ) );

    _this.log = function(){
        if (arguments[2]) {
            return console.log('['.bold.blue+'mvvm'.bold.magenta+']'.bold.blue+': ', arguments[0], arguments[1], arguments[2])
        }
        if (arguments[1]) {
            return console.log('['.bold.blue+'mvvm'.bold.magenta+']'.bold.blue+': ', arguments[0], arguments[1])
        }
        if (arguments[0]) {
            return console.log('['.bold.blue+'mvvm'.bold.magenta+']'.bold.blue+': ', arguments[0].green)
        }
    }

    this.localExists = function(name) {
        return this.isDir(this.localDir, name)
    }
    this.demoExists  = function(name) {
        return this.isDir(this.demoDir, name)
    }
    this.isDir = function(root, name) {
        return _f.isDir( join( root, name ) )
    }

    this.isValid = function(arg) {
        if(generatorTypes[arg]) {
            debug(arg+' is Generator!', 'success');
        } else {
            console.log(arg+ ' is not a generator!'.bold.red);
            console.log('Please try one of the following'.red);
            console.log('================================');
            _.forEach(generatorTypes, function (type, key) {
                console.log('mvvm make '+key.blue+' [name]');
            })
            process.exit();
        }

    }
    this.forEachDir = function(dir, cb){
        console.log('test', dir);
        var folders = fs.readdirSync(dir)
        _.forEach(folders, function (folder){
            cb(folder)
        });

    };
    _this.isCore = function(){
        if(_this.generating.module === 'core'){
            return _this.mvvmConfig.coreDir;
        }
        return join(_this.mvvmConfig.modulesDir, _this.generating.module);

    };
    _this.isModule = function(component){
        if(_this.generating.type === 'module'){
            return join(_this.mvvmConfig.modulesDir, _this.generating.name);
        }
        return join(_this.isCore(), component);
    };

    this.getDestination = function(){
        _this.destinations = {
            controller: _this.isModule('controllers'),
            directive:  _this.isModule('directives'),
            provider:   _this.isModule('providers'),
            factory:    _this.isModule('services'),
            service:    _this.isModule('services'),
            config:     _this.isModule('config'),
            filter:     _this.isModule('filters'),
            module:     _this.isModule(),
            style:      _this.isModule('styles'),
            test:       _this.isModule('tests'),
            view:       _this.isModule('views'),
            api:        _this.isModule('api')
        };
        return _this.destinations[_this.generating.type];
    };

    _this.getNames = function(name){
        var names = {};
            names.slug       = _s.slugify(name);
            names.classed    = _s.classify(names.slug);
            names.camel      = _s.camelize(names.slug);
            names.humanized  = _s.humanize(names.slug);
        return names;
    };


    _this.validateGenerator = function(){
        _.forEach(mvvmConfigDefaults, function (item){
            if(!_this.mvvmConfig[item]){
                _this.validationFailed(item);
                process.exit();
                return
            }
        })
    }

    _this.validationFailed = function(item){
        console.log();
        console.log();
        this.log('You are missing required configurations')
        this.log('Cannot Find', ('"'+item+'"').bold.red, 'in ./mvvm.json'.bold.red);
        this.log('Please run', 'mvvm init'.bold.blue, 'and make sure you answer all the questions');
        console.log();
        console.log();
    };
    program.on('start', function() {
        _this.local = new finder( _this.localDir );
        _this.demos = new finder( _this.demoDir )
        _this.cwd   = new finder( process.cwd() );
        _this.mvvmConfig  = _this._config.all();
        _this.questions = [];
        _this.generating = {};
    });



};

Generator.prototype.__proto__ = EventEmitter.prototype;

_.extend(Generator.prototype, require('./component'))



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

Generator.prototype.start = function( name, callback ) {
    gulp.task(name, callback).start();
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

Generator.prototype.prompt = function prompt(prompts, cb) {
    inquirer.prompt(prompts, function(answers) {
        cb(answers);
    });
};

Generator.prototype.create = function(cb) {

    var _this = this;

    _this.validateGenerator()

    _this.isValid(program.args[0]);

    _this.generating.type      = program.args[0]   || null;
    _this.generating.name      = program.args[1]   || null;
    _this.generating.module    = program.module    || null;
    _this.generating.providers = program.providers || null;
    _this.generating.functions = program.functions || null;

    if(_this.generating.type === 'module'){
        if(!_this.generating.name){
            this.questions.push(questions.name);
        }
        return _this.doPrompt(cb);
    }

    if(!_this.generating.module){

        _this.forEachDir(_this.mvvmConfig.modulesDir, function (folder){
            questions.module.choices.push({name:folder, value:folder})
        })
    }

    _.forEach(_this.generating, function (item, key){
        if(!item) _this.questions.push(questions[key])
    });

    _this.doPrompt(cb)

};

Generator.prototype.doPrompt = function(cb){
    var _this = this;

    if(_.size(_this.questions)){

        this.prompt(this.questions, function (answers) {

            _.extend(_this.generating, answers)

            cb(_this.generating);
        });
    } else {
        cb(_this.generating)
    }
}

/*
 * Private Methods
 */

function rename(file) {

    if (file.basename.slice(0,3) === '$__') {
      file.basename = '.' + file.basename.slice(3);
    }
}
function join(){
    return Array.prototype.slice.call(arguments).join('/')
}