/**
 * grunt-defs
 * https://github.com/EE/grunt-defs
 *
 * Author Michał Gołębiowski-Owczarek <michal.golebiowski@laboratorium.ee>
 * Copyright (c) 2013 Laboratorium EE
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: {
                src: ['test/tmp'],
            },
        },

        eslint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks',
                    'test',
                ],
            },
        },

        // Copy files to be processed by the defs task to the temporary directory.
        copy: {
            defs: {
                files: {
                    'test/tmp/src3.js': 'test/fixtures/src3.js',
                },
            },
        },

        // Configuration to be run (and then tested).
        defs: {
            options: {
                defsOptions: {
                    disallowUnknownReferences: false,
                },
            },
            simple: {
                files: {
                    'test/tmp/src1.js': 'test/fixtures/src1.js',
                },
            },
            loopClosures: {
                options: {
                    defsOptions: {
                        loopClosures: 'iife',
                    },
                },
                files: {
                    'test/tmp/src2.js': 'test/fixtures/src2.js',
                },
            },
        },

        // Unit tests.
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/spec.js'],
            },
        },
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('lint', [
        'eslint',
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'copy',
        'defs',
        'mochaTest',
    ]);
};
