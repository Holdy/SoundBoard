var http = require('http');
var url  = require('url');
var fileLoader = require('./FileLoader.js');
var player = require('./Player.js');

function start (port, directory) {

	if (directory instanceof Array) {
		directory.forEach(function (item) {
			fileLoader.loadFiles(item);
		});
	} else {
		fileLoader.loadFiles(directory);
	}

	http.createServer(function (req, res) {
	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end('OK');

	  if (req.url.indexOf('/play') != -1) {
	      var commandStart = req.url.lastIndexOf('?');
              var command = req.url.substring(commandStart+1);
		  	
	      player.process(command);
	   }
	}).listen(port);

	console.log('Server running on port :' + port);
	player.process('1212');
}

/*
function parseContexts(text) {
	var context = {};
	var items = text.toLowerCase().split('/');
	items.forEach(function (item){
		if (item.startsWith('vol')) {
			context.volume = getFirstNumber(item);
		}
	});
}

const numbers = '0123456789';
function getFirstNumber(text) {
	var number = null;
	if (text) {
		var matches = text.match(/\d+/);
		number = matches.length > 0 ? matches[0] : null;
	}
	return number;
}
*/

module.exports.start = start;
