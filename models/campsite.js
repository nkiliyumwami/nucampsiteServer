const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

//Create comment schema as a subdocument of campsite 
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true
});

//Create campsite schema
const campsiteSchema = new Schema({
    name: {
            type: String,
            required: true,
            unique: true
        },
    description: {
            type: String,
            required: true
        },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema] //We add a subdocument
    }, {
    timestamps: true
});

//Create a model
const Campsite = mongoose.model('Campsite', campsiteSchema);

//Export the model/module 
module.exports = Campsite;