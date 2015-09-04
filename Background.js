var schedule = require('node-schedule');
var player = require('./Player.js');

function addIntermittent (soundKey, config) {
    channel(soundKey, config.min || 5, config.max || 20);
}

function channel (soundName,min,max) {
    var range = max - min;
    runChannel(soundName, function () {
        var pause = randomBetweenOneAnd(range);
        return (pause + min) * 1000;
    });
}

function runChannel (soundName, pauseTime) {
    setTimeout (function () {
        player.process(soundName);
        runChannel(soundName, pauseTime);
    }, pauseTime());
}

function randomBetweenOneAnd(x) {
    return Math.floor((Math.random() * x) + 1);
}

function addTimed (soundKey, config) {
    var rule = new schedule.RecurrenceRule();
    rule.minute = config.minute || null;
    var j = schedule.scheduleJob(rule, function(){
        if ( config.clock ) {
            playOnceForEachHour(soundkey);
        } else {
            player.process(soundKey);
        }
    });
}

function playOnceForEachHour(soundKey) {
    var d = new Date();
    var n = d.getHours();
    if (n > 12) {
        n -= 12;
    }
    var command = '';
    for (i=0; i < n; i++) {
        command = command + soundKey + ',';
    }
    player.process(command);
}

module.exports.addIntermittent = addIntermittent;
module.exports.addTimed        = addTimed;
