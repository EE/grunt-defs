/**
 * grunt-defs
 * https://github.com/EE/defs
 *
 * Author Michał Gołębiowski <michal.golebiowski@laboratorium.ee>
 * Copyright (c) 2013 Laboratorium EE
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    const fs = require('fs');
    const defs = require('defs');

    grunt.registerMultiTask('defs',
        'Static scope analysis and transpilation of ES6 block scoped const and let variables, to ES3.',

        function () {
            let errorHasOccured = false;

            function runDefs(srcPath, destPath, defsOptions) {
                const defsOutput = defs(grunt.file.read(srcPath), defsOptions);

                // Write the destination file.
                if (defsOutput.exitcode !== 0) {
                    grunt.log.error('defs failed with code ' + defsOutput.exitcode + '.');
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

            // Merge task-specific and/or target-specific options with these defaults.
            const options = this.options();

            // Iterate over all specified file groups.
            this.files.forEach(function (mapping) {
                const tmpFileName = mapping.dest; // use the destination file as a temporary source one

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
                        errorHasOccured = true;
                    }
                } else {
                    // Otherwise each file will have its own defs output.
                    mapping.src.map(function (file) {
                        if (!runDefs(file, file + options.outputFileSuffix, options.defsOptions)) {
                            errorHasOccured = true;
                        }
                    });
                }
            });

            return !errorHasOccured;
        });
};
