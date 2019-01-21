'use strict';

var mongoose = require('mongoose');

var registerSchema = mongoose.Schema({
    username:String,
    password:String,
    email:String,
    cellphone:String,
    country_code:String
});


module.exports = mongoose.model('Register',registerSchema);
