'use strict';
var _ = require('lodash');
var request = require('request');
var P = require('bluebird');

var DEFAULT_HOST = 'localhost';
var DEFAULT_PORT = 35729;

module.exports = {
    TinyLrNotifier: TinyLrNotifier,
    notify: notify
};

////////////////////

function TinyLrNotifier(host, port) {
    this.host = host || DEFAULT_HOST;
    this.port = port || DEFAULT_PORT;
}

TinyLrNotifier.prototype.notify = function(files) {
    return notify(this.host, this.port, files);
};

TinyLrNotifier.prototype.reload = function() {
    return this.notify('index.html');
};

////////////////////

// arg1 = host (optional)
// arg2 = port (optional)
// arg3 = files (required)
function notify(arg1, arg2, arg3) {
    var argsLength = arguments.length;

    return new P(function(resolve, reject) {
        var filesCsv = null;
        var requestUrl = null;
        var host = null;
        var port = null;
        var files = null;

        if (argsLength === 3) {
            host = arg1;
            port = arg2;
            files = arg3;
        } else if (argsLength === 2) {
            host = DEFAULT_HOST;
            port = arg1;
            files = arg2;
        } else if (argsLength === 1) {
            host = DEFAULT_HOST;
            port = DEFAULT_PORT;
            files = arg1;
        }

        requestUrl = 'http://' + host + ':' + port + '/changed?files=';

        if (host == null || port == null || files == null) {
            return reject(new Error('host, port and files are all required fields!'));
        }

        // one file
        if (_.isString(files)) {
            filesCsv = files;
        } else if (_.isArray(files)) {
            filesCsv = files.join(',');
        } else {
            return reject(new Error('files must be a string or an array of strings!'));
        }

        requestUrl += filesCsv;

        console.log(requestUrl);

        request.get(requestUrl, function(err, response, body) {
            if (err !== null) {
                return reject(err);
            } else {
                return resolve({
                    response: response,
                    body: body
                });
            }
        });
    });
}