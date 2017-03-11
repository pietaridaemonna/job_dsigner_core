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
var ObjectId = Schema.ObjectId;

var taskSchema = new Schema({
    id: ObjectId,
    name: String,
    description: String,
    type: String, //CommandLine, SSH, SQL, SourceControl
    command: String
})



// Task.methods.create = function(name, permission){
//   this.name = name;
//   this.permission = permission;
// }

// Task.methods.alter = function(permission){
//   this.permission = permission;
// }

// Task.methods.rename = function(name){
//   this.name = name;
// }

// Task.methods.delete = function(id){
//   Task.remove({id:{$eq: id}}).exec();
// }


var jobSchema = new Schema({
    name: String,
    description: String,
    trigger: String, //ONCE, NTIMES, UNTIL_SUCCESS, UNTIL_FAIL, CRON
    type: String, //EXEC, SSH, POWERSHELL, SQL, LOG, REST
    command: String,
    output: Buffer,
    created_at: Date,
    updated_at: Date,
    tasks: [{ type: Schema.ObjectId, ref: 'Task' }],
    status: String
})




// Job.methods.create = function(name, permission){
//   this.name = name;
//   this.permission = permission;
// }

// Job.methods.alter = function(permission){
//   this.permission = permission;
// }

// Job.methods.rename = function(name){
//   this.name = name;
// }

// Job.methods.delete = function(id){
//   Job.remove({id:{$eq: id}}).exec();
// }

var stageSchema = new Schema({
    name: String,
    description: String,
    color: String,
    tags: [String],
    created_at: Date,
    updated_at: Date,
    jobs: [{ type: Schema.ObjectId, ref: 'Job' }]
})




// Stage.methods.create = function(name, permission){
//   this.name = name;
//   this.permission = permission;
// }

// Stage.methods.rename = function(name){
//   this.name = name;
// }

// Stage.methods.change_color = function(name){
//   this.name = name;
// }

// Stage.methods.delete = function(id){
//   Stage.remove({id:{$eq: id}}).exec();
// }


var pipelineSchema = new Schema({
    name: String,
    description: String,
    tags: [String],
    created_at: Date,
    updated_at: Date,
    stages: [{ type: Schema.ObjectId, ref: 'Stage' }]
})




// Pipeline.methods.create = function(name, permission){
//   this.name = name;
//   this.permission = permission;
// }

// Pipeline.methods.delete = function(id){
//   Pipeline.remove({id:{$eq: id}}).exec();
// }

var projectSchema = new Schema({
    name: String,
    description: String,
    created_at: Date,
    updated_at: Date,
    pipelines: [{ type: Schema.ObjectId, ref: 'Pipeline' }]
})



// Project.methods.create = function(name, permission){
//   this.name = name;
//   this.permission = permission;
// }

// Project.methods.add_pipeline = function(name, permission){
//   this.name = name;
//   this.permission = permission;
// }

// Project.methods.delete = function(id){
//   Stage.remove({id:{$eq: id}}).exec();
// }

var departmentSchema = new Schema({
    name: String,
    description: String,
    created_at: Date,
    updated_at: Date,
    tasks: [{ type: Schema.ObjectId, ref: 'Project' }]
})



var domainSchema = new Schema({
    name: String,
    organization: String,
    dns_name: String,
    itin: String, //international tax identifier number - NOT NUMBER as some countries doesn't have itin and can use completely different ID
    description: String,
    location: {
        gps_loc: String,
        address: String,
        city: String,
        country: String
    },
    created_at: Date,
    updated_at: Date,
    departments: [{ type: Schema.ObjectId, ref: 'Department' }]
});




mongoose.connect('mongodb://127.0.0.1:27017/job_dsigner_db');

var Task = mongoose.model('Task', taskSchema);
var Job = mongoose.model('Job', jobSchema);
var Stage = mongoose.model('Stage', stageSchema);
var Pipeline = mongoose.model('Pipeline', pipelineSchema);
var Project = mongoose.model('Project', projectSchema);
var Department = mongoose.model('Department', departmentSchema);
var Domain = mongoose.model('Domain', domainSchema);

exports.Task = Task;
exports.Job = Job;
exports.Stage = Stage;
exports.Pipeline = Pipeline;
exports.Project = Project;
exports.Department = Department;
exports.Domain = Domain;
exports.mongoose = mongoose;