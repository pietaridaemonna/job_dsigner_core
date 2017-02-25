'use strict';
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
