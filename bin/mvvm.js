#!/usr/bin/env node

/*
 * mvvm
 * https://github.com/joelcoxokc/mvvm
 *
 * Copyright (c) 2014, JoelCox
 * Licensed under the MIT license.
 */

/**
 * Module dependencies.
 */
var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var program = require('commander'),
    updateNotifier = require('update-notifier'),
    Insight = require('insight'),
    _ = require('lodash'),
    banner = require('../lib/utility/banner.js'),
    api = require('..'),
    path = require('path'),
    debug = require('../lib/utility/debugger.js'),
    pkg = require('../package.json'),
    gulp = require('gulp'),
    mkdirp = require('mkdirp'),
    del    = require('del'),
    inquirer = require('inquirer'),
    $ = require('gulp-load-plugins')({lazy:false}),
    namify = require('../lib/utility/namify'),
    defaults = require('../lib/utility/defaults'),
    _f  = require('fs-utils'),
    fs  = require('fs'),
    Storage = require('../lib/modules/storage.js'),
    config = new Storage('mvvm', 'mvvm.json'),
    LocalStore = new Storage('store', path.join(homeDir, '/.mvvm.json')),
    packages = require('../lib/utility/packages');
    var store = {};
    var storeApi = require('../lib/store.js')
    var file = _f.isEmpty(path.join(homeDir, '/.mvvm.json'))
    var dir  = _f.isDir(path.join(homeDir, '/.mvvm-store'))
    var demoDir = path.join(__dirname, '../demos')
    var localDir = path.join(homeDir, '/.mvvm-store');
    if(!dir) {
        mkdirp(path.join(homeDir, '/.mvvm-store'), function() {
            console.log('Dir Made');
        });
    }
    if(!file) {
        var newlocalDir = {"store": {"idCount": 12,"localDir":path.join(homeDir, '/.mvvm-store/') ,"projects": {}}}
        store =_f.writeJSONSync(path.join(homeDir, '/.mvvm.json'), newlocalDir);
        store = require(path.join(homeDir, '/.mvvm.json'));
        console.log("store===",store);
        LocalStore = new Storage('store', path.join(homeDir, '/.mvvm.json'));
        console.log("localStore===",LocalStore);
    }

    var generator = require('../lib/generator')

require('colors');

//////
//////     @Api insight
//////
var insight = new Insight({
    trackingCode: 'google-traking-code',
    packageName: pkg.name,
    packageVersion: pkg.version
});


//////
//////     @Api notify on start
//////
program.emit('start')

//////
//////     @Api Bootstrap
//////
program
    .version(pkg.version, '-v, --version')
    .usage('command [option]'.white);

//////
//////     @Options
//////
program
    .option('--json', 'Show pure JSON output')

//////
//////     @Command   local [name]
//////     @description initialize the current working directory with mvvm, Creates a mvvm.json in your directory
program
    .command('init')
    .description('initialize your project'.white)
    .action(function() {

        var npm   = packages.npm().pkg,
            mvvmPkg = config._store || config.all();


        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'Project name?',
            default: mvvmPkg.name ||  defaults.projectName,
            validate: validateName
        },{
            type: 'input',
            name: 'version',
            message: 'Version?',
            default:mvvmPkg.version || npm.version || '0.1.0'
        },{
            type: 'input',
            name: 'author',
            message: 'Author?',
            default: mvvmPkg.author || defaults.username
        },{
            type: 'input',
            name: 'username',
            message: 'Github username',
            default:mvvmPkg.username || defaults.username
        },{
            type: 'input',
            name: 'email',
            message: 'Github Email?',
            default:mvvmPkg.email || defaults.email
        },{
            type: 'input',
            name: 'serverDir',
            message: 'Server Directory?',
            default:mvvmPkg.serverDir || './src/server'
        },{
            type: 'input',
            name: 'clientDir',
            message: 'Client Directory?',
            default:mvvmPkg.clientDir || './src/client'
        },{
            type: 'input',
            name: 'appDir',
            message: 'Client App Directory?',
            default:mvvmPkg.appDir || './src/client/app/'
        },{
            type: 'input',
            name: 'coreDir',
            message: 'AngularJS Core Module Directory?',
            default:mvvmPkg.appDir || './src/client/app/core'
        },{
            type: 'input',
            name: 'modulesDir',
            message: 'AngularJS Modules Directory?',
            default:mvvmPkg.modulesDir || './src/client/app/modules'
        }];

        //Ask
        ask(prompts);

        function ask(questions) {
            api.prompt(questions, function(answers) {
                answers.cwd = process.cwd()
                config.batch(answers)
                config.save()
            });
        }
        function validateName(input) {
            var done = this.async();
            var projects = LocalStore.get('projects');

            if(projects[input]) {
                done('This project is already in your storage')
            } else {
                done(true)
            }
        }
    });

