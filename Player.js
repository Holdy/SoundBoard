var async     = require('async');
var exec      = require('child_process').exec;
var soundType = require('./SoundType.js');

var playFunction;

var defaultContext = {volume: 100};
var soundKeyToContextMap =  {
    blackbird: {volume: 50},
    1212: {volume:100},
    wind: {volume:30},
    churchbell: {volume:10},
    trainhorn: {volume:60},
    woodpeckerpeck: {volume:40}
};

var tagInfo = {};

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
		        var file = soundType.getFileInfo(command);

                var soundContext = soundKeyToContextMap[command.toLowerCase()];
                if (!soundContext) {
                    soundContext = defaultContext;
                }
                if (!soundContext.volume) {
                    soundContext.volume = 100;
                }

                if (!file) {
                    console.log('NO FILE for ' + command);
                }
                else if (canPlay(file)) {
                    processActions(file);
                    console.log('playing - ' + file.filePath);
                    playFunction(file.filePath, soundContext, commandFinished);
                } else {
                    console.log('skipping - ' + file.filePath);
                    commandFinished();
                }
            }
    	}, 
	function () {
	    finished();
	});
}

function processActions(fileInfo) {
    var tagInfo;
    if (fileInfo.tags && fileInfo.tags.length > 0) {
        fileInfo.tags.forEach(function (tag) {
            tagInfo = getTag(tag);
            tagInfo.playTriggers.forEach(function (item) {
                processCommands(item);
            })
            tagInfo.silentTriggers.forEach(function (item) {
                getTag(item.tag).silence (item.seconds);
                                });
        });
    }
}

function canPlay(fileInfo) {
    var result = true;
    var now = Date.now();
    var tagInfo;
    if (fileInfo && fileInfo.tags && fileInfo.tags.length > 0) {
        fileInfo.tags.forEach(function (tag) {
            tagInfo = getTag(tag);
            if (tagInfo.silentUntil && tagInfo.silentUntil > now) {
                result = false;
            }
        });
    }

    return result;
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

function getTag(tagName) {
    var tagOwner = this;
    var tag = tagInfo[tagName];
    if (!tag) {
        tag = {
            playTriggers: [],
            silentTriggers: [],
            triggerPlay : function (command) { this.playTriggers.push(command); },
            triggerSilent : function (tag ,seconds) {this.silentTriggers.push({'tag': tag, 'seconds': seconds});},
            silence : function(seconds) {
                var currentWait = this.silentUntil;
                var suggested = Date.now() + (seconds * 1000);
                if (currentWait) {
                    this.silentUntil = Math.max(suggested,currentWait);
                } else {
                    this.silentUntil = suggested;
                }
            }
        };
        tagInfo[tagName] = tag;
    }
    return tag;
}

module.exports.process = processCommands;
module.exports.getTag = getTag;
