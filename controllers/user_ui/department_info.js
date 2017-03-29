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
var Department = require('../../models/department');



router.get('/:domain/:department_name', function(req, res, next) {

    //console.log('GET REQUEST ON DOMAIN_INFO!!!'); //, req.params.department_name);
    var department_name = req.params.department_name;
    var domain_name = req.params.domain;

    Department.find({ department_name }, 'name type description itin fqdn', function(err, dpts) {
        res.render('department_info', {
            department_name: department_name,
            departments: dpts,
            domain_n: domain_name
        });
    });

});

router.post('/', function(req, res, next) {

    console.log('GET REQUEST ON DEPT_INFO!!!'); //, req.params.department_name);

    res.render('department_info', { dom: 'Request POST forbidden' });

});

module.exports = router;












//var replaced = str.split(' ').join('+');