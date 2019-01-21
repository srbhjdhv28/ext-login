'use strict';
var mongoose = require('mongoose'),
    NewsFeed = mongoose.model('NewsFeed');

exports.getNewsFeed = function(req, res) {
    NewsFeed.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };

  exports.postGetNewsFeed = function(req, res) {
    var jsonObj = {"author":"Dhiraj","title":"Bitcoin Price Watch: BTC’s Trend Overwhelmingly Bearish Below $3,600","url":"https://www.newsbtc.com/2019/01/21/bitcoin-price-watch-btcs-trend-overwhelmingly-bearish-below-3600/","urlToImage":"https://www.newsbtc.com/wp-content/uploads/2018/08/techanalysis-btc7-bearish.jpg","publishedAt":"2019-01-21T06:45:02Z","content":"Bitcoin price failed to break the $3,750 resistance and declined sharply against the US Dollar.\\r\\nThere was a break below a crucial bullish trend line with support at $3,620 on the hourly chart of the BTC/USD pair (data feed from Kraken).\\r\\nThe price is\\n current… [+1906 chars]"}; 
    var saveObj = new NewsFeed(jsonObj);
    
    saveObj.save(function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };