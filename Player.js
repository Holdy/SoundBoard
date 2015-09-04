var async     = require('async');
var exec      = require('child_process').exec;
var soundType = require('./SoundType.js');

var playFunction;

// Space + & all mean play at the same time.
// 'wait' means wait 1 second. Comma = play after (eg 'intro,name,name-theme').
function processCommands (command) {
    if (command) {
        processItems(command.split(','), 0);
    }
}

function processItems (sequentialItems) {
	async.eachSeries(sequentialItems,
            function (item, callback) {
                processItem(item, 0, callback);
            }, function(err){
            });
}

function processItem (item, startIndex, finished) {
   console.log('processItem - ' + item);
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
                playFunction(file, commandFinished);
            }
    	}, 
	function () {
	    finished();
	});
}

var playerByOS = {
    darwin: function (file, callback) {
        exec('afplay \'' + file + '\'', callback);
    },
    linux:  function (file, callback) {
        exec('mplayer \'' + file + '\'', callback);
    }
};

playFunction = playerByOS[process.platform];

if (!playFunction) {
    console.log('Player not defined for [' + process.platform + ']');
}

module.exports.process = processCommands;
