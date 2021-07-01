const express = require('express');
const partnerRouter = express.Router();

//Import the model
const Partner = require('../models/partner');
const authenticate = require('../authenticate');

//Routing
partnerRouter.route('/')
.get((req, res, next) => {
    //Get all partners
    Partner.find()
    .then(partners => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners)
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    //Create a new partner from the request body
    Partner.create(req.body)
    .then(partner => {
        console.log(`Partner Created`, partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser,(req, res) => {
    //PUT OPERATION NOT SUPPORTED IN THIS CASE
    res.statusCode = 403;
    res.end(`PUT operation not supported on /partners`);
})
.delete(authenticate.verifyUser,(req, res, next) => {
    //Delete all the partners
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//REST API Endpoints with parameters
partnerRouter.route('/:partnerId')
.get((req, res, next) => {
    //Get a partner by Id from request body
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req, res) => {
    //POST NOT SUPPORTED IN THIS CASE 
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put(authenticate.verifyUser,(req, res, next) => {
    //Update a partner content : "new: true"=> this to be able to show the update partner
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, {new: true})
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err))

})
.delete(authenticate.verifyUser,(req, res, next) => {
    //Delete a specific partner : by Id
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = partnerRouter;