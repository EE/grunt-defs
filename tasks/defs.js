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

    var fs = require('fs'),
        defs = require('defs');

    grunt.registerMultiTask('defs',
        'Static scope analysis and transpilation of ES6 block scoped const and let variables, to ES3.',

        function () {
            var filesNum = 0,
                validRun = true,
            // Merge task-specific and/or target-specific options with these defaults.
                options = this.options();

            // Iterate over all specified file groups.
            this.files.forEach(function (mapping) {
                var tmpFilePath = mapping.dest; // use the destination file as a temporary source one

                if (options.defsConfigURL) {
                    options.defsOptions = grunt.file.readJSON(options.defsConfigURL);
                    delete options.defsConfigURL;
                }

                if (mapping.dest) {
                    // If destination file provided, concatenate all source files to a temporary one.
                    // In such a case options transformDest & outputFileSuffix are ignored.

                    grunt.file.write(
                        tmpFilePath,
                        mapping.src.map(function (file) {
                            return grunt.file.read(file);
                        }).join('\n')
                    );

                    if (!runDefs(tmpFilePath, tmpFilePath, options.defsOptions)) {
                        validRun = false;
                    }
                } else {
                    // Otherwise each file will have its own defs output.

                    // Transform the destination path.
                    if (!options.transformDest) {
                        // By default, append options.outputFileSuffix to the file name.
                        options.transformDest = function transformDest(path) {
                            return path + (options.outputFileSuffix || '');
                        };
                    }

                    mapping.src.map(function (path) {
                        if (!runDefs(path, options.transformDest(path), options.defsOptions)) {
                            validRun = false;
                        }
                    });
                }
            });

            function runDefs(srcPath, destPath, defsOptions) {
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
                if (fs.existsSync(destPath)) {
                    fs.unlinkSync(destPath);
                }

                // Write defs output to the target file.
                grunt.file.write(destPath, defsOutput.src);

                return true;
            }

            if (validRun) {
                if (filesNum < 1) {
                    grunt.log.ok('No files provided to the defs task.');
                } else {
                    grunt.log.ok(filesNum + (filesNum === 1 ? ' file' : ' files') + ' successfully generated.');
                }
            }
            return validRun;
        });

};
