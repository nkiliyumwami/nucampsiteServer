const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Create user schema 
const userSchema = new Schema({
    admin:{
        type: Boolean,
        default: false
    }
});

//Plugin the Plugin 
userSchema.plugin(passportLocalMongoose);

//Create a model and export it(new way!)
module.exports = mongoose.model('User', userSchema);

// //The above is the same as this code below: 
// const User = mongoose.model('User', userSchema);
// module.exports = User;