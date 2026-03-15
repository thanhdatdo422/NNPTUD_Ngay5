var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');

// 1. Require các Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles'); // BỔ SUNG: Import router của roles

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 2. Định tuyến (Routes)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter); // BỔ SUNG: Khai báo endpoint /roles

// Các API cũ của bạn
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));

// 3. Kết nối MongoDB
// LƯU Ý: Thay 'localhost' thành '127.0.0.1' để tránh lỗi kết nối bị từ chối (ECONNREFUSED) trên Node.js v17+ do phân giải IPv6
mongoose.connect('mongodb://127.0.0.1:27017/NNPTUD-C3')
  .then(() => {
    console.log("Đã kết nối thành công với MongoDB Local (DB: NNPTUD-C3)");
  })
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err);
  });

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

module.exports = app;