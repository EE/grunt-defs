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

    var oldNode = /^v0\./.test(process.version);

    // Support: Node.js <4
    // Skip running tasks that dropped support for Node.js 0.12
    // in thise Node version.
    var runIfNewNode = function (task) {
        return oldNode ? 'print_old_node_message:' + task : task;
    };

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

    // Load grunt tasks from NPM packages
    // Support: Node.js <4
    // Don't load the eslint task in old Node.js, it won't parse.
    require('load-grunt-tasks')(grunt, {
        pattern: oldNode ? ['grunt-*', '!grunt-eslint'] : ['grunt-*'],
    });

    // Supports: Node.js <4
    grunt.registerTask('print_old_node_message', function () {
        var task = [].slice.call(arguments).join(':');
        grunt.log.writeln('Old Node.js detected, running the task "' + task + '" skipped...');
    });

    grunt.registerTask('lint', [
        runIfNewNode('eslint'),
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
