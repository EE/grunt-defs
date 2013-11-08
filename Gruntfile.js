/**
 * grunt-defs
 * https://github.com/EE/grunt-defs
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Copyright (c) 2013 Laboratorium EE
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: true,
            },
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
        },

        // Configuration to be run (and then tested).
        defs: {
            options: {
                transformDest: undefined,
                outputFileSuffix: undefined,
                defsOptions: {},
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'jshint',
        'defs',
        'test',
    ]);
};
