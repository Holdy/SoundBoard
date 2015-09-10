var schedule = require('node-schedule');
var player = require('./Player.js');

function addIntermittent (soundKey, config) {
    channel(soundKey, config.min || 5, config.max || 20);
}

function addContinuous(soundKey) {
    playAndRepeat(soundKey);
}

function playAndRepeat(soundKey) {
    player.process(soundKey, function () {
        playAndRepeat(soundKey);
    });
}

function channel (soundName,min,max) {
    var minMS = min * 1000;
    var maxMS = max * 1000;
    var range = maxMS - minMS;
    runChannel(soundName, function () {
        var pause = randomBetweenOneAnd(range);
        return (pause + minMS);
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
    rule.minute = config.minute;
    var j = schedule.scheduleJob(rule, function(){
        if ( config.clock ) {
            playOnceForEachHour(soundKey, config.interval);
        } else {
            player.process(soundKey);
        }
    });
}

function playOnceForEachHour(soundKey, interval) {
    var d = new Date();
    var n = d.getHours();
    if (n > 12) {
        n -= 12;
    }

    if (interval) {
        var intervalMS = interval * 1000;
        var timeout = 0;
        for (i = 0; i < n; i++) {
            setTimeout(function (){player.process(soundKey)}, timeout);
            timeout += intervalMS;
        }

    } else {
        var command = '';
        for (i = 0; i < n; i++) {
            command = command + soundKey + ',';
        }
        player.process(command);
    }
}

module.exports.addIntermittent = addIntermittent;
module.exports.addTimed        = addTimed;
module.exports.addContinuous   = addContinuous;
