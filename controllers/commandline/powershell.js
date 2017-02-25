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

var express = require('express');
var router = express.Router();
var pwrshell = require('node-powershell');
var PowershellController = require("../event_controller");

var pw1c = new PowershellController();

pw1c.on("started", function() {
  console.log("[INFO]: PowershellController started...")
})

pw1c.on("stopped", function() {
  console.log("[INFO]: PowershellController stopped...")
})

/* GET users listing. */
router.get('/', function (req, res, next) {

  var ps = new pwrshell({ executionPolicy: 'Bypass', debugMsg: true, noProfile: true });

  ps.addCommand('echo "node-powershell rocks"')
    .then(function () {
      return ps.invoke();
    })
    .then(function (output) {
      console.log(output);
      res.render('powershell', { stdout: output, stderr: "none" });
      ps.dispose();
    })
    .catch(function (err) {
      console.log(err);
      res.render('powershell', { stdout: "none", stderr: err });
      ps.dispose();
    });

});



router.get('/RAW/GetRunningServices', function (req, res, next) {

  var ps = new pwrshell({ executionPolicy: 'Bypass', debugMsg: true, noProfile: true });
  var printr = '';

  ps.addCommand('Get-Service | Where-Object { $_.Status -eq "Running" }')
    .then(function () {
      return ps.invoke();
    })
    .then(function (output) {
      console.log(output);
      printr+=output;
      ps.dispose();
    })
    .catch(function (err) {
      console.log(err);
      printr+=err;
      ps.dispose();
    }).then(function (output, err){
      res.writeHead(200, { 'Content-Type': 'text/plaintext' });
      res.write(printr);
    });

});


module.exports = router;
