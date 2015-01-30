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

var questions = {
    name:{
        type:'input',
        name:'name',
        message:'Name?',
        validate:function(answer) {
            return !!answer
        }
    },
    type:{
        type:'list',
        name:'type',
        message:'module Type',
        choices:[
            {name:'lib', value:'lib'},
            {name:'module', value:'module'}
        ]
    },
    module: {
        type:'list',
        name:'module',
        message:'Angular Module',
        choices:[
            {name:'core', value:'core'}
        ],
        when: function(answers){
            if(answers.type === 'module') return true;
            return false;
        }
    },
    lib: {
        type:'list',
        name:'lib',
        message:'Lib',
        choices:[
        ],
        when: function(answers){
            if(answers.type === 'lib') return true;
            return false;
        }
    },
    functions:{
        type:'input',
        name:'functions',
        message:'Create functions?',
        filter:function(answers){
            if (answers) { return answers.split(','); }
            return null
        }
    },
    providers:{
        type:'input',
        name:'providers',
        message:'Add providers?',
        filter:function(answers){
            if (answers) { return answers.split(','); }
            return null
        }
    }
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
 * Expose the root API.
 */

exports = module.exports = new API;

/**
 * Expose `API`.
 */

exports.API = API;


/*
 * Public Methods
 */


/**
 * @class API
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new API('access_token');
 *
 * @param {String} access_token Access Token
 */



function API(token) {

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

    this.isDir = function(root, name) {
        return _f.isDir( join( root, name ) )
    }

    this.forEachDir = function(dir, cb){
        console.log('test', dir);
        var folders = fs.readdirSync(dir)
        _.forEach(folders, function (folder){
            cb(folder)
        });

    };
    _this.isCore = function(){
        if (_this.generating.module === 'core'){
            return _this.mvvmConfig.coreDir;
        }
        return join(_this.mvvmConfig.modulesDir, _this.generating.module);

    };
    _this.isModule = function(component){
        if (_this.generating.type === 'module'){
            return join(_this.mvvmConfig.modulesDir, _this.generating.name);
        }
        return join(_this.isCore(), component);
    };

    _this.findandSet = function(dir, type){
        _this.forEachDir(dir, function (folder){
            questions[type].choices.push({name:folder, value:folder});
        });
    }

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
            if (!_this.mvvmConfig[item]){
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
        _this.cwd   = new finder(process.cwd());
        _this.mvvmConfig  = _this._config.all();
        _this.modules = [];
        _this.libs = [];
        _this.findandSet(_this.mvvmConfig.modulesDir, 'module');
        _this.findandSet(_this.mvvmConfig.libsDir, 'lib')
        _this.questions = [];
        _this.generating = {};
    });


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

API.prototype.api = function() {

    var _this, dest, source, apiType, isEmpty;

    _this = this;

    isEmpty = true;
    apiType = 'factory';

    if (program.service) {apiType = 'service';}
    if (program.factory) {apiType = 'factory';}

    if (_this.generating.functions) {isEmpty = false;}

    if (isEmpty) apiType = join('empty', apiType);

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
API.prototype.config = function() {
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
API.prototype.controller = function() {
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
API.prototype.directive = function() {
    var _this, dest, source;
    _this = this;

    if(!program.args[0]){
        console.log('please provide a name mvvm directive [name]');
        return process.exit();
    } else {
        _this.generating.names = _this.getNames(program.args[0]);
    }

    _this.generating.name = program.args[0]  || null;
    _this.generating.module = program.module || null;

    if (!this.generating.name) _this.questions.push(questions.name);

    if (program.lib) {
        dest = join(_this.mvvmConfig.libsDir, 'directives', _this.generating.names.camel)
    }
    else if (program.module) {
        dest = join(_this.mvvmConfig.modulesDir, 'directives', _this.generating.names.camel)
    }
    else {
        _this.questions.push(questions.type, questions.module, questions.lib)
    }


    if(!program.functions) _this.questions.push(questions.functions)
    if(!program.providers) _this.questions.push(questions.providers)

    source  = [this.find('directive/complex/**/*')];
    if (program.styl) {source.push(_this.find('directive/options/stylus/*.styl')) }
    if (program.less) {source.push(_this.find('directive/options/less/*'))}
    if (program.sass) {source.push(_this.find('directive/options/sass/*'))}

    if (source.length === 1) source.concat(this.find('directive/options/css/*'))

    _this.prompt(_this.questions, function (answers){

        _.extend(_this.generating, answers);

        var type = _this.generating.module || _this.generating.lib;

        if (answers.lib) {
            dest = join(_this.mvvmConfig.libsDir, type, 'directives', _this.generating.names.camel)
        }
        else if (answers.module) {
            dest = join(_this.mvvmConfig.modulesDir,type, 'directives', _this.generating.names.camel)
        }



        _this.generating.templateUrl = 'templates/' + _this.generating.names.camel + '.view.html';
        _this.generating.functions = _this.generating.functions || ['toggle'];
        console.log(dest);

        _this.generate({
            dest:dest,
            src: source,
            event:emit('directive'),
            filter: _this.generating,
            rename:_this.generating.names.camel
        });
    });


    // Get template URL for the directive.
    // var fromClient = dest.split(_this.mvvmConfig.clientDir);
    // fromClient = fromClient[fromClient.length-1].slice(1);
    // _this.generating.templateUrl = join(fromClient, _this.generating.names.camel + '.template.html');



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
API.prototype.service = function() {
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
API.prototype.factory = function() {
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
API.prototype.provider = function() {
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
API.prototype.filter = function() {
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
API.prototype.test = function() {
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
API.prototype.module = function(generating) {
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
API.prototype.styles = function() {
    var _this = this;
    var dest   = join(_this.mvvmConfig.modulesDir, _this.generating.module, 'styles')
    var source = _this.find('style/base/**/*');
    console.log(dest);
    _this.generate({
        src: source,
        event:emit('style'),
        filter: _this.generating,
        dest:dest,
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
API.prototype.view = function() {
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


API.prototype.start = function( name, callback ) {
    gulp.task(name, callback).start();
}


API.prototype.prompt = function prompt(prompts, cb) {
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