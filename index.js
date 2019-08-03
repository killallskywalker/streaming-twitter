require('dotenv').config()
const Twitter = require('twitter');
const Pusher = require('pusher');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//initialize Pusher
const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: true
});


var stream = client.stream('statuses/filter', {track: '#starwars'});

stream.on('data', function(event) {
  
  let text = ((!event['extended_tweet']) ? event.text : event.extended_tweet.full_text );

  let payload = {
  	text:text,
  	username:event.user.name,
  	profile_image_url:event.user.profile_image_url_https,
  }

  console.log(payload);

  pusher.trigger('twitterStream', 'tweet', payload );

});
 
stream.on('error', function(error) {
  console.log(error);
});