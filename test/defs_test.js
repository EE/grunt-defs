'use strict';

const grunt = require('grunt');
const defs = require('defs');
const fs = require('fs');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.defs = {
    setUp: function (done) {
        this.options = {
            outputFileSuffix: '.defs',
            defsOptions: {
                disallowVars: true,
                disallowDuplicated: true,
                disallowUnknownReferences: false,
            },
        };
        done();
    },
    simple_example: function (test) {
        test.expect(2);

        const defsOutput = defs(grunt.file.read('test/fixtures/simple_example.js'), this.options);

        test.equal(defsOutput.exitcode, 0, 'should exit with code 0.');
        if (defsOutput.exitcode !== 0) {
            return;
        }

        const expected = grunt.file.read('test/expected/simple_example.js');
        test.equal(defsOutput.src, expected, 'should transform consts & lets to vars.');

        test.done();
    },
};
