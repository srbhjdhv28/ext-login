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

var eventSchema = mongoose.Schema({
    eventImg: String,
    eventType: String,
    eventName: String,
    eventDate: Date,
    eventTime: String,
    eventDescription:String
});

var enrolledEventSchema = mongoose.Schema({
   userId:String,
   eventId:String
});

module.exports = mongoose.model('Register',registerSchema);
module.exports = mongoose.model('Employee',employeeSchema,'employee');
module.exports = mongoose.model('Events',eventSchema,'events');
module.exports = mongoose.model('EnrolledEvents',enrolledEventSchema,'enrolledevents');
