var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/products', require('./routes/products'))
app.use('/api/v1/categories', require('./routes/categories'))


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Lỗi máy chủ';

  // Check if it's an API request
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({
      success: false,
      message: message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  }

  // For non-API routes, render error view
  res.locals.message = message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(status);
  res.render('error');
});

module.exports = app;
