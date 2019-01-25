'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var authySID = "ACee54d4b97d6a5a6a9f0150315b897a07";
var authyToken = "a183d56a3f2411583f19690054716b76";
var authyKey = "GMr3VOXSiV16xP0umRDAHKOe4HAc6jA3";

const authy = require('authy')(authyKey);

var https = require('https');
var mongoose = require('mongoose'),
    Register = mongoose.model('Register'),
    Employee = mongoose.model('Employee'),
    Events = mongoose.model('Events'),
    EnrolledEvents = mongoose.model('EnrolledEvents');


exports.authorizeMe = function(req,res){
    console.log(req.query);
    var token = req.headers['x-access-token'];
    if(!token) return res.status(401).send({auth:false,message:'No token header'});

    jwt.verify(token,'secretKey',function(err,decoded){
        if(err) return res.status(401).send({auth:false,message:'Invalid token'});

        res.status(200).send(decoded);
    });
};

exports.getAllEmployeeData = function(req,res){
    console.log('setttt');
    Employee.find({},function(error,response){
            res.json(response);
    })
};

exports.getAllEventsData = function(req,res){
    var userId = req.query.userId;
    if(userId){
        EnrolledEvents.find({userId:userId},function(error,response){
            res.json(response);
        });
    }else{
        Events.find({},function(request,response){
            res.json(response);
        });
    }
    
};


exports.registerNewUser = function(req,res){
    console.log('username'+req.body.username);
    console.log('password'+req.body.password);
    console.log('email'+req.body.email);

    Register.findOne({email:req.body.email},function(error,user){
        if(!user){
            var  hashedPwd = bcrypt.hashSync(req.body.password,8);
            Register.create({
                username:req.body.username,
                password:hashedPwd,
                email:req.body.email
            }, function(error,user){
                if(error){
                    return res.status(500).send('Problem in registring');
                }else{
                    var token = jwt.sign({id:user._id},'secretKey',{expiresIn:86400});
                    res.status(200).send({auth:true,token:token});
                }
            });
        }else{
            return res.status(200).json({auth:false,message:'Email already registered'});
        }
    });
};

exports.registerPhoneNumner = function(req,res){
    console.log('req body'+JSON.stringify(req.body));
    var dataString = JSON.stringify(req.body);

    var header = {
        'Content-Type': 'application/json',
        'X-Authy-API-Key': authyKey
    };
    var options = {
        host:"api.authy.com",
        path:"/protected/json/users/new",
        method:"POST",
        headers:header
    };
    var request = https.request(options, function(httpres){
        httpres.setEncoding('utf-8');
        var body = "";
        httpres.on('data',function(data){
            body += data;
        });
        httpres.on('end', function() {
            console.log(body);
            var responseObject = JSON.parse(body);
            console.log('ended too'+JSON.stringify(responseObject));
            if(responseObject && responseObject.success){
                res.send({success:true,userId:responseObject.user.id});
                var otp = sendSMSToMobile(responseObject,res);
            }else{
                res.send({success:false,userId:""});
            }
        });
    });
    request.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });
    request.write(dataString);
    request.end();

};

exports.saveUserRelatedEvents = function(req,res){
    
    EnrolledEvents.findOne({userId:req.body.userId,eventId:req.body.eventId},function(error,recordPresnt){
        if(error) return res.status(500).send({auth:false,message:'Failed To save data'});
        if(recordPresnt){
            console.log(recordPresnt);
            return res.send({auth:false,message:'User is already enrolled to this event'});
        }else{
            var enrolledObj = new EnrolledEvents(req.body);
            enrolledObj.save(function(error,result){
                if(error) return res.status(500).send({auth:false,message:'Failed To save data'});
                return res.send({auth:true,message:'Data Inserted Successfully'});
            });
        }
    });
}

exports.login = function(req,res){
    console.log(req.body);
    Register.findOne({email:req.body.email},function(error,user){
        console.log(user);
        if(error) return res.status(500).send({auth:false,message:'Error in server'});
        if (!user) return res.status(404).send({auth:false,message:"Invalid User"});

        var comparePwd = bcrypt.compareSync(req.body.password,user.password);
        if(!comparePwd) return res.status(401).send({auth:false,message:"Invalid Password"});

        var token = jwt.sign({id:user._id},'secretKey',{expiresIn:86400});
        if(!token) return res.status(400).send({auth:false,message:"Invalid pwd"});

        //check user in Employee table
        Employee.findOne({email:user.email},function(error,employeeData){
            
            if(error) return res.status(500).send({auth:false,message:"Employee data not found"});
            return res.status(200).send({auth:true,token:token,userData:employeeData});
        });
    });
};

exports.getOTPandVerify = function(req,res){
    console.log(req.query);
    var requestedOTP = req.query.otp;
    var requestedUserId = req.query.userId;
    var header = {
        'Content-Type': 'application/json',
        'X-Authy-API-Key': authyKey
    };
    var options = {
        host:"api.authy.com",
        path:"/protected/json/verify/"+requestedOTP+'/'+requestedUserId,
        headers:header
    };
    console.log('optionss'+JSON.stringify(options));
    var body = "";
    var request = https.request(options,function(httpres){
        httpres.on('data',function(data){
            body += data
        });
        httpres.on('end',function(){
            var verifiedRes = JSON.parse(body);
            if(verifiedRes && verifiedRes.success){
                res.send({success:true,message:'Token is valid'})
            }else{
                res.send({success:false,message:"OTP registration failed"});
            }
        });
    });
    request.on('error',function(error){
        res.status(400).send({'success':false,error:error});
    });
    request.write('');
    request.end();
};

var sendSMSToMobile = function(responseObject){
    if(responseObject.user){
        var header = {
            'Content-Type': 'application/json',
            'X-Authy-API-Key': authyKey
        };
        var options = {
            host:"api.authy.com",
            path:"/protected/json/sms/"+responseObject.user.id,
            headers:header
        };
        var body = ""
        var request = https.request(options,function(httpres){
            httpres.on('data',function(data){
                body += data
            });
            httpres.on('end',function(){
                var smsResponse = JSON.parse(body);
                console.log('test otp data'+JSON.stringify(smsResponse));
                return smsResponse;
            });
        });
        request.on('error',function(error){
            console.log('service otp data'+JSON.stringify(error));
            return({'success':false,error:error});
        });
        request.write('');
        request.end();
    }
};

