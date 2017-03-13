var expect = require('chai').expect;
var PathHelper = require('../../../lib/util/path_helper');

describe('PathHelper', function () {
    describe('#archivePath()', function () {
        it('hyphenates spaces for the game name', function () {
            const path_helper = new PathHelper("/tmp path", "My game name");
            expect(path_helper.archivePath()).to
                .equal('/tmp path/My-game-name');
        });
    });
});
