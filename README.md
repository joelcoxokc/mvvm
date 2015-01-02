# mvvm UNDER Development


[![Build Status](https://secure.travis-ci.org/joelcoxokc/mvvm.png?branch=master)](https://travis-ci.org/joelcoxokc/mvvm) [![NPM version](https://badge-me.herokuapp.com/api/npm/mvvm.png)](http://badges.enytc.com/for/npm/mvvm)

> Model View ViewModel Scaffolding tool # in development

## Includes

A bunch of predefined boilerplates for AngularJS Fullstack Applications.

There a several from John Papa's (ng-demos)[https://github.com/johnpapa/ng-demos]

John Papa has been the biggest help with the teams I have been working with at HackReactor. Thanks. 


## What is mvvm?

mvvm is an all purpose command line tool that does several things. 
It is primarily build for Angular applications. However, it can be used with anything. 

Initially I had build an angular fullstack generator called **slush-y**

**mvvm** now does everything and more that **slush-y**.

##What does mvvm do?

**mvvm** contains a local store, which allows you to save you current working directory. This of course allows you to re install it somewhere else. 

**Why not use git?** Well git is great... but I need something to generate template code quick, and creating a new repo, or pulling peices from a repo was too tediouse. 

**mvvm** is also a command line generator. It uses Gulp, just like slush does, however, you get to create and save the templates. 

There is currently not a great deal of flexibility when saving templates. I will be providing updates soon. 

Here are some of the featured within mvvm


##Features

    - AngularJS Component Generator
    - Demo AngularJS Application Generator
    - Local Package Storage


Lets get started, and I'll go a little more in depth on these feature below. 

## Getting Started
Install the module with: 

```bash
$ npm install -g mvvm
```



## Documentation

### mvvm init

This initializes your CWD (Current working directory with a mvvm.json file)

`mvvm.json` is an important file, and must be in your directory to run most of the commands. 

The **init** command will prompt you for several directory paths. 

    -clientDir : your client side directory
    -serverDir : your server side directory
    -appDir    : The application directory within your client
    -modulesDir: The directory where you store your separate  AngularJS Modules
    -coreDir   : The directory where you store you core AngularJS Module


```bash
mvvm init
```

Now that we have initialize our directory. you can run the `mvvm demo` command. 

### mvvm demo

Provides a list of demo applications. 
Several of which come from John Papa's (ng-demos)[https://github.com/johnpapa/ng-demos].

Here is a list of the current demos

**[BASE](https://github.com/joelcoxokc/mvvm/demos/BASE)**
**[CORE](https://github.com/joelcoxokc/mvvm/demos/CORE)**
**[modular](https://github.com/johnpapa/ng-demos/tree/master/quickstart/modular)**
**[quickstart](https://github.com/johnpapa/ng-demos/tree/master/quickstart)**
**[playground-ng-1.3](https://github.com/johnpapa/ng-demos/tree/master/ng-1.3%20playground)**
**[cc-bmean](https://github.com/johnpapa/ng-demos/tree/master/cc-bmean)**

##DEMOS

####BASE

Provides you with a completely empty apllication folder structure. However, 
There NodeJS server is filled out with something quite interesting. 

I have found that it is difficult for new developers to understand how everything in **NodeJS** is connected. So the server is simply an object called **app** that is past around to the furthest depths of the server. Each file adds itself, and it's sibling files to this object. By the time the computer reads the server/index.js the entire node application has added some information to the app object. 

The app object is finally console.logged at the end of the file. Now you can simply preview what all has been added to the object. 

The client side is only a bunch of empty, well architected folders. 

####CORE

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/joelcoxokc/mvvm/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/joelcoxokc/mvvm/issues).

## License 

The MIT License

Copyright (c) 2014, JoelCox

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

