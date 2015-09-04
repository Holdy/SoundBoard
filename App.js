var server     = require('./Server.js');
var background = require('./Background.js');

server.start(1212, '/Users/chrisholden/Dropbox (Personal)/audio/');

background.addTimed('TrainHorn',  {minute:30});
background.addTimed('ChurchBell', {minute:1, clock:true});

background.addIntermittent('Blackbird',      {min:7,  max:15});
background.addIntermittent('Blackbird',      {min:7,  max:15});
background.addIntermittent('WoodpeckerPeck', {min:10, max:30});
background.addIntermittent('SongSparrow',    {min:10, max:300});
background.addIntermittent('Crow,Crow',      {min:20, max:300});


