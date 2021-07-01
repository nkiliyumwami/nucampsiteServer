const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');

//Import the model 
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Create a user: SignUp 
router.post('/signup', (req, res) => {
  //Create a user with passport
  User.register(
      new User({username: req.body.username}), req.body.password,
    err => {
      //Check for errors
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        //If no error : then authenticate the newly created user 
        passport.authenticate('local') (req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    }
  );
});

//Sign/ login in 
router.post('/login', passport.authenticate('local'), (req, res) => {
  //Once a user is authenticated; then get a token: 
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'})
});


//Log out a user: Here we use 'get' as a user is not sending anything to the server ! 
router.get('/logout', (req, res, next) => {
  //To log out we check if you loged in by seeing the session and if there we destroy it 
  if(req.session) {
    req.session.destroy(); //Destroying the session 
    res.clearCookie('session-id'); //Delete/clear the cookie
    res.redirect('/'); //Re-direct the user to root/homepage
  } else {
    //The user is not logged in so he/she can not log out !! 
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});


//Export the module
module.exports = router;
