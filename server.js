var express = require('express');
//const router = express.Router();
var app = express();
var port = process.env.PORT || 3005;

var bodyparser = require('body-parser');
var mongoose = require('mongoose');


//var config = require('../config');

Notes = require('./api/models/todoListModel');
NewsFeed = require('./api/models/newsModel');



mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/myDB');
mongoose.connect('mongodb://srbhjdhv:srbhjdhv28@ds159641.mlab.com:59641/mydb');
var db = mongoose.connection;
mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //trying to get collection names
    mongoose.connection.db.collections(function (err, names) {
        // console.log(names); // [{ name: 'dbname.myCollection' }]
        module.exports.Collection = names;
    });
})
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    
});


var router = require('./api/routes/todoListRoutes');
var newsrouter = require('./api/routes/newsRoutes');
router(app);
newsrouter(app);

// module.exports = router;
// module.exports = newsrouter;
//Changes

app.listen(port,function(){
    console.log('Rest server is on'+port);
});


