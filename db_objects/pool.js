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


if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// create a schema
var poolSchema = new Schema({
  name: String,
  admin: { type: String, required: true },
  description: String,
  suites: Array,
  users: Array,
  meta: {
    max_suites: Number
  },
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var Pool = mongoose.model('Pool', poolSchema);

Pool.methods.create = function(name, description){
  var new_pool = Pool({
    this.name: name,
    this.admin: "guest",
    this.description: description,
    this.suites: {},
    this.users: {},
    this.meta.max_suites: 100,
    this.created_at: Date.now(),
    this.updated_at: Date.now()
  });

  new_pool.save(function(error) {
     console.log("[INFO]: new_pool "+this.name+" has been saved!"); //?
     if (error) {
       console.error(error);
     }
  });
}

Pool.methods.alter = function(id, permission){
  Pool.update({_id : {$eq: id}}, {$set: {permission: permission}}, function(err, result){
  console.log("[SECURITY UPDATE]: Permissions on "+id+" updated successfully with "+permission);
  console.log(result);
});
}

Pool.methods.rename = function(name){
  this.save(function (err, data) {
    if (err) console.log(err);
      else console.log('Saved ', data );
});
}

Pool.methods.delete = function(id){
  Pool.remove({id:{$eq: id}}).exec();
}

Pool.methods.listAllSuites = function(){
  return this.Pool.find({ suites: { $exists: true } });
}

Pool.methods.listActiveSuites = function(name){
  return this.Pool.find({ suites: { $exists: true, $not: {$size: 0} } });
}

// make this available to our users in our Node applications
module.exports = Pool;
