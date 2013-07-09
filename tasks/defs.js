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
            var validRun = true,
            // Merge task-specific and/or target-specific options with these defaults.
                options = this.options();

            // Iterate over all specified file groups.
            this.files.forEach(function (mapping) {
                var tmpFileName = mapping.dest; // use the destination file as a temporary source one

                if (options.defsConfigURL) {
                    options.defsOptions = grunt.file.readJSON(options.defsConfigURL);
                    delete options.defsConfigURL;
                }

                if (mapping.dest) {
                    // If destination file provided, concatenate all source files to a temporary one.
                    grunt.file.write(
                        tmpFileName,
                        mapping.src.map(function (file) {
                            return grunt.file.read(file);
                        }).join('\n')
                    );

                    if (!runDefs(tmpFileName, tmpFileName, options.defsOptions)) {
                        validRun = false;
                    }
                } else {
                    // Otherwise each file will have its own defs output.
                    mapping.src.map(function (file) {
                        if (!runDefs(file, file + options.outputFileSuffix, options.defsOptions)) {
                            validRun = false;
                        }
                    });
                }
            });

            function runDefs(srcPath, destPath, defsOptions) {
                var defsOutput = defs(grunt.file.read(srcPath), defsOptions);

                // Write the destination file.
                if (defsOutput.errors) {
                    defsOutput.errors.forEach(function (error) {
                        grunt.log.error(error);
                    });
                    return false;
                }

                // Remove the temporary destination file if existed.
                fs.unlink(destPath);

                // Write defs output to the target file.
                grunt.file.write(destPath, defsOutput.src);

                // Print a success message.
                grunt.log.ok('File "' + destPath + '" generated.');
                return true;
            }

            return validRun;
        });

};
