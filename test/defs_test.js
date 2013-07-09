'use strict';

var grunt = require('grunt'),
    defs = require('defs');

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

        var defsOutput = defs(grunt.file.read('test/fixtures/simple_example.js'), this.options),
            expected = grunt.file.read('test/expected/simple_example.js');

        test.equal(defsOutput.errors, undefined, 'should provide no errors.');
        if (defsOutput.errors) {
            test.done();
            return;
        }

        test.equal(defsOutput.src, expected, 'should transform consts & lets to vars.');

        test.done();
    },
};
