var Domo = require('domo-kun');
var nconf = require('nconf');
var http = require('http');
var reddit = require('redwrap');
var request = require('')


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

  var url = 'http://api.espn.com/v1/sports/';

  var team = res.params.team;
  var sport = null;

  if(team.toLowerCase() == 'byu') {
    url = url + 'football/college-football/teams/252';
    sport = 'college-football';
  }

  if(team.toLowerCase() == 'utah') {
    url = url + 'football/college-football/teams/254';
    sport = 'college-football';
  }

  url = url + '?apikey=' + nconf.get('espnkey');

  request(url, function(err, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.stringify(body);
      info.sports[0].leagues[0].teams[0].name
      self.say(info.sports[0].leagues[0].teams[0].name + " - " + info.sports[0].leagues[0].teams[0].record.summary);
    }
  });

});



domo.connect();

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen( process.env.PORT || 5000);