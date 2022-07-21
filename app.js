const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const flash = require('connect-flash');

const app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./api/auth/router');
const kecamatanRoutes = require('./api/kecamatan/router');
const userRoutes = require('./api/petugas/router');
const munfiqRoutes = require('./api/munfiq/router');
const penarikanRoutes = require('./api/penarikan/router');
const rekapRoutes = require('./api/rekap/router');

const URL = '/api/v1';

// routes
app.use(`${URL}/auth`, authRoutes);
app.use(`${URL}/kecamatan`, kecamatanRoutes);
app.use(`${URL}/users`, userRoutes);
app.use(`${URL}/munfiq`, munfiqRoutes);
app.use(`${URL}/penarikan`, penarikanRoutes);
app.use(`${URL}/rekap`, rekapRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000;

app.listen(() => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;