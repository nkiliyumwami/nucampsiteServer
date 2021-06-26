const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const partnerSchema = new Schema({
        name : {
            type: String,
            required: true,
            unique: true
        },
        image : {
            type: String,
            required: true
        },
        featured : {
            type: Boolean,
            default: false
        },
        description : {
            type: String,
            required: true
        }
    }, { timestamps: true
})


//Create a model and export it
const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;
