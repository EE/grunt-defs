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

    var defs = require('defs');

    grunt.registerMultiTask('defs',
        'Static scope analysis and transpilation of ES6 block scoped ' +
            'const and let variables, to ES3.',

        function () {
            var filesNum = 0;
            var validRun = true;
            // Merge task-specific and/or target-specific options with these defaults.
            var options = this.options();

            if (options.transformDest != null) {
                grunt.fail.fatal(
                    [
                        'The `transformDest` option is no longer supported.',
                        'The following configuration:',
                        '',
                        '    app: {',
                        '        options: {',
                        '            transformDest: function (srcPath) {',
                        '                return doSomethingWithSrcPath(srcPath);',
                        '            },',
                        '        },',
                        '        src: [\'app/*.js\'],',
                        '    },',
                        '',
                        'should be replaced by:',
                        '',
                        '    app: {',
                        '        files: [',
                        '            {',
                        '                expand: true,',
                        '                src: [\'app/*.js\'],',
                        '                rename: function (destPath, srcPath) {',
                        '                    return doSomethingWithSrcPath(srcPath);',
                        '                },',
                        '            },',
                        '        ],',
                        '    },',
                    ].join('\n')
                );
            }

            if (options.outputFileSuffix != null) {
                grunt.fail.fatal(
                    [
                        'The `outputFileSuffix` option is no longer supported.',
                        'The following configuration:',
                        '',
                        '    app: {',
                        '        options: {',
                        '            outputFileSuffix: \'-annotated\',',
                        '        },',
                        '        src: [\'app/*.js\'],',
                        '    },',
                        '',
                        'should be replaced by:',
                        '',
                        '    app: {',
                        '        files: [',
                        '            {',
                        '                expand: true,',
                        '                src: [\'app/*.js\'],',
                        '                rename: function (destPath, srcPath) {',
                        '                    return srcPath + \'-annotated\';',
                        '                },',
                        '            },',
                        '        ],',
                        '    },',
                    ].join('\n')
                );
            }

            if (options.defsConfigURL) {
                options.defsOptions = grunt.file.readJSON(options.defsConfigURL);
                delete options.defsConfigURL;
            }

            var runDefs = function runDefs(srcPath, destPath, defsOptions) {
                filesNum++;

                var defsOutput = defs(grunt.file.read(srcPath), defsOptions);

                // Write the destination file.
                if (defsOutput.errors) {
                    grunt.log.write('Generating "' + destPath + '" from "' + srcPath + '"...');
                    grunt.log.error();
                    defsOutput.errors.forEach(function (error) {
                        grunt.log.error(error);
                    });
                    return false;
                }

                // Remove the temporary destination file if existed.
                if (grunt.file.exists(destPath)) {
                    grunt.file.delete(destPath);
                }

                // Write defs output to the target file.
                grunt.file.write(destPath, defsOutput.src);

                return true;
            };

            // Iterate over all specified file groups.
            this.files.forEach(function (mapping) {
                // Use the destination file as a temporary source one.
                var tmpFilePath = mapping.dest;

                // Concatenate all source files to a temporary one.

                grunt.file.write(
                    tmpFilePath,
                    mapping.src.map(function (file) {
                        return grunt.file.read(file);
                    }).join('\n')
                );

                if (!runDefs(tmpFilePath, tmpFilePath, options.defsOptions)) {
                    validRun = false;
                }
            });

            if (validRun) {
                if (filesNum < 1) {
                    grunt.log.ok('No files provided to the defs task.');
                } else {
                    grunt.log.ok(
                        filesNum + (filesNum === 1 ? ' file' : ' files') +
                        ' successfully generated.');
                }
            }
            return validRun;
        });

};
