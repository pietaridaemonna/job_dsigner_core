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
var Task = require('task');

var jobSchema = new Schema({
  name: String,
  description: String,
  trigger: String, //ONCE, NTIMES, UNTIL_SUCCESS, UNTIL_FAIL, CRON
  type: String, //EXEC, SSH, POWERSHELL, SQL, LOG, REST
  command: String,
  output: Buffer,
  created_at: Date,
  updated_at: Date,
  tasks: [Task],
  status: String
})


var Job = mongoose.model('Job', jobSchema);

Job.methods.create = function(name, permission){
  this.name = name;
  this.permission = permission;
}

Job.methods.alter = function(permission){
  this.permission = permission;
}

Job.methods.rename = function(name){
  this.name = name;
}

Job.methods.delete = function(id){
  Job.remove({id:{$eq: id}}).exec();
}


// make this available to our users in our Node applications
module.exports = Job;
