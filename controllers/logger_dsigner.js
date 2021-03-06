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

use 'strict';
var fs = require('fs');

var internal_logger = {
  log_path: "some path",
  debug_on: true
};

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
internal_logger.methods.log_info = function(message){
  fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [INFO] "+message, function (err) {
    if (err) throw err;
    console.log('log_info written');
  });
}

internal_logger.methods.log_warning = function(message){
  fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [WARN] "+message, function (err) {
    if (err) throw err;
    console.log('log_info written');
  });
}

internal_logger.methods.log_error = function(message){
  fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [ERROR] "+message, function (err) {
    if (err) throw err;
    console.log('log_info written');
  });
}

internal_logger.methods.log_debug = function(message){
  if(this.debug_on){
    fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [DEBUG] "+message, function (err) {
      if (err) throw err;
      console.log('log_info written');
    });
  }
}

internal_logger.methods.log_security_update = function(message){
  fs.appendFile(internal_logger.log_path, "[ "+Date.now+" ] [SECURITY_UPDATE] "+message, function (err) {
    if (err) throw err;
    console.log('log_info written');
  });
}

export.module = internal_logger;
