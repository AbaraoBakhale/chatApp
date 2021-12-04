
const mongoose = require('mongoose');
var validator = require('validator');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true,
        unique:[true,"email already exit"],
        // validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        // validate: [ validator.isEmail, 'invalid email' ]
    },
    password: {
        type: String,
        required:true

    },
    age: {
        type: Number,
        required:true

    },
    phone: {
        type: Number,
        required:true

    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    }


})
module.exports = mongoose.model('Users', userSchema);