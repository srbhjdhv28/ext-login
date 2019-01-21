'use strict';

module.exports = function(app){
var newsFeedController = require('../controllers/newsFeedController');

app.route('/getNewsFeed').get(newsFeedController.getNewsFeed);
app.route('/postGetNewsFeed').post(newsFeedController.postGetNewsFeed);

};
