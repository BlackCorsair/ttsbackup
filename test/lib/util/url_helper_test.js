var assert = require('chai').assert;
var UrlHelper = require('../../../lib/util/url_helper');

describe('UrlHelper', function () {
    describe('#removeSuffixesOnUrl()', function () {
        it('should remove symbols from filenames that cause issues with reading or writing', function () {
            assert.equal(UrlHelper.removeSuffixesOnUrl("test{Unique}", UrlHelper.ttsExtensions()), "test");
            assert.equal(UrlHelper.removeSuffixesOnUrl("test?dl=1", UrlHelper.dropboxExtensions()), "test");
        });
    });

    describe('#fileNameForUrl()', function(){
        it('removes slashes at the end of urls', function(){
           assert.equal(UrlHelper.fileNameForUrl('http://bob.com/1234/'), '1234');
        });
    });

    describe('#isYoutubeLink()', function(){
        it('detects youtube links', function(){
            assert.isTrue(UrlHelper.isYoutubeLink('http://www.youtube.com/watch'));
        })
        it('does not detect regular links', function(){
            assert.isFalse(UrlHelper.isYoutubeLink('http://image.com'));
        })
    });
});
