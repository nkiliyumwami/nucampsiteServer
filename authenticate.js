const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign and verify token 
const FacebookTokenStrategy = require('passport-facebook-token');

//Import the config file
const config = require('./config.js'); 


//Implementing the local strategy 
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //To deal with session in passport
passport.deserializeUser(User.deserializeUser()); //To deal with session in passport

exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600})
};

//Implementing JWT Strategy for passport
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


//Export Jwt Strategy
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        //verify callback function
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if(err) {
                    return done(err, false);
                } else if (user) {
                    //No error(null), user found
                    return done(null, user);
                } else {
                    //No error and no user found(null for error and false for user)
                    return done(null, false);
                }
                //Then if you want you can create a new user here
            });
        }
    )
);

//Verify if incoming request is from authenticated user
exports.verifyUser = passport.authenticate('jwt', {session: false});

//Week Assignment Task 1
exports.verifyAdmin = (req, res, next) => {
    //If user is admin
    if(req.user.admin) {
        return next();
    } else {
        const err = new Error(`You are not authorized to perform this operation`);
        err.status = 403;
        return next(err);
    }
};

//Export facebook strategy 
exports.facebookPassport = passport.use(
    new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      //Check if we have this user in our database 
      User.findOne({facebookId: profile.id}, (err, user) => {
          if(err) {
              return done(err, false)
          } if(!err && user) {
              return done(null, user); //If there is no error and user exist in database
          } else {
            //There is no error and there is no user: so we create a new user
            user = new User({username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if(err) {
                    return done(err, false)
                } else {
                    return done(null, user)
                }
            })
        }
      })  
    }
    )
)

