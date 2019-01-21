'use strict';

var mongoose = require('mongoose');

var neewsFeedSchema = mongoose.Schema({
    author:String,
    title:String,
    url:String,
    urlToImage:String,
    publishedAt:String,
    content:String
});

module.exports = mongoose.model('NewsFeed',neewsFeedSchema);