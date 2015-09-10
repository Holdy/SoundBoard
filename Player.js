var async     = require('async');
var exec      = require('child_process').exec;
var soundType = require('./SoundType.js');

var playFunction;

var defaultContext = {volume: 100};
var soundKeyToContextMap =  {
    blackbird: {volume: 50},
    1212: {volume:100},
    wind: {volume:10}

};

// Space + & all mean play at the same time.
// 'wait' means wait 1 second. Comma = play after (eg 'intro,name,name-theme').
function processCommands (command, callback) {
    if (command) {
        processItems(command.split(','), callback);
    }
}

function processItems (sequentialItems, finished) {
	async.eachSeries(sequentialItems,
            function (item, callback) {
                processItem(item, 0, callback);
            }, function(err){
                if (finished) {
                    finished();
                }
            });
}

function processItem (item, startIndex, finished) {
   var currentIndex = startIndex;
   var command = item;
   var commands = [];
   var builder = '';
   var char;
   while (currentIndex < command.length) {
        char = command[currentIndex];
	    if (char === ' ' || char === '+' || char === '&') {
            // Separates one sound from the next.
            if (builder.length > 0) {
                commands.push(builder);
            }
            builder = '';
        } else {
	        builder = builder + char;
	    }
	    currentIndex++;
    }
    if (builder.length > 0) {
	    commands.push(builder);
    }

    console.log('commands: ' + commands);

    async.each(commands,
	    function(command, commandFinished) {
	        if (command === '') {
		        commandFinished();
	        } else if (command === 'wait') {
		        setTimeout(commandFinished, 1000);
            } else {
		        var file = soundType.getFile(command);
                console.log('playing - ' + file);

                var soundContext = soundKeyToContextMap[command.toLowerCase()];
                if (!soundContext) {
                    soundContext = defaultContext;
                }
                if (!soundContext.volume) {
                    soundContext.volume = 100;
                }

                playFunction(file, soundContext, commandFinished);
            }
    	}, 
	function () {
	    finished();
	});
}

function range (percent, min, max) {
    var scale = percent / 100;
    var range = max - min;
    return min + (scale * range);
}

var playerByOS = {
    darwin:
        function (file, context, callback) {
            var volume = range(context.volume, 0, 1);
            console.log('Generic volume ' + context.volume + ' => ' + volume);
            exec('afplay --volume ' + volume + ' \'' + file + '\'', callback);
        },
    linux:
        function (file, context, callback) {
            var volume = range(context.volume, 1, 100);
            console.log('Generic volume ' + context.volume + ' => ' + volume);
            exec('mplayer -softvol -volume ' + volume + ' \'' + file + '\'', callback);
        }
};

playFunction = playerByOS[process.platform];

if (!playFunction) {
    console.log('Player not defined for [' + process.platform + ']');
}

module.exports.process = processCommands;
