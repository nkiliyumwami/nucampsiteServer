const express = require('express');
//Import the Campsite Model
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');

//Create express Router
const campsiteRouter = express.Router();

//Start the routing and add RestApi support endpoints routing method using MongoDB  
campsiteRouter.route('/')
.get((req, res, next)=> {
    //Get all campsites
    Campsite.find()
    .populate('comments.author')
    .then(campsites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites)
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    //Create a new campsite from the request body: the (next) fx is for error handling
    Campsite.create(req.body)
    .then(campsite => {
        console.log(`Campsite Created`, campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites`);
})
.delete(authenticate.verifyUser,(req, res, next) => {
    //Delete all campsites
    Campsite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response)
    })
    .catch(err => next(err));
});


//Adding RestAPI endpoints with parameters
campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
    //Get a particular campsite(here by id)
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite) 
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put(authenticate.verifyUser,(req, res, next)=> {
    //Update a particular campsite by Id
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, {new: true})
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite)  
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser,(req, res, next) => {
    //Delete a particular campsite by Id
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response)
    })
    .catch(err => next(err));
});

//Adding RestAPI endpoints with parameters to access a subdocument(comment)
campsiteRouter.route('/:campsiteId/comments')
.get((req, res, next) => {
    //Get a single campsite and return all comments for this campsite
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
      //Check if campsite exist
      if(campsite) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(campsite.comments);
      }  else {
          //If compsite does't exist: error handling
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
      } 
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    //Add a new comment to a particular campsite
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if(campsite) {
            //Add an id of user who post/submited  a comment in the author field 
            req.body.author = req.user._id;
            //Push a new comment into comments array
            campsite.comments.push(req.body);
            //Save the comment into database
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err))
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if(campsite) {
           //Delete every comment in comments array: using for loop
           for(let i = (campsite.comments.length-1); i >= 0; i--) {
              campsite.comments.id(campsite.comments[i]._id).remove(); 
           }
           //Save th changes to the database
           campsite.save()
           .then(campsite => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(campsite);
           })
           .catch(err => next(err)); 
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

//Endpoints for requests for a specific comment for a specific campsite
campsiteRouter.route('/:campsiteId/comments/:commentId')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
        //Check if campsite and comment are not null/exist 
        if(campsite && campsite.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments.id(req.params.commentId))
        } else if(!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        } else {
            //If campsite exist by comment is null
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err); 
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`);
})
.put(authenticate.verifyUser,(req, res, next) => {
   Campsite.findById(req.params.campsiteId)
   .then(campsite => {
       if(campsite && campsite.comments.id(req.params.commentId)) {
           if(req.body.rating) {
               campsite.comments.id(req.params.commentId).rating = req.body.rating;
           }
           if(req.body.text) {
               campsite.comments.id(req.params.commentId).text = req.body.text;
           }
           campsite.save()
           .then(campsite => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(campsite);
           })
           .catch(err => next(err));
       } else if(!campsite) {
           err = new Error(`Campsite ${req.params.campsiteId} not found`);
           err.status = 404;
           return next(err);
       } else {
           err = new Error(`Comment ${req.params.commentId} not found`);
           err.status = 404;
           return next(err);
       }
       
   })
   .catch(err => next(err)) 
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if(campsite && campsite.comments.id(req.params.commentId)) {
            campsite.comments.id(req.params.commentId).remove();
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else if(!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

//Export the module so it can be used elsewhere
module.exports = campsiteRouter;

