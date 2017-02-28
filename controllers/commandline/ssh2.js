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
var Connection = require('ssh2');
var express = require('express');
var router = express.Router();
var SSHController = require("../event_controller");

var sshc = new SSHController();

sshc.on("started", function() {
  console.log("[INFO]: SSHController started...")
})

sshc.on("stopped", function() {
  console.log("[INFO]: SSHController stopped...")
})


router.get('/:hostname/:username/:password/:command', function (req, res, next) {

    var host = req.params.hostname;
    var port = '22';
    var username = req.params.username;
    var password = req.params.password;
    var passphrase = '1234@#4321';
    var stdout = '';
    var stderr = '';
    var command = req.params.command;

    var conn = new Connection();
    conn.on('ready', function () {
        //console.log('Connection :: ready');
        conn.exec(command, function (err, stream) {
            if (err) return res.send(err);
            var stdout = '';
            var stderr = '';
            stream.on('exit', function (code, signal) {
                //console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
            }).on('close', function () {
                //console.log('Stream :: close');
                conn.end();
                res.render('ssh2', { stdout: stdout, stderr: stderr });
            }).on('data', function (data_out) {
                //console.log('STDOUT: \n' + data_out);
                stdout += data_out;
            }).stderr.on('data', function (data_err) {
                //console.log('STDERR: \n' + data_err);
                stderr += data_err;
            });
        });
    }).connect({
        host: host,
        port: port,
        username: username,
        password: password,
        passphrase: passphrase,
        privateKey: require('fs').readFileSync('./ssh_keys/id_rsa')
    });

    conn.on('error', function (e) {
        console.log("Connection failed or timed out");
        res.render('ssh2', { stdout: stdout, stderr: 'Connection failed or timed out' });
    });
});

router.get('/RAW/:hostname/:username/:password/:command', function (req, res, next) {

    var host = req.params.hostname;
    var port = '22';
    var username = req.params.username;
    var password = req.params.password;
    var passphrase = '1234@#4321';
    var stdout = '';
    var stderr = '';
    var command = req.params.command;

    var conn = new Connection();
    conn.on('ready', function () {
        //console.log('Connection :: ready');
        conn.exec(command, function (err, stream) {
            if (err) return res.send(err);
            var stdout = '';
            var stderr = '';
            stream.on('exit', function (code, signal) {
                //console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
            }).on('close', function () {
                //console.log('Stream :: close');
                conn.end();
                res.writeHead(200, {'Content-Type': 'text/plaintext'});  //RENDER TO PLAINTEXT
                res.write( stdout, stderr);
                res.end();
            }).on('data', function (data_out) {
                //console.log('STDOUT: \n' + data_out);
                stdout += data_out;
            }).stderr.on('data', function (data_err) {
                //console.log('STDERR: \n' + data_err);
                stderr += data_err;
            });
        });
    }).connect({
        host: host,
        port: port,
        username: username,
        password: password,
        passphrase: passphrase,
        privateKey: require('fs').readFileSync('./ssh_keys/id_rsa')
    });

    conn.on('error', function (e) {
        console.log("Connection failed or timed out");
        res.render('Connection failed or timed out');
    });
});

module.exports = router;
