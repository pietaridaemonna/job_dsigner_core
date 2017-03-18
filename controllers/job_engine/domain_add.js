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

var express = require('express');
var router = express.Router();
var Domain = require('../../models/domain');



router.get('/', function(req, res, next) {

    console.log('GET REQUEST ON DOMAIN_ADD!!!'); //, req.params.name);

    res.render('domain_add');

});

router.post('/', function(req, res, next) {

    console.log('TRYING TO ADD  %s added'); //, req.params.name);

    var dom = new Domain();
    dom.name = req.body.domain_name;
    dom.fqdn = req.body.fqdn;
    dom.type = req.body.domain_type;
    dom.itin = req.body.itin;
    dom.description = req.body.description;

    //save data
    dom.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Domain %s added', dom.name);
        }
    });

    res.render('domain_add', { dom: req.body.domain_name });

});

module.exports = router;












//var replaced = str.split(' ').join('+');