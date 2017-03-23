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

var express = require('express')
var router = express.Router()
var Domain = require('../../models/domain')
var Department = require('../../models/department')

router.get('/', function (req, res, next) {

    Domain
        .findOne({
            name: 'HPE'
        })
        .populate('departments', 'name') // only return the departments name
        .exec(function (err, dpts) {
            if (err) return handleError(err);

            console.log('deps: %s', dpts);
            res.render('department_list', {
                deps: dpts,
                domain_name: 'HPE'
            })
        })


})

module.exports = router



// Domain.find({ name: 'HPE' }, function(err, dom) {
//     console.log('dom: %s', dom)

//     // var jsonData = JSON.parse(dom)
//     // console.log('jsonData: %s', jsonData)
//     // for (var i = 0; i < jsonData.departments.length; i++) {
//     //     var dep = jsonData.departments[i]
//     //     console.log(dep.name)
//     // }        //  ?????????????????????

//     var dpts = dom.departments

//     console.log('deps: %s', dpts)

//     res.render('department_list', {
//         departments: dpts
//     })
// })