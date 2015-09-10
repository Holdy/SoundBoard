var server     = require('./Server.js');
var background = require('./Background.js');

server.start(1212, ['/Users/chrisholden/Dropbox (Personal)/audio/fx/',
                    '/Users/chrisholden/Dropbox (Personal)/audio/intro/',
                    '/Users/chrisholden/Dropbox (Personal)/audio/voice/']);

if (background) {
    background.addTimed('ChurchBell', {minute: 0, clock: true, interval: 1.9});
    background.addTimed('TrainHorn', {minute: 30});

    background.addContinuous('Wind');
    background.addContinuous('Wind');

    background.addIntermittent('Chaffinch', {min: 7, max: 15});
    background.addIntermittent('Blackbird', {min: 7, max: 15});
    background.addIntermittent('Blackbird', {min: 7, max: 15});
    background.addIntermittent('WoodpeckerPeck', {min: 40, max: 300});
    background.addIntermittent('SongSparrow', {min: 10, max: 300});

    //  background.addIntermittent('WoodWarbler', {min: 20, max: 50});
 //   background.addIntermittent('Crow,Crow', {min: 20, max: 300});
 //  background.addIntermittent('Fly', {min: 40, max: 120});
}
