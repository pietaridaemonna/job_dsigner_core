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
var Job = require('./job');

// stage is a step for defining a conceptually distinct subset of the entire Pipeline,
// for example: "Build", "Test", and "Deploy"
//Details of a specific stage run: run number, status, when it was triggered, who triggered it and duration of the stage

var stageSchema = new Schema({
  name: String,
  description: String,
  color: String,
  tags: [String],
  jobs: [Job]
},  { timestamps: { createdAt: 'created_at' } });





stageSchema.methods.rename = function(name){
  this.name = name;
}

stageSchema.methods.change_color = function(name){
  this.name = name;
}

stageSchema.methods.delete = function(id){
  Stage.remove({id:{$eq: id}}).exec();
}

var Stage = mongoose.model('Stage', stageSchema);
// make this available to our users in our Node applications
module.exports = Stage;