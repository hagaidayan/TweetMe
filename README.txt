####TWEETME APP README#### 

js files - 
TweetMeService.js - the service's file.
config.js - a file consisted of the configuration of Twitter login credentials.

FUNCTIONALITY -
TweetMe is a web app that listens to REST calls on port 3000 and offers the following features - 

1. GET call on path "/searchTweets/*" (where '*' is any string)
with authentication headers - 
consumer_key, consumer_secret, access_token_key, access_token_secret
the service will interact Twitter API in order to query the top 10 recent tweets related to '*',
and upon success return it in a JSON format in HTML status code 200.
(a bad GET call will return a response regarding the unrecognized request)

an example of a call that should work - 
GET http://localhost:3000/searchTweets/nba
consumer_key = a8OaXJYacaRrzrQPEmvwDArCY
consumer_secret = SBGleBGPIhG6mIW8BHZCz5SgXRjfy9kNjrn4ltwEA7mqY2lpYh
access_token_key = 1092376884824952832-UZMqKrvoGkhD69iJ5wd9GxAXdMwVsX
access_token_secret = Iy4bpUww34sCKsmikMhbZq3ldVYIELfMPljz1Bc59gpgJ

2. POST call on path "/tweet"
with authentication headers - 
consumer_key, consumer_secret, access_token_key, access_token_secret
and body parameter {message: '*'}
the service will interact Twitter API in order to tweet the string '*'
by the account related on the app configured by the credentials in the request.

an example of a call that should work -
POST http://localhost:3000/tweet
consumer_key = a8OaXJYacaRrzrQPEmvwDArCY
consumer_secret = SBGleBGPIhG6mIW8BHZCz5SgXRjfy9kNjrn4ltwEA7mqY2lpYh
access_token_key = 1092376884824952832-UZMqKrvoGkhD69iJ5wd9GxAXdMwVsX
access_token_secret = Iy4bpUww34sCKsmikMhbZq3ldVYIELfMPljz1Bc59gpgJ
message = ahoy

TESTS - 
implemented by the end of the file using Chai testing framework

1. testGetUnrecognizedPath() - 
test the response upon a bad request

2. testSearchSuccess() - 
test the response upon a search request that should work

3. testSearchFailure() - 
test the response upon a search request that should not work

4. testTweet() - 
test the response upon any tweet request