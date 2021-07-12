const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsites'
    }]

},{timestamps: true});

//Create a model 
const Favorite = mongoose.model('Favorite', favoriteSchema);

//Export the model/module 
module.exports = Favorite;