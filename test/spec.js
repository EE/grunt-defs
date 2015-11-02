'use strict';

var fs = require('fs');
var expect = require('expect.js');

var readFile = function readFile(path) {
    return fs.readFileSync(path, {encoding: 'utf8'});
};

var readTmp = function readTmp(filename) {
    return readFile('test/tmp/' + filename);
};

var readExpected = function readExpected(filename) {
    return readFile('test/expected/' + filename);
};

var check = function check(filename) {
    expect(readTmp(filename)).to.be(readExpected(filename));
};

describe('grunt-defs', function () {
    it('should transform the file', function () {
        check('src1.js');
    });

    it('should transform loop closures when `defsOptions.loopClosures === "iife"`', function () {
        check('src2.js');
    });
});
