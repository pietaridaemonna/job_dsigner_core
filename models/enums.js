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


var ENV_TYPE = Object.freeze({
  PROD: {
    value: 0,
    name: "Production",
    code: "Prod"
  },
  DEV: {
    value: 1,
    name: "Development",
    code: "Dev"
  },
  TEST: {
    value: 2,
    name: "Testing",
    code: "Test"
  }
});

var JOB_TYPE = Object.freeze({
  CLI: {
    value: 0,
    name: "Commandline",
    code: "Prod"
  },
  SSH: {
    value: 1,
    name: "SSH remote shell",
    code: "Dev"
  },
  POWERSHELL: {
    value: 2,
    name: "Powershell",
    code: "Test"
  },
  PYTHON: {
    value: 2,
    name: "Testing",
    code: "Test"
  },
  PERL: {
    value: 2,
    name: "Testing",
    code: "Test"
  }
});

var CLI_VARS_TYPE = Object.freeze({
  POSIX: {
    value: 0,
    name: "Commandline",
    prefix: "-"
  },
  GNU: {
    value: 1,
    name: "SSH remote shell",
    prefix: "--"
  },
  SHELL: {
    value: 2,
    name: "Powershell",
    prefix: "$variable=value"
  },
  JAVA: {
    value: 2,
    name: "Testing",
    prefix: "-D"
  },
  DB: {
    value: 2,
    name: "Testing",
    prefix: "jdbc:oracle://127.0.0.1:8080"
  },
  ROBOTFRAMEWORK: {
    value: 2,
    name: "Testing",
    prefix: "Test"
  },
  CUSTOM: {
    value: 2,
    name: "Testing",
    prefix: "Test"
  }
});


// make this available to our users in our Node applications
module.exports = ENV_TYPE;