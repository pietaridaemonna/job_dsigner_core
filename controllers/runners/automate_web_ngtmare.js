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


use 'strict';
var express = require('express');
var router = express.Router();
var Nightmare = require('nightmare');


router.get('/:subj/:descr', function (req, res, next) {
    var subj = req.params.subj;
    var descr = req.params.descr;

    var nightmare = Nightmare({show: true, height: 1000, width: 1400});

    nightmare
        .goto('http://google.com')
        .insert('input[name="username"]', 'user1')
        .insert('input[name="password"]', '12345678')
        .click('input[name="login"]')
        .wait('#wrapper3')
        .wait(4000)
        .click('.projects')
        .wait('#wrapper3')
        .wait(4000)
        //.click('a.href["/issues"]')    ///!FIX
        .goto('http://google.com')
        .wait(5000)
        .goto('http://google.com')
        .wait(3000)
        .insert('input[name="issue[subject]"]', subj)
        .wait(3000)
        .insert('.wiki-edit', descr)
        .wait(3000)
        //.click('input[name="commit"] [type=submit]')
        .click('input[name="commit"]')
        .wait(4000)
        .end()
        .then(function (result) {
            console.log(result)
            res.send("ISSUE CREATED or FINISHED");
        })
        .catch(function (error) {
            console.error('Search failed:', error);
            res.send("TEST ERROR "+error);

        });


});

module.exports = router;
