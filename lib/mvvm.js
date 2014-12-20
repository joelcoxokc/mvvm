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

var request = require('superagent'),
    inquirer = require('inquirer'),
    debug = require('./debugger.js'),
    _ = require('underscore'),
    pj = require('prettyjson').render,
    join = require('path').join;

/*
 * Private Methods
 */

function response(err, res, pureJson, message, type) {
    if (err) {
        throw err;
    }
    if (res) {
        if (!pureJson) {
            console.log('\n[ ' + 'Response'.green.bold + ' ] ==> ');
            console.log();
            console.log(pj(res.body));
        } else {
            console.log(JSON.stringify(res.body, null, 4));
        }
    }
    if (message && type) {
        debug(message, type);
    }
    if (message && !type) {
        debug(message);
    }
}

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

var Api = module.exports = function Api(token) {
    //Access Token
    this.access_token = token;
    //apiUri
    this.uri = 'https://ully.in/api';
    var apiUri = 'https://ully.in/api/:path';
    //Get handler
    this.get = function(path, cb) {
        request
            .get(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Post handler
    this.post = function(path, body, cb) {
        request
            .post(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Put handler
    this.put = function(path, body, cb) {
        request
            .put(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Delete handler
    this.delete = function(path, body, cb) {
        request
            .del(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
};

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

/**
 * Method responsible for create accounts
 *
 * @example
 *
 *     api.signup('name', 'email', 'password');
 *
 * @method signup
 * @public
 * @param {String} name Name
 * @param {String} email Email
 * @param {String} password Password
 */

Api.prototype.signup = function signup(name, email, password) {
    this.post('signup', {
        name: name,
        email: email,
        password: password
    }, function(err, res) {
        if (err) {
            return response(err);
        }
        return response(null, res);
    });
};

/**
 * Method responsible for showing the status of api
 *
 * @example
 *
 *     api.status();
 *
 * @method status
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Api.prototype.status = function status(pureJson) {
    this.get('status', function(err, res) {
        if (err) {
            return response(err);
        }
        return response(null, res, pureJson);
    });
};
