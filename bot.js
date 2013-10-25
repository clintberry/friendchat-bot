var Domo = require('domo-kun');
var nconf = require('nconf');
var http = require('http');
var reddit = require('redwrap');
var request = require('request');
var moment = require('moment');

nconf.argv()
     .env()
     .file('config.json');


var config = {
   nick: 'hoggle2',
   userName: 'hoggle2',
   realName: 'Hoggle',
   address: 'irc.freenode.org',
   channels: [nconf.get('botchannel') + ' ' + nconf.get('botchannelpass')],
   users: [
     {
       username: nconf.get('botadminuser'),
       password: nconf.get('botadminpass')
     }
   ],
   debug: true
};


var domo = new Domo(config);
domo.route('Hello hoggle2', function(res) {
   this.say(res.channel, 'Well hello there ' + res.nick + '!');
});

domo.route('hoggle2 die', function(res) {
   this.say(res.channel, 'Go suck a wang, ' + res.nick + '... I am here to stay.');
});
domo.route('hoggle2 is Ben gay', function(res) {
   this.say(res.channel, 'I think we both know he loves to ski the slopes ' + res.nick + '!');
});


domo.route('!reddit hot', function(res) {
  var self = this;
  console.log(res);
  reddit.list('hot', function(err, data, response){
      console.log(data); //object representing the front page of reddit w/ 'hot' filter
      var i = 0;
      data.data.children.forEach(function(row) {
        if(i<5) {
          self.say(res.channel, row.data.title + ' - ' + row.data.url); 
        }
        i++;
      });
  });
});

domo.route('!espn :team', function(res) {
  var self = this;
  var utahId = 254;
  var byuId = 252;
  //var jazzId = ;

  var baseurl = 'http://api.espn.com/v1/sports/';

  var team = res.params.team;
  var sport = null;

  if(team.toLowerCase() == 'byu') {
    url = baseurl + 'football/college-football/teams/252/events/'
    sport = 'college-football';
  }

  else if(team.toLowerCase() == 'utah') {
    url = baseurl + 'football/college-football/teams/254/events/';
    sport = 'college-football';
  }

  else {
    self.say(res.channel, 'Sorry, I am not setup too look for ' + team);
    return;
  }

  url = url + '?apikey=' + nconf.get('espnkey');
  

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {


      var teamInfo = JSON.parse(body);
      var team1 = teamInfo.sports[0].leagues[0].events[0].competitions[0].competitors[1];
      var team2 = teamInfo.sports[0].leagues[0].events[0].competitions[0].competitors[0];

      var eventDescription = teamInfo.sports[0].leagues[0].events[0].competitions[0].status.description;
      var eventDetail = teamInfo.sports[0].leagues[0].events[0].competitions[0].status.detail;

      if(eventDescription.toLowerCase() == 'scheduled') {
        eventDetail = moment.utc(eventDetail).calendar();
      }
      self.say(res.channel, team1.team.nickname + ' (' + team1.team.record.summary + ') at ' + 
               team2.team.nickname + ' (' + team2.team.record.summary + ') ' + 
               eventDescription + ' ' + eventDetail);
    }
  });

});



domo.connect();

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen( process.env.PORT || 5000);
