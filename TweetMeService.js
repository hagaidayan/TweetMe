var Twitter  = require('twitter');
var express = require('express');
var app = express();
var config = require('./config.js');
var bodyParser = require("body-parser");
var chaiHttp = require('chai-http');
var chai = require('chai');
var expect = chai.expect;
var testFailMsg = 'failed in test: ';
var testSuccessMsg = 'success in test: ';

chai.use(chaiHttp);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//handle a tweet request
app.post('/tweet', function (req, res) {
    //set credentials
    setAppCredentials(req.headers.consumer_key, req.headers.consumer_secret, req.headers.access_token_key, req.headers.access_token_secret);
    // log in and tweet
    var client = new Twitter(config);
    client.post('statuses/update', {status: req.body.message}, function(error, tweet, response) {
        if (!error) {
            console.log('tweet success on: ' + req.body.message);
        }
        else{
            console.log('tweet failure on: ' + req.body.message);
            console.log(tweet);
        }
    });
    res.json({"response":"attempt tweet - " + req.body.message});
    res.end();
});


//handle a search request
app.get('/searchTweets/:searchKey', function (req, res) {
    //set credentials
    setAppCredentials(req.headers.consumer_key, req.headers.consumer_secret, req.headers.access_token_key, req.headers.access_token_secret);
    // log in and search
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
    //res.writeHead(200, {'Content-Type': 'text/event-stream', 'path': 'unrecognized'});
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



/////////////////////////////
////////    TESTS    ////////
/////////////////////////////


// test 1: get unrecognized path
testGetUnrecognizedPath = function() {
    var currentTest = 'get unrecognized path';
    chai.request(app)
        .get('/user/=')
        .type('form')
        .send({
            '_method': 'post',
            'password': '123',
            'confirmPassword': '123'
        })
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(JSON.stringify(res.body)).to.equal('{"response":"unrecognized request"}');
            console.log(testSuccessMsg + currentTest);
        }).catch(function (err) { // test failed
        console.log(testFailMsg + currentTest);
        console.log(err.message);
    });
}

// test 2: search Success
testSearchSuccess = function(){
    var currentTest = 'search success';
    chai.request(app)
        .get('/searchTweets/nba')
        .type('form')
        .set('consumer_key','a8OaXJYacaRrzrQPEmvwDArCY')
        .set('consumer_secret','SBGleBGPIhG6mIW8BHZCz5SgXRjfy9kNjrn4ltwEA7mqY2lpYh')
        .set('access_token_key','1092376884824952832-UZMqKrvoGkhD69iJ5wd9GxAXdMwVsX')
        .set('access_token_secret','Iy4bpUww34sCKsmikMhbZq3ldVYIELfMPljz1Bc59gpgJ')
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(JSON.stringify(res.body)).to.not.equal('{"errors":[{"code":32,"message":"Could not authenticate you."}]}');
            console.log(testSuccessMsg + currentTest);
        }).catch(function (err) { // test failed
        console.log(testFailMsg + currentTest);
        console.log(err.message);
    });
}

// test 3: search Failure - Bad Authentication
testSearchFailure = function(){
    var currentTest = 'search failure';
    chai.request(app)
        .get('/searchTweets/nba')
        .type('form')
        .set('consumer_key','a8OaXJYacaRrzrQPEmvwDArC') // bad key
        .set('consumer_secret','SBGleBGPIhG6mIW8BHZCz5SgXRjfy9kNjrn4ltwEA7mqY2lpYh')
        .set('access_token_key','1092376884824952832-UZMqKrvoGkhD69iJ5wd9GxAXdMwVsX')
        .set('access_token_secret','Iy4bpUww34sCKsmikMhbZq3ldVYIELfMPljz1Bc59gpgJ')
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            //console.log(JSON.stringify(res.body));
            expect(JSON.stringify(res.body)).to.equal('{"errors":[{"code":32,"message":"Could not authenticate you."}]}');
            console.log(testSuccessMsg + currentTest);
        }).catch(function (err) { // test failed
        console.log(testFailMsg + currentTest);
        console.log(err.message);
    });
}

testTweet = function(){
    var currentTest = 'tweet attempt';
    chai.request(app)
        .post('/tweet')
        .type('form')
        .set('consumer_key','a8OaXJYacaRrzrQPEmvwDArCY')
        .set('consumer_secret','SBGleBGPIhG6mIW8BHZCz5SgXRjfy9kNjrn4ltwEA7mqY2lpYh')
        .set('access_token_key','1092376884824952832-UZMqKrvoGkhD69iJ5wd9GxAXdMwVsX')
        .set('access_token_secret','Iy4bpUww34sCKsmikMhbZq3ldVYIELfMPljz1Bc59gpgJ')
        .send({message:'hello'})
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            //console.log(JSON.stringify(res.body));
            expect(JSON.stringify(res.body)).to.equal('{"response":"attempt tweet - hello"}');
            console.log(testSuccessMsg + currentTest);
        }).catch(function (err) { // test failed
        console.log(testFailMsg + currentTest);
        console.log(err.message);
    });
}



/////////////////////////////
/////    TESTS calls    /////
/////////////////////////////

//testGetUnrecognizedPath();
//testSearchSuccess();
//testSearchFailure();
//testTweet();