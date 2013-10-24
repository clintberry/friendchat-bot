var Domo = require('domo-kun');
var config = require('./config');

var domo = new Domo(config);
domo.route('Hello hoggle2', function(res) {
   this.say(res.channel, 'Well hello there ' + res.nick + '!');
});
domo.connect();