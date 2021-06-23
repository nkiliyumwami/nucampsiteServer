const express = require('express');
//Import the Campsite Model
const Campsite = require('../models/campsite');

//Create express Router
const campsiteRouter = express.Router();

//Start the routing and add RestApi support endpoints routing method using MongoDB  
campsiteRouter.route('/')
.get((req, res, next)=> {
    //Get all campsites
    Campsite.find()
    .then(campsites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites)
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
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
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites`);
})
.delete((req, res, next) => {
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
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite) 
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res, next)=> {
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
.delete((req, res, next) => {
    //Delete a particular campsite by Id
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response)
    })
    .catch(err => next(err));
})

//Export the module so it can be used elsewhere
module.exports = campsiteRouter;

