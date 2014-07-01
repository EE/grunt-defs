'use strict';

var fs = require('fs'),
    expect = require('expect.js');

function readFile(path) {
    return fs.readFileSync(path, {encoding: 'utf8'});
}

function readTmp(filename) {
    return readFile('test/tmp/' + filename);
}

function readFixture(filename) {
    return readFile('test/fixtures/' + filename);
}

function readExpected(filename) {
    return readFile('test/expected/' + filename);
}

describe('grunt-defs', function () {
    it('should transform the file', function () {
        expect(readTmp('simple.js')).to.be(readExpected('simple.js'));
    });
});