//////
//////     @Command   local [name]
//////     @description install a copy of a previously saved package or stack.
program
    .command('local [value]')
    .action(function() {

        if(this.args[0]) {
            return api.stack(this.args[0]);
        }

        var prompts = [{
            type:"list",
            name:"stack",
            message: "Stack?",
            choices:[]
        }]

        var folders = fs.readdirSync(localDir)
        _.forEach(folders, function (folder) {
            prompts[0].choices.push({name:folder, value:folder})
        })

        api.prompt(prompts, function (answers) {
            api.stack(answers.stack)
        })
    });

//////
//////     @Command   demo [name]
//////     @description install a copy of a previously saved package or stack.
program
    .command('demo [value]')
    .action(function() {

        if(this.args[0]) {
            return api.demo(this.args[0]);
        }

        var prompts = [{
            type:"list",
            name:"demo",
            message: "Demo application?",
            choices:[]
        }]

        var folders = fs.readdirSync(demoDir)
        _.forEach(folders, function (folder) {

            prompts[0].choices.push({name:folder, value:folder})
        })

        api.prompt(prompts, function (answers) {
            api.demo(answers.demo)
        })
    });

//////
//////     @Command   save
//////     @description Save the current working directory in ~/.mvvm-store/{package-name}
program
    .command('save')
    .action(function() {

        storeApi.save()
    })

//////
//////     @Command   remove
//////     @description Remove A package from the local store at ~/.mvvm-store/{package-name}
program
    .command('remove [name]')
    .action(function() {

        if(this.args[0]) {
            return api.remove(this.args[0]);
        }

        var prompts = [{
            type:"list",
            name:"name",
            message: "Package Name?",
            choices:[]
        }]

        var folders = fs.readdirSync(localDir)
        _.forEach(folders, function (folder) {

            prompts[0].choices.push({name:folder, value:folder})
        })

        api.prompt(prompts, function (answers) {
            api.remove(answers.name)
        })
    })

//////
//////     @Command   clear
//////     @description remove all files except mvvm.json
program
    .command('clear')
    .action(function() {
        inquirer.prompt([{
            type:'confirm',
            name:'confirm',
            message: 'Are You Sure?'.bold.red+' Delete EVERYTHING except ( mvvm.json )'.blue+'?????'.bold.red,
            default:false
        }], function (answers) {
            if(answers.confirm) {
                del(['./server', './client', './*', '**/.*', '!./mvvm.json'])
            } else {
                console.log('Exiting');
                console.log('*** Nothing was removed ***'.red);
                process.exit()
            }
        })
    })

//////
//////     @Command   clean
//////     @description Completely remove everything from the current directory
program
    .command('clean')
    .action(function() {

        inquirer.prompt([{
            type:'confirm',
            name:'confirm',
            message: 'Are You Sure?'.bold.red+' Delete EVERYTHING'.blue+'?????'.bold.red,
            default:false
        }], function (answers) {
            if(answers.confirm) {

                del(['./server', './client', './*', './.*'])

            } else {
                console.log('Exiting');
                console.log('*** Nothing was removed ***'.red);
                process.exit()
            }
        })
    })

//////
//////     @command   make
//////
program
    .option('--filled', 'Fill the module')
    .option('--service', 'Use the service api template')
    .option('--factory', 'Use the factory api template')
    .option('-p, --providers <items>', 'List of providers', list)
    .option('-f, --functions <items>', 'List of functions', list)
    .option('-m, --module [value]', 'The chosen module')
    .command('make [type] [name]')
    .action(function() {

        var _this = this;

        generator
            .create(function (generating) {
                generator[generating.type](generating)
            });

    });

