var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');

//Connect to MongoDB Server
const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

//Error handling: new way
connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-0985-5362')); //We can not use cookie and session at the same time!!

//Using express-session(this replace the cookie we used before)
app.use(session({
  name: 'session-id', //You can use whatever you want
  secret: '12345-67890-0985-5362', //You can use whatever you want
  saveUninitialized: false,
  resave: false,
  store: new FileStore  //This will create a file to store session on our server haed disk
}));

//Authentication: Come after middlewares
function auth(req, res, next) {
  console.log(req.session)
  //Using session
  //If there is no session 
    if(!req.session.user) {
      const authHeader = req.headers.authorization;
        if(!authHeader) {
        const err = new Error('You are not authenticated!');
        res.setHeader(`WWW-Authenticate`, 'Basic');
        err.status = 401;
        return next(err);
      }
    //Get the user and password
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    //Validation: Check user and password and set the session 
      if(user === 'admin' && pass === 'password') {
        //Set the session
        req.session.user = 'admin';
        return next(); //Authorized
      } else {
        const err = new Error('You are not authenticated!');
        res.setHeader(`WWW-Authenticate`, 'Basic');
        err.status = 401;
        return next(err);
      }
  } else {
    //If there is a session :
    if(req.session.user === 'admin') {
      return next();
    } else {
      //If there is an err 
      const err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }
  }

}
  
app.use(auth)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

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
