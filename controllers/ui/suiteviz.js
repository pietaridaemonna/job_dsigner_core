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
  var suite_viz_json = [
  {source: "Win 10", target: "Debian", type: "licensing"},
  {source: "Win 10", target: "Proxy", type: "licensing"},
  {source: "NetBSD", target: "RedHat 7.3", type: "suit"},
  {source: "Win 8.1", target: "RedHat 7.3", type: "suit"},
  {source: "Firewall", target: "RedHat 7.3", type: "resolved"},
  {source: "Proxy", target: "RedHat 7.3", type: "suit"},
  {source: "CISCO", target: "RedHat 7.3", type: "suit"},
  {source: "Win 10", target: "Solaris", type: "suit"},
  {source: "Win 10", target: "VirtSwitch", type: "suit"},
  {source: "Oracle Linux", target: "Google", type: "suit"},
  {source: "RedHat 7.3", target: "Proxy", type: "suit"},
  {source: "Win 10", target: "Inventec", type: "suit"},
  {source: "NetBSD", target: "CISCO", type: "resolved"},
  {source: "HP_Blade", target: "CISCO", type: "resolved"},
  {source: "HPE", target: "CISCO", type: "suit"},
  {source: "HPE", target: "Google", type: "suit"},
  {source: "iSCSI", target: "HP_Blade", type: "suit"},
  {source: "CISCO", target: "HP_Blade", type: "resolved"},
  {source: "RedHat 7.3", target: "Firewall", type: "resolved"},
  {source: "Qualcomm", target: "Firewall", type: "resolved"},
  {source: "RedHat 7.3", target: "Win 8.1", type: "suit"},
  {source: "Win 10", target: "Win 8.1", type: "suit"},
  {source: "Win 8.1", target: "Win 10", type: "suit"},
  {source: "H3C", target: "SGI", type: "suit"},
  {source: "Asterisk", target: "SGI", type: "suit"},
  {source: "CISCO", target: "NetBSD", type: "resolved"},
  {source: "RedHat 7.3", target: "NetBSD", type: "suit"},
  {source: "CISCO", target: "HPE", type: "suit"},
  {source: "Firewall", target: "Qualcomm", type: "suit"}
  ];
  res.render('suiteviz', {suitelist: JSON.stringify(suite_viz_json)});
});

module.exports = router;
