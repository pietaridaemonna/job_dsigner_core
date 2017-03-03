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


/* GET home page. */
router.get('/', function(req, res, next) {
  var suite_id = 0;
  var suite_viz_json = [
  {source: "Win 10", target: "CISCO", type: "licensing"},
  {source: "HP_Blade", target: "CISCO", type: "resolved"},
  {source: "H3C", target: "SGI", type: "suit"},
  {source: "Asterisk", target: "SGI", type: "suit"},
  {source: "SGI", target: "RedHat 7.3", type: "resolved"},
  {source: "RedHat 7.3", target: suite_id, type: "suit"},
  {source: "RedHat 7.3", target: "SGI", type: "suit"},
  {source: suite_id, target: "CISCO", type: "suit"}
  ];
  res.render('suiteviz', {suitelist: JSON.stringify(suite_viz_json),suite_id: suite_id});
});

router.get('/:suite_id', function(req, res, next) {
  var suite_id = req.params.suite_id;
  var suite_viz_json = [
  {source: "Win 10", target: "CISCO", type: "licensing"},
  {source: "HP_Blade", target: "CISCO", type: "resolved"},
  {source: "H3C", target: "SGI", type: "suit"},
  {source: "Asterisk", target: "SGI", type: "suit"},
  {source: "SGI", target: "RedHat 7.3", type: "resolved"},
  {source: "RedHat 7.3", target: suite_id, type: "suit"},
  {source: "RedHat 7.3", target: "SGI", type: "suit"},
  {source: suite_id, target: "CISCO", type: "suit"}
  ];
  res.render('suiteviz', {suitelist: JSON.stringify(suite_viz_json),suite_id: suite_id});
});

module.exports = router;
