var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

var session = require('express-session');
var MySQLStore = require('express-mysql-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var networkRouter = require('./routes/network_api_Route');
var deviceRouter = require('./routes/device_api_Route');
var companyRouter = require('./routes/company_api_Route');
var siteRouter = require('./routes/site_api_Route');
var adminAccRouter = require('./routes/adminAcc_api_Route');


var errorRouter = require('./routes/error_api_Route');
var upsRouter = require('./routes/ups_api_Route');

var fileUploadRouter = require('./routes/upload');


//대곡-소사
var  hds_managerRouter= require('./routes/hds_manager_api_Route');
var  hds_accountRouter= require('./routes/hds_account_api_Route');
var alarmRouter = require('./routes/alarm_api_Route');


var mysql = require("mysql");

var  http=require('http');

var app = express();

var dbconfig = require('./routes/config/database');
var sessionStore = new MySQLStore(dbconfig);
app.use(session({
  secret: "asdfasdfdas",
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static('uploads'));
app.use(cors()); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/network', networkRouter);
app.use('/api/device', deviceRouter);
app.use('/api/company', companyRouter);
app.use('/api/error', errorRouter);
app.use('/api/ups', upsRouter);
app.use('/api/site', siteRouter);
app.use('/upload',fileUploadRouter);
app.use('/api/account',adminAccRouter);

// 대곡-소사
app.use('/api/hds/manager',hds_managerRouter);
app.use('/api/hds/account',hds_accountRouter);
app.use('/api/alarm',alarmRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// http.createServer(app).listen(9091, function () {
//     console.log('서버 실행 9091포트로 api 서버 실행!!!');
// });


module.exports = app;