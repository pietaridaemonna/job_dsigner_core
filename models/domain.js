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
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var departmnt = require('./department');


var domainSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    organization: String,
    dns_name: String,
    itin: String, //international tax identifier number - NOT NUMBER as some countries doesn't have itin and can use completely different ID
    description: String,
    type: {
        type: String,
        enum: ['Business', 'Government', 'Non-profit', 'Personal', ]
    },
    location: {
        address: {
            street: String,
            city: String,
            state: String,
            zip: Number
        },
        city: String,
        country: String
    },
    created_at: Date,
    updated_at: Date,
    departments: [departmnt]
});



domainSchema.methods.find_domain_by_dns = function (_dns_name) {
    //Domain.find({ dns_name: dns_name }).where('created_at').gt(monthAgo).exec(function(err, users) {
    Domain.find({
        dns_name: _dns_name
    }).exec(function (err, users) {
        if (err) throw err;
    });
}

domainSchema.methods.find_dom = function () {
    //Find one blog post by this
    Domain.findOne({
        name: "Yash Kumar"
    }, {
        organization: {
            $elemMatch: {
                body: "hey"
            }
        }
    }, function (err, doc) {
        if (err) {
            console.error(err.stack);
            process.exit(1);
        } else {
            console.log(doc);
            process.exit(0);
        }
    });
}

mongoose.connect('mongodb://127.0.0.1:27017/job_dsigner_db');

var Domain = mongoose.model('Domain', domainSchema);
// make this available to our users in our Node applications
module.exports = Domain;