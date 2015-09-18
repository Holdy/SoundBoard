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

		if (req.method === 'GET') {

			if (req.url.indexOf('/play') != -1) {
				var commandStart = req.url.lastIndexOf('?');
				var command = req.url.substring(commandStart + 1);

				player.process(command);
			}
		}
	}).listen(port);

	console.log('Server running on port :' + port);
	player.process('1212');
}

module.exports.start  = start;
module.exports.player = player;
