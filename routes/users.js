const express = require('express');
const router = express.Router();

//Import the model 
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Create a user: SignUp 
router.post('/signup', (req, res, next) =>{
  //Check if user doesn't  already exist: Here we chech the req.body(what a client entered if is not already registered)
  User.findOne({username: req.body.username})
  .then(user => {
    //If the user exist: we return an error 
    if(user) {
      const err = new Error(`User ${req.body.username} already exists!`);
      err.status = 403;
      return next(err);
    } else {
      //If user does not exitst: we create a new user fron req.body data
      User.create({
        username: req.body.username,
        password: req.body.password
      })
      .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Registration Successful!', user: user});
      })
      .catch(err => next(err));
    }
  })
  .catch(err => next(err));

});

//Sign/ login in after signup/resgistration 
router.post('/login', (req, res, next) => {

  //Check if the user is not already login by see the session 
  if(!req.session.user) {

    //Challenge the user to create a session 
    const authHeader = req.headers.authorization;

    if(!authHeader) {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 403;
      return next(err);
    }

    //Get password and username 
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    //Check if the user(username) is not already in the database 
    User.findOne({username: username})
    .then(user => {
      if(!user) {
        const err = new Error(`User ${username} does not exist!`);
        err.status = 401;
        return next(err);
      } else if(user.password !== password) {
        //Check if passwords match with the database 
        const err = new Error('Your password is incorrect!');
        err.status = 401;
        return next(err);
      } else if(user.username === username && user.password === password) {
        //Extra check if username and password(both) match
        //if it does we set the session 
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      }
    })
    .catch(err => next(err));

  } else {
    //This check if there is a session meaning user is already authenticated 
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
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
