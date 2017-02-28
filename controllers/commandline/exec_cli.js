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

var express = require('express');
var router = express.Router();
const
    spawn = require( 'child_process' ).spawn,
    ls = spawn( 'ls', [ '-lh', '/usr' ] );

ls.stdout.on( 'data', data => {
    console.log( `stdout: ${data}` );
});

ls.stderr.on( 'data', data => {
    console.log( `stderr: ${data}` );
});

ls.on( 'close', code => {
    console.log( `child process exited with code ${code}` );
});



router.get('/exec_command/:command', function (req, res, command, next) {

    var child = spawn('prince', [
        '-v', 'builds/pdf/book.html',
        '-o', 'builds/pdf/book.pdf'
    ]);

    child.stdout.on('data', function (chunk) {
        // output will be here in chunks
    });

    // or if you want to send output elsewhere
    child.stdout.pipe(dest);

});


module.exports = router;