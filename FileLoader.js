const soundType = require('./SoundType.js');
const fs = require('fs');

function loadFiles (info) {
    var rootDirectory = info.source;
    var fileNames = fs.readdirSync(rootDirectory);
	
    fileNames.forEach(function (item) {
	if (endsWith(item, '.mp3') || endsWith(item,'.wav')) {
		console.log('Found - ' + item); 
		soundType.addFile(rootDirectory + item, info);
	}
    });
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

module.exports.loadFiles = loadFiles;
