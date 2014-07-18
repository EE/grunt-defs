'use strict';

var fs = require('fs'),
    expect = require('expect.js');

function readFile(path) {
    return fs.readFileSync(path, {encoding: 'utf8'});
}

function readTmp(filename) {
    return readFile('test/tmp/' + filename);
}

function readExpected(filename) {
    return readFile('test/expected/' + filename);
}

function check(filename) {
    expect(readTmp(filename)).to.be(readExpected(filename));
}

describe('grunt-defs', function () {
    it('should transform the file', function () {
        check('src1.js');
    });

    it('should transform loop closures when `defsOptions.loopClosures === "iife"`', function () {
        check('src4.js');
    });
});

describe('grunt-defs: deprecated options', function () {
    it('should transform the path using the `transformDest` function', function () {
        check('src2-transformed.js');
    });

    it('should add `outputFileSuffix` to the path', function () {
        check('src3.js-suffix');
    });
});
