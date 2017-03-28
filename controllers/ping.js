// The MIT License (MIT)
// Copyright © 2017 Peter Ducai, http://daemonna.com <peter.ducai@gmail.com>
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software
// and associated documentation files (the “Software”), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
//     The above copyright notice and this permission notice shall be included
//     in all copies or substantial portions of the Software.
//
//     THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//     INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
//     PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
//     FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
//     ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

'use strict'
var unirest = require('unirest');
var express = require('express');
var router = express.Router();
var ping = require('ping');


router.get('/', function (req, res, next) {

    var hosts = ['15.241.148.65', 'www.google.com', 'localhost'];
    var output = 'OUT: ';

    var cfg = {
        timeout: 25,
        // WARNING: -i 2 may not work in other platform like window 
        extra: ["-i 2"],
    };

    hosts.forEach(function (host) {
        ping.sys.probe(host, function (isAlive) {
            var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
            output= output+'\n'+msg;
            console.log('output: %s', output);
            console.log(msg);
        }, cfg);
    });

    res.send(output);
});


module.exports = router;