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

var EventEmitter = require('events').EventEmitter,
    debug        = require('./debugger.js'),
    path         = require('path'),
    util         = require('util'),
    fs           = require('fs');


/**
 * Expose the root Utility.
 */

exports = module.exports = new Utility;

/**
 * Expose `Utility`.
 */

exports.Utility = Utility;

/**
 * @class Utility
 *
 * @constructor
 *
 *
 *
 * @param {String} Access Token
 */


function Utility() {

    var _this = this;

    this.debug = debug;


    /*
     * Public Methods
     */

    /**
     * [two description]
     * @param  {[type]}   param [description]
     * @param  {Function} cb   [description]
     * @return {[type]}        [description]
     */
    this.one = function(param, cb) {};

    /**
     * [one description]
     * @param  {[type]}   param [description]
     * @param  {Function} cb   [description]
     * @return {[type]}        [description]
     */
    this.two = function(param, cb) {};

    /**
     * [delete description]
     * @param  {[type]}   param [description]
     * @param  {Function} cb   [description]
     * @return {[type]}        [description]
     */
    this.delete = function(param, cb) {};

};

/*
 * Public Methods
 */

Utility.prototype.__proto__ = EventEmitter.prototype;


//HandlerExceptions
process.on('uncaughtException', function(err) {
    console.log();
    console.error(err.stack);
    console.error(err);
});

/**
 * [start description]
 * @param  {[type]}   name     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Utility.prototype.start = function( name, callback ){}

/**
 * [log description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
Utility.prototype.log = function( options ){}


/**
 * [prompt description]
 * @param  {[type]}   prompts [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
Utility.prototype.prompt = function prompt(prompts, cb) {};


/*
 * Private Methods
 */

/**
 * [privateMethod description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function privateMethod(val){}

/**
 * [someLongIterator description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function someLongIterator(array){}



