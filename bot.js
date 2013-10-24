var Domo = require('domo-kun');
var nconf = require('nconf');

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