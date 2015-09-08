// A sound type has a key, eg 'woodpecker',
// there may then be a number of audio files, which can be 
// played when this sound is requested.
//
// files - array of paths to the sounds for this SoundType.
// tags - amalgamated tags for this sound type. (specified after 
// filename.

var registry = {};


function findOrCreate (key) {
    var cleanKey = key.toLowerCase();
    var item = registry[cleanKey];
    if (!item) {
    	item = {};
        item.files = [];
        item.tags  = [];
	registry[cleanKey] = item;
    }

    return item;
}

 // player a,b,c - plays a then b then c.
 // play a,b&c - plays a then b and c.
 // play a,b&..c - plays a then b and c 2 seconds afterwards.
 // church bell for 3pm: ChurchBell.ChurchBell.ChurchBell

function addFile (filePath) {
    var pathEnd = filePath.lastIndexOf('/'); // TODO should be platform specific.
    if (pathEnd != -1) {
	    var fileName = filePath.substring(pathEnd+1);
	    var nameEnd = fileName.indexOf('.');
	    var key;     
	    if (nameEnd != -1) {
		    key = fileName.substring(0, nameEnd);
		    var lastDot = fileName.lastIndexOf('.');
		    var tags = parseTags(fileName.substring(nameEnd+1, lastDot));
		    var soundType = findOrCreate(key);
		    console.log('Adding key ['+key+']');
		    console.log('Tags ['+tags+']');
            addAll(soundType.tags, tags);
            var fileInfo = {'filePath': filePath, 'tags': tags};
            soundType.files.push(fileInfo);
	    }
     }
}

function addAll (target, items) {
    if (items) {
    	items.forEach(function (item){
            addIfNotPresent(target, item);
        });
    }
}

function parseTags(tags) {
    console.log('processing-'+tags);
    var result = [];
    if (tags) {
        tags.split('.').forEach(function (tag){
            addIfNotPresent(result, tag);
        });
    }

    return result;
}

function addIfNotPresent (array, item) {
    if (array.indexOf(item) == -1) {
        array.push(item);
    }
}

function getFile (keyAndTags) {
    var key = keyAndTags;
    var tags;
    var split = keyAndTags.indexOf('.');
    if (split == -1) {
        key = keyAndTags;
    } else {
        key = keyAndTags.substring(0,split);
        tags = parseTags(keyAndTags.substring(split+1));
    }

    var cleanKey = key.toLowerCase();
    var item = registry[cleanKey];
    var result = null;
    if (item) {
        var selection;
        if (tags && tags.length > 0) {
            selection = item.files.filter(function (item) {
                var matchedTags = 0;
                tags.forEach(function (tag) {
                    if (item.tags.indexOf(tag) != -1) {
                      matchedTags++;
                    };
                });
                return matchedTags == tags.length;
            });
        } else {
            selection = item.files;
        }
    	var fileCount = selection.length;
        if (fileCount > 0) {
            result = selection[randomBetweenOneAnd(fileCount)-1];
            result = result.filePath;
        }
    }
    return result;
}

function randomBetweenOneAnd(x) {
    return Math.floor((Math.random() * x) + 1); 
}

module.exports.findOrCreate = findOrCreate;
module.exports.addFile = addFile;
module.exports.getFile = getFile;
