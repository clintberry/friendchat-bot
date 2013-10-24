var Domo = require('domo-kun');
var nconf = require('nconf');
var http = require('http');

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
domo.connect();


http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen( process.env.PORT || 5000);