const express = require('express');

//Import the model 
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');
const cors = require('./cors');

//Create a router 
const promotionRouter = express.Router();

//RestAPI routing endpoints 
promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //Pre-flight requests
.get(cors.cors,(req, res, next)=> {
    //Get all the promotions
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Create a new promotion from the request body 
    Promotion.create(req.body)
    .then(promotion => {
        console.log('Promotion Created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    //PUT OPERATION NOT SUPPORTED IN THIS CASE
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Delete all the promotions
    Promotion.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//REST API Endpoints with parameters
promotionRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //Pre-flight requests
.get(cors.cors,(req, res, next)=> {
    //Get a specific promotion 
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    //POST OPERATION NOT SUPPORTED IN THIS CASE 
    res.statusCode = 403;
    res.end(`Post operation not supported on /promotions/${req.params.promotionId}`)
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    //Update a specific promotion: by Id 
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, {new: true})
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    //Delete all the promotions 
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = promotionRouter;