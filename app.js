var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const port = process.env.PORT || 80;
const port = process.env.PORT || 443;

//var https = require('https');
var fs = require('fs');

var indexRouter = require('./routes/index');
var visualizzaRouter = require('./routes/visualizza');
//var usersRouter = require('./routes/users');

//certificato SSL
/*var privateKey = fs.readFileSync('/etc/letsencrypt/live/soaseccervino.it/privkey.pem').toString();
var certificate = fs.readFileSync('/etc/letsencrypt/live/soaseccervino.it/fullchain.pem').toString();
var options = {
	key : privateKey,
	cert : certificate
}*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/visualizza', visualizzaRouter);
//app.use('/users', usersRouter);

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

console.log('Server in esecuzione sulla porta: ' + port);

/*app.listen(port, function(){
	console.log('Server in esecuzione sulla porta: ' + port);
});*/

module.exports = app;
