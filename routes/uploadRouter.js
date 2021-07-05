const express = require('express');
const multer = require('multer');
const authenticate = require('../authenticate');
const cors = require('./cors');

//Configigure multer: custom configuration 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname) //This will make sure the name of image on server and client is the same
    }
});

const imageFileFilter = (req, file, cb) => {
    //Make sure file extension is jpg, jpeg,png and git
    if(!file.originalname.match(/\.(jpg|jpeg|png|git)$/)) {
        return cb(new Error(`You can upload only images files!`), false);
    }
    cb(null, true);// Here there is not error(null) and multer can accept the upload(true)
};

//Call the multer function 
const upload = multer({storage: storage, fileFilter: imageFileFilter});

//Enabling file upload : and configure routes
const uploadRouter = express.Router();

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //Pre-flight requests
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
   res.statusCode = 403;
   res.end(`GET operations not supported on /imageUpload`); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
   res.statusCode = 403;
   res.end(`PUT operations not supported on /imageUpload`); 
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
   res.statusCode = 403;
   res.end(`DELETE operations not supported on /imageUpload`); 
});


module.exports = uploadRouter;