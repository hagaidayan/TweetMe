var Twitter  = require('twitter');
var express = require('express');
var app = express();
var config = require('./config.js');



//handle a tweet request
app.get('/tweet/:message/:consumer_key/:consumer_secret/:access_token_key/:access_token_secret', function (req, res) {
    //set credentials
    setAppCredentials(req.params.consumer_key, req.params.consumer_secret, req.params.access_token_key, req.params.access_token_secret);
    var client = new Twitter(config);
    client.post('statuses/update', {status: req.params.message}, function(error, tweet, response) {
        if (!error) {
            console.log('tweet success on: ' + req.params.message);
        }
        else{
            console.log('tweet failure on: ' + req.params.message);
            console.log(tweet);
        }
    });
    res.json({"response":"twittes: " + req.params.message});
    res.end();
});


//handle a search request
app.get('/searchTweets/:searchKey/:consumer_key/:consumer_secret/:access_token_key/:access_token_secret', function (req, res) {
    setAppCredentials(req.params.consumer_key, req.params.consumer_secret, req.params.access_token_key, req.params.access_token_secret);
    var client = new Twitter(config);
    var searchparams = setSearchParams(req.params.searchKey); // parse search key, and get search parameters
    console.log('search request on: ' + req.params.searchKey);
    client.get('search/tweets', searchparams, function(error, tweets, response) {
        res.json(tweets);
        res.end();
    });
});


//handle an unrecognized request
app.get('*', function (req, res) {
    console.log('unrecognized request');
    res.json({"response":"unrecognized request"});
    res.end();
});

// make app listen on port 3000
app.listen(3000, process.env.IP, function(){
    console.log('server has started');
});

setSearchParams = function(searchKey){
    return {// Set up search parameters
        q: searchKey,
        count: 10,
        result_type: 'recent',
        lang: 'en'
    };
}

setAppCredentials = function(cKey, cSecret, atKey, atSecret){
    config.consumer_key = cKey;
    config.consumer_secret = cSecret;
    config.access_token_key = atKey;
    config.access_token_secret = atSecret;
}