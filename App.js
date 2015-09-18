var server     = require('./Server.js');
var background = require('./Background.js');
var backgroundActive = true;

server.start(80, [{source:'../SoundBoardFX/'},
    {source:'../SoundBoardIntro/', tagAll:['intro']},
    {source:'../SoundBoardVoice/', tagAll:['voice']}]);

server.player.getTag('loud').triggerPlay('wait,PidgeonFlyAway&PidgeonsFlyAway');
server.player.getTag('loud').triggerSilent('bird',10);

server.player.getTag('intro').triggerSilent('bird',20);
server.player.getTag('voice').triggerSilent('bird',15);

if (backgroundActive) {
    // Played at a certain time.
    background.addTimed('ChurchBell', {minute: 0, clock: true, interval: 1.9});
    background.addTimed('TrainHorn', {minute: 30});

    // Played one after the other - good for wind, surf, rivers etc.
    // Use two for overlay and interplay!
    background.addContinuous('Wind');
    background.addContinuous('Wind');

    // Played with a gap of between min and max seconds.
    background.addIntermittent('Chaffinch',      {min: 7,  max: 15});
    background.addIntermittent('Blackbird',      {min: 7,  max: 15});
    background.addIntermittent('Blackbird',      {min: 7,  max: 15});
    background.addIntermittent('WoodpeckerPeck', {min: 40, max: 300});
    background.addIntermittent('SongSparrow',    {min: 10, max: 300});

    //  Annoying:
    //  background.addIntermittent('WoodWarbler', {min: 20, max: 50});
    //  background.addIntermittent('Crow,Crow', {min: 20, max: 300});
    //  background.addIntermittent('Fly', {min: 40, max: 120});
}
