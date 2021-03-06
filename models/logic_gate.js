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

// CORE
// AND - all must be 1 to get 1
// OR  - if one or more 1, then 1
// NOT - inverted

// COMPOSITE
// NAND - AND followed by NOT - if at least one 0, then 1
// NOR  - OR followed by NOT  - if all 0, then 1
// EXOR - exclusive OR - if all not matching, then 1
// EXNOR - exclusive NOR - if matching

var logic_gate = {
    gate_type: ['AND', 'OR', 'NOT'],
    connections_in: [Number],
    connect_to: Number,
    compute_conns_in: function() {
        switch (gate_type) {
            case 'AND':
                console.log('Using AND')
                break
            case 'OR':
                console.log('Using OR')
                break
            case 'NOT':
                console.log('Using NOT')
                break
            default:
                console.log('Sorry, we are out of ' + expr + '.')
        }
    },
    event_completed: function() {
        alert("event_completed " + this.connections_in[0] + '.')
    }
}

module.exports = Domain