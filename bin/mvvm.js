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
    LocalStore = new Storage('store', path.join(__dirname,'../store.json')),
    packages = require('../lib/utility/packages'),
    store    = require('../lib/store');

require('colors');

/*
 * Api Insight
 */

var insight = new Insight({
    trackingCode: 'google-traking-code',
    packageName: pkg.name,
    packageVersion: pkg.version
});


/**
 * Notify on start
 */
program.emit('start')

/*
 * Api Bootstrap
 */

program
    .version(pkg.version, '-v, --version')
    .usage('command [option]'.white);

/*
 * Options
 */

program
    .option('--json', 'Show pure JSON output');



/*
 * Api Init
 */

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
            name: 'description',
            message: 'Project description',
            default: mvvmPkg.description || npm.description
        }, {
            type: 'input',
            name: 'author',
            message: 'Author?',
            default: mvvmPkg.author || defaults.username
        }, {
            type: 'input',
            name: 'username',
            message: 'Github username',
            default:mvvmPkg.username || defaults.username
        }, {
            type: 'input',
            name: 'email',
            message: 'Github Email?',
            default:mvvmPkg.email || defaults.email
        }];

        //Ask
        ask(prompts);

        function ask(questions){
            api.prompt(questions, function(answers) {

                config.batch(answers)
                config.save()
            });
        }
        function validateName(input){
            var done = this.async();
            var projects = LocalStore.get('projects');

            if(projects[input]){
                done('This project is already in your storage')
            } else {
                done(true)
            }
        }

    });



program
    .command('core')
    .action(function(){

        var prompts = [
            {
                type:'list',
                name:'application',
                message:'Codebase starting point?',
                choices:[{
                    name:'bank',
                    value:'blank',
                },{
                    name:'skeleton',
                    value:'skeleton',
                    default:true
                }]
            }
        ]
        api.prompt(prompts, function(answers){
            api.core(answers)
        })
    })

program
    .command('local')
    .action(function(){
        var localDir =path.join(__dirname, '../local');

        var prompts = [{
            type:"list",
            name:"stack",
            message: "Stack?",
            choices:[]
        }]
        var folders = fs.readdirSync(localDir)
        _.forEach(folders, function (folder){
            console.log(folder);
            prompts[0].choices.push({name:folder, value:folder})
        })
        api.prompt(prompts, function (answers){
            api.stack(answers.stack)
        })

    })

/*
 * Store Save
 */

program
    .command('save')
    .action(function(){
        store.save()
    })


/*
 * Api Signup
 */

program
    .command('signup')
    .description('Create your account'.white)
    .action(function() {
        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'What\'s your name?'
        }, {
            type: 'input',
            name: 'email',
            message: 'What\'s your email?'
        }, {
            type: 'password',
            name: 'password',
            message: 'Enter your password'
        }];
        //Ask
        api.prompt(prompts, function (answers) {
            api.signup(answers.name, answers.email, answers.password);
        });
    });

/*
 * Api Status
 */
program
    .command('status')
    .description('Show status of API'.white)
    .action(function() {
        api.status(program.json);
    });

/*
 * Api on help ption show examples
 */

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ mvvm signup');
    console.log('    $ mvvm status');
    console.log('');
});

program
    .command('clear')
    .action(function(){
        inquirer.prompt([{
            type:'confirm',
            name:'confirm',
            message: 'Are You Sure?'.bold.red+' Delete EVERYTHING except ( mvvm.json )'.blue+'?????'.bold.red,
            default:false
        }], function (answers){
            if(answers.confirm){
                del(['./server', './client', './*', '**/.*', '!./mvvm.json'])
            } else {
                console.log('Exiting');
                console.log('*** Nothing was removed ***'.red);
                process.exit()
            }
        })
    })
program
    .command('clean')
    .action(del.bind(null, ['./server', './client', './*', './.*']))

/*
 * Api Banner
 */

if (process.argv.length === 3 && process.argv[2] === '--help') {
    banner();
}

if (process.argv.length === 4 && process.argv[3] !== '--json') {
    banner();
} else {
    if (process.argv.length === 3 && process.argv[2] !== '--help') {

        banner();
    }
}




/*
 * Api Process Parser
 */

program.parse(process.argv);

/*
 * Api Default Action
 */

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
