//docker run -it -e EDGE_USE_CORECLR=1 tjanczuk/edgejs:6.5.1
'use strict'

var edge = require('edge');

var helloWorld = edge.func(`
    async (input) => { 
        return ".NET Welcomes " + input.ToString(); 
    }
`);

helloWorld('JavaScript', function (error, result) {
    if (error) throw error;
    console.log(result);
});



// You can also script Node.js from C#:

// using System;
// using System.Threading.Tasks;
// using EdgeJs;

// class Program
// {
//     public static async Task Start()
//     {
//         var func = Edge.Func(@"
//             return function (data, callback) {
//                 callback(null, 'Node.js welcomes ' + data);
//             }
//         ");

//         Console.WriteLine(await func(".NET"));
//     }

//     static void Main(string[] args)
//     {
//         Start().Wait();
//     }
// }