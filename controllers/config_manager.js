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
var fs = require('fs');

var internal_logger = require('../controllers/internal_logger')
var config_manager = {
  config_path: "job_dsigner_config.conf",
  debug_on: true
};

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}


config_manager.methods.read_config = function(message){
  fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [ERROR] "+message, function (err) {
    if (err) throw err;
    console.log('read_config FUNCTION');
  });
}

config_manager.methods.save_config = function(message){
  if(this.debug_on){
    fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [DEBUG] "+message, function (err) {
      if (err) throw err;
      console.log('save_config FUNCTION');
    });
  }
}

config_manager.methods.validate_config = function(message){
  fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [SECURITY_UPDATE] "+message, function (err) {
    if (err) throw err;
    console.log('validate_config FUNCTION');
  });
}

module.exports = config_manager;
