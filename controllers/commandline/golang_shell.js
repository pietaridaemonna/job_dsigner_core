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

'use strict';

var Go = require('gonode').Go;

var options = {
    path        : 'gofile.go',
    initAtOnce  : true, 
}
var go = new Go(options, function(err) {
    if (err) throw err;

    // TODO: Add code to execute commands

    go.close();
});

// Execute some long running command
go.execute({text: 'I will run for quite a while!'}, function(result, response) {
    if(result.ok) {
        console.log('Go responded: ' + response.text);
    } else if(result.timeout) {
        console.log('Command timed out!');
    } else if(result.terminated) {
        console.log('Command was terminated!');
    }
});
//go.terminate(); // This line would most likely cause the above command to terminate
//go.close(); // This would cause gonode to close after the above command has finished




// Basic requirements in Go (gofile.go):

// package main

// import (
//     gonode "github.com/jgranstrom/gonodepkg"
//     json "github.com/jgranstrom/go-simplejson"
// )

// func main() {   
//     gonode.Start(process)
// }

// func process(cmd *json.Json) (response *json.Json) {
//     // TODO: Add code for processing commands from node
//     return cmd
// }