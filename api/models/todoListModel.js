'use strict';

var mongoose = require('mongoose');

var registerSchema = mongoose.Schema({
    username:String,
    password:String,
    email:String,
    cellphone:String,
    country_code:String
});

var employeeSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    name:String,
    dateOfJoining:Date,
    dob:Date,
    house:String,
    email:String
});

module.exports = mongoose.model('Register',registerSchema);
module.exports = mongoose.model('Employee',employeeSchema,'employee');