//////
//////     @Command   --help
//////     @description to see a list of possible options
program.on('--help', function() {
    logger('   Welcome to the '+' ['.bold.blue+'mvvm'.bold.magenta+']'.bold.blue+ '  command line tool!');
    logger('   If you need help again just run ' + '--help'.bold.blue);
    logger('   Usage:'.blue);
    logger('');
    logger('    $ mvvm init             ->  initializes your current working directory with an mvvm.json');
    logline('                                If you have not run '+'$ mvvm init'.bold.blue+ ' Please do so!!!'.bold.red);
    logline('                                All other commands depend on it.'.bold.red);
    logger('    $ mvvm demo             ->  Install pre-configured demo applications');
    logger('    $ mvvm make '+'[component]'.bold.blue+' ->  CLI command for building AngularJS Module Components');
    logline('                                $ mvvm make'.bold.blue + '  Contains the following');
    logline('                [module]'.bold.blue);
    logline('                [config]'.bold.blue);
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                [controller]'.bold.blue);
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                        -p, --functions <list>'.green+' List the functions you would like to incliude');
    logline('                [directive]'.bold.blue);
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                        -p, --functions <list>'.green+' List the functions you would like to incliude');
    logline('                [service]'.bold.blue);
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                        -p, --functions <list>'.green+' List the functions you would like to incliude');
    logline('                [factory]'.bold.blue);
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                        -p, --functions <list>'.green+' List the functions you would like to incliude');
    logline('                [filter]'.bold.blue);
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                        -p, --functions <list>'.green+' List the functions you would like to incliude');
    logline('                [provider]'.bold.blue);
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                        -p, --functions <list>'.green+' List the functions you would like to incliude');
    logline('                [api]'.bold.blue);
    logline('                        --service     [boolean]'.green+'Specify that you want a service over a factory');
    logline('                        --factory     [boolean]'.green+'Factory that you want a service over a Service');
    logline('                        -m, --module    [name]'.green+' AngularJS module form your modules directory');
    logline('                        -p, --providers <list>'.green+' List the providers you would like to incliude');
    logline('                        -p, --functions <list>'.green+' List the functions you would like to incliude');
    logline('                [test]'.bold.blue);
    logline('                [styles]'.bold.blue);
    logline('                [view]'.bold.blue);
    logger('    $ mvvm local            ->  Install previousely saved packages from your local Your local Store is found at '+ path.join(homeDir, '/.mvvm-store/').bold.blue)
    logger('    $ mvvm save             ->  Save your current working directory in your local store.');
    logger('    $ mvvm clear            ->  '+'Delete everything'.bold.red+' from your current working directory except mvvm.json');
    logger('    $ mvvm clean            ->  '+'Delete everything from your current working directory'.bold.red);
    console.log('');
});


program.on('make', function(){
    generator.validateGenerator();
});

//////
//////      Api Banner
//////
if (process.argv.length === 3 && process.argv[2] === '--help') {
    banner();
}

if (process.argv.length === 4 && process.argv[3] !== '--json') {
    banner();
} else {
    if (process.argv.length === 3 && process.argv[2] !== '--help') {

        if(!program._events[process.argv[2]]){
            program._events['--help']()
        }

    }
}

// program.on('init', function(){
//     banner();
// })

//////
//////      @Process Parser
//////
program.parse(process.argv);

//////
//////      @Default Action
//////
var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
});

if (notifier.update) {
    notifier.notify(true);
}

if (process.argv.length == 2) {
    banner();
    program.help();

}


function list(val){

    return val.split(",");

}

function logger(){
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
function logline(){
    if (arguments[2]) {
        return console.log('   ['.bold.blue+'|'.bold.magenta+']'.bold.blue+': ', arguments[0], arguments[1], arguments[2])
    }
    if (arguments[1]) {
        return console.log('   ['.bold.blue+'|'.bold.magenta+']'.bold.blue+': ', arguments[0], arguments[1])
    }
    if (arguments[0]) {
        return console.log('   ['.bold.blue+'|'.bold.magenta+']'.bold.blue+': ', arguments[0].green)
    }
}