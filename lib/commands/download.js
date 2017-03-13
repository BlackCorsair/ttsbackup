var fs = require('fs');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var request = require('request');
var async = require('async');
var UrlHelper = require('./../util/url_helper');
var PathHelper = require('./../util/path_helper');
var JsonLoader = require('./../util/json_loader');
var Timer = require('./../util/timer');
var prompt = require('prompt');

var downloadUrl = function (toDirectory, url, callback) {
    console.log("downloading: %s", url);

    request.get(url)
        .on('response', function(response) {
            if(response.statusCode != 200) {
              console.error("Failure response code: %s for %s, check mod for issues.", response.statusCode, url);
              return callback(new Error("Fault Http response"));
            }

            var out = fs.createWriteStream(path.join(toDirectory, UrlHelper.fileNameForUrl(url)));
            out.on('finish', function(){
                out.close(callback);
            });

            out.on('error', function(err) {
                console.error(err);
                callback(err);
            });

            response.pipe(out);
        })
        .on('error', function (err) {
            console.error("Error! Could not get resource: %s. Continuing, but check your mod after archiving for issues.", url);
            callback(err);
        });
};

var download = function (filePath, options, doneCallback) {
    if (!options.downloadDirectory) {
        console.error("No output directory specified for downloads. Exiting!");
        process.exit(1);
    }

    const originalModContent = fs.readFileSync(filePath, 'utf8');
    const modObject = JsonLoader.read(filePath);
    const path_helper = new PathHelper(options.downloadDirectory, options.gameName);

    var startDownload = function () {
        path_helper.createArchivePath();
        if (options.clean) {
            path_helper.emptyArchivePath();
        }
        fs.writeFileSync(path_helper.modPath(), originalModContent);
        var externalResources = UrlHelper.getUniqueUrlsInObject(modObject);

        const numberOfConcurrentDownloads = options.numberOfConcurrentDownloads || 8;
        const timer = new Timer();
        timer.start();
        // async.everyLimit(externalResources, numberOfConcurrentDownloads, _.curry(downloadUrl)(path_helper.archivePath()), function () {
        //     console.log("Download Time: %ss", timer.stop());
        //     doneCallback(null, path_helper.modPath());
        // });
        async.eachLimit(
          externalResources,
          numberOfConcurrentDownloads,
          function eachFunction (url, next) {
            return downloadUrl(path_helper.archivePath(), url, next)
          },
          function finalFunction () {
            console.log("Download Time: %ss", timer.stop());
            doneCallback(null, path_helper.modPath());
        });
    };

    if (path_helper.archivePathExists()) {
        console.log("Output path: %s already exists. Overwrite? (true, false)", path_helper.archivePath());
        prompt.get({
            properties: {
                overwrite: {
                    required: true,
                    type: 'boolean',
                    default: 'false',
                    message: 'Use "true", "false", "t", or "f'
                }
            }
        }, function (err, result) {
            if (result.overwrite) {
                startDownload();
            }
            else {
                console.error("Aborting");
                process.exit(1);
            }
        });
    }
    else {
        startDownload();
    }
};

module.exports = {
    download: download,
    downloadUrl: downloadUrl
};
