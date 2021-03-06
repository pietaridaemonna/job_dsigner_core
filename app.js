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
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./controllers/index');
var dashboard = require('./controllers/admin/dashboard');
var jobeditor = require('./controllers/user_ui/jobeditor');
var ping = require('./controllers/ping');

var domain_list = require('./controllers/user_ui/domain_list');
var domain_create_form = require('./controllers/user_ui/domain_create_form');
var domain_add = require('./controllers/user_ui/domain_add');
var domain_info = require('./controllers/user_ui/domain_info');

var department_create_form = require('./controllers/user_ui/department_create_form');
var department_list = require('./controllers/user_ui/department_list');
var department_add = require('./controllers/user_ui/department_add');
var department_info = require('./controllers/user_ui/department_info');

var project_create_form = require('./controllers/user_ui/project_create_form');
var project_list = require('./controllers/user_ui/project_list');
var project_info = require('./controllers/user_ui/project_info');
var project_add = require('./controllers/user_ui/project_add');

var upload_form = require('./controllers/user_ui/upload_form');
var upload_file = require('./controllers/user_ui/upload_file');

var app = express();

app.use( function(req, res, next) {  
  if(!req.secure) {
    var secureUrl = "https://" + req.headers['host'] + req.url; 
    res.writeHead(301, { "Location":  secureUrl });
    res.end();
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/jobeditor', jobeditor);
//app.use('/suiteviz', suiteviz);

app.use('/domain_list', domain_list);
app.use('/domain_create_form', domain_create_form);
app.use('/domain_add', domain_add);
app.use('/domain_info', domain_info);

app.use('/department_create_form', department_create_form);
app.use('/department_list', department_list);
app.use('/department_add', department_add);
app.use('/department_info', department_info);

app.use('/project_create_form', project_create_form);
app.use('/project_info', project_info);
app.use('/project_list', project_list);
app.use('/project_add', project_add);

app.use('/upload_form', upload_form);
app.use('/upload_file', upload_file);
app.use('/ping', ping);

// ERROR HANDLING ..............................................................

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;