const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

//Implementing the local strategy 
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //To deal with session in passport
passport.deserializeUser(User.deserializeUser()); //To deal with session in passport