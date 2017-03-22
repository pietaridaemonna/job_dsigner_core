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
var Project = require('../../models/project');



router.get('/', function (req, res, next) {

    console.log('GET REQUEST ON DEPT_ADD!!!'); //, req.params.name);

    res.render('department_add');

});

router.post('/', function (req, res, next) {

    var domain_name = req.body.domain_name;
    console.log("DOM: %s", domain_name);

    var prj = new Department();
    prj.name = req.body.project_name;
    console.log("proj name: %s", prj.name);
    prj.description = req.body.description;
    console.log("description: %s", prj.description);
    prj.type = req.body.project_type;
    console.log("description: %s", prj.type);


    Domain.findOne({
        "name": domain_name
    }, function (err, dom) {

        dom.departments.findOne({
            department_name
        }, function (err, prj) {

            prj.projects.push({
                "name": prj.name,
                "description": prj.description,
                "pipelines": []
            });

            prj.save(function (err) {
                //console.log(dom);
                //mongoose.disconnect();
            });

        });

    });


    res.render('department_add', {
        prj: req.body.department_name,
        dom: domain_name
    });

});

module.exports = router;












//var replaced = str.split(' ').join('+');