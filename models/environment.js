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

var environmentSchema = new Schema({
    name: String,
    description: String,
    type: {
        type: String,
        enum: ['Production', 'Test', 'Development', ]
    },
    env_variables: [String]
})

var Environment = mongoose.model('Environment', environmentSchema);

Environment.methods.create = function(name, permission) {
    this.name = name;
    this.permission = permission;
}

Environment.methods.add_variable = function(variable, path) {
    this.permission = permission;
}

Environment.methods.remove_variable = function(variable) {
    this.name = name;
}

Environment.methods.delete = function(id) {
    Environment.remove({ id: { $eq: id } }).exec();
}


// make this available to our users in our Node applications
module.exports = Task;