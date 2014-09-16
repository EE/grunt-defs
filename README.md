# grunt-defs

> Static scope analysis and transpilation of ES6 block scoped const and let variables, to ES3

[![Build Status](https://travis-ci.org/EE/grunt-defs.svg?branch=master)](https://travis-ci.org/EE/grunt-defs)
[![Build status](https://ci.appveyor.com/api/projects/status/qy7mu03jtts47o46/branch/master)](https://ci.appveyor.com/project/mzgol/grunt-defs/branch/master)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-defs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-defs');
```

## The "defs" task

### Overview
In your project's Gruntfile, add a section named `defs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  defs: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

#### Options

The `defs` task accepts a couple of options:

```js
{
    // Here one can set `defs` options; see: https://npmjs.org/package/defs
    defsOptions: {
        disallowDuplicated: true,
        disallowUnknownReferences: false,
        disallowVars: true,
    },

    // Instead of providing `defsOptions` manually, one can provide a URL to the `defs-config.json`
    // configuration file; see: https://npmjs.org/package/defs
    defsConfigUrl: string,
}
```

### Usage Examples

```js
grunt.initConfig({
    defs: {
        options: {
            defsConfigURL: 'defs-config.json',
        },
        app1: {
            files: {
                'a.js': ['a.js'],
                'c.js': ['b.js'],
                'f.js': ['d.js', 'e.js'],
            },
        },
        app2: {
            files: [
                {
                    expand: true,
                    src: ['f.js'],
                    ext: '.defs.js', // Dest filepaths will have this extension.
                    extDot: 'last',  // Extensions in filenames begin after the last dot
                },
            ],
        },
        app3: {
            files: [
                {
                    expand: true,
                    src: ['g.js'],
                    rename: function (dest, src) { return src + '-defs'; },
                },
            ],
        },
    },
});

grunt.loadNpmTasks('grunt-defs');
```

After executing `grunt defs`, you'll get file `a.js` transformed and saved under the same name, file `b.js`
transformed and saved as `c.js` and files `d.js` and `e.js` concatenated, transformed and saved as `f.js`.

A transformed version of the `f.js` file will be saved as `f.defs.js` and a transformed version of the `g.js` file will be saved as `g.js-defs`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Laboratorium EE. Licensed under the MIT license.
