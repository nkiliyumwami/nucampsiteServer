const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');


//Import the model 
const User = require('../models/user');

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req, res, next) => {
  // res.send('respond with a resource');
  User.find()
  .then(users => {
    res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    })
    .catch(err => next(err));
  });


//Create a user: SignUp 
router.post('/signup', cors.corsWithOptions, (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                });
            }
        }
    );
});





//Sign/ login in 
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  //Once a user is authenticated; then get a token: 
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  //Once we have a token; include it in our response
  res.json({success: true, token: token, status: 'You are successfully logged in!'})
});


//Log out a user: Here we use 'get' as a user is not sending anything to the server ! 
router.get('/logout', cors.corsWithOptions, (req, res, next) => {
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
