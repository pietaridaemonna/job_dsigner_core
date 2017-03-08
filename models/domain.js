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
var Department = require('department');

var domainSchema = new Schema({
  name: String,
  organization: String,
  dns_name: String,
  itin: String, //international tax identifier number - NOT NUMBER as some countries doesn't have itin and can use completely different ID
  description: String,
  location: {
    gps_loc: Point,
    address: String,
    city: String,
    country: String    
  },
  created_at: Date,
  updated_at: Date,
  departments: [Department]
});


var Domain = mongoose.model('Domain', domainSchema);

// make this available to our users in our Node applications
module.exports = Domain;