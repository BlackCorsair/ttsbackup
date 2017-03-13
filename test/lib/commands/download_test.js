var assert = require('chai').assert;
var download = require('../../../lib/commands/download');

describe('download', function () {
    describe('.downloadUrl()', function () {
        it('should alert on failed downloads', function (done) {
            download.downloadUrl('/tmp', 'https://dl.dropboxusercontent.com/u/1763962/Tabletop%20Sim/Phage-T4.obj', function(error){
                assert(error !== null);
                done();
            });
        });

        it('handles pastebin file', function(done) {
            download.downloadUrl('/tmp', 'http://pastebin.com/raw/y74C6r8h', function(error) {
              assert(error === null || error === undefined);
              done();
            })
        });
    });
});
