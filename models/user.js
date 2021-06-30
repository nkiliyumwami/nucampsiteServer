const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create user schema 
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        default: false
    }
});


//Create a model and export it(new way!)
module.exports = mongoose.model('User', userSchema);

// //The above is the same as this code below: 
// const User = mongoose.model('User', userSchema);
// module.exports = User;