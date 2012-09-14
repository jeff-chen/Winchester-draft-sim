var	http = require('http')
,	url = require('url')
,	fs = require('fs')
,	io = require('socket.io')
,	cmd = require('./cmd')
,	config = require('../../config')
;



var SRC = {
	http: './src/http/',
	css: './src/css/',
	js: './src/js/',
	img: './src/img/'
};

var HEAD_INFO = {
	html: {encoding: 'utf8', contentType: 'text/html'},
	css: {encoding: 'utf8', contentType: 'text/css'},
	js: {encoding: 'utf8', contentType: 'text/javascript'},
	swf: {encoding: 'binary', contentType: 'application/x-shockwave-flash'},
	jpg: {encoding: 'binary', contentType: 'image/jpeg'},
	png: {encoding: 'binary', contentType: 'image/png'}
};

var index = fs.readFileSync(SRC.http + "index.html");

var server = http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname;
	console.log('Request path: ' + path);
	var pieces = path.split('/');
	
	if(path === '/') {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(index);
		res.end();
	} else if(pieces[1] && pieces[1] === 'api') {
		dispatchAPI(path, pieces, res);
	} else if(pieces[2] != null) {
		dispatchURL(path, pieces, res);
	} else {
		res.end();
		console.log('Request null: ' + path);
	}
});

function dispatchURL(path, pieces, res) {
	var	head = HEAD_INFO[path.split('.').pop()],
		type = pieces[1];

	if(head) {
		res.writeHead(200, {'Content-Type': head.contentType});
		fs.readFile('./src' + path, head.encoding, function(err, data) {
			if(err) {
				res.end();
				throw err;
			} else {
				res.write(data, head.encoding);
				res.end();
			}
		});
	} else {
		res.end();
	}
}

function dispatchAPI(path, pieces, res) {
	var head = HEAD_INFO.html;

	res.writeHead(200, {'Content-Type': head.contentType});
	if(pieces[2] === 'getPort') {
		res.write('' + config.port, head.encoding);
		res.end();
	} else {
		res.end();
	}
}

exports.startServer = function(port) {
	port = port || 80;
	server.listen(port);
	
  console.log('listening on port: ' + port);
	var socket = io.listen(server);


	socket.configure(function() {
		socket.set('log level', config.loglevel);
		socket.set("transports", ["xhr-polling"]); 
	  socket.set("polling duration", 10);
	});
	
  
	socket.sockets.on('connection', function(client) {
		client.toString = function() { return client.id; };

		client.on('msg', function(message) {
			console.log('Socket ' + client + ': ' + message);
			var json = JSON.parse(message);
			cmd.dispatch(client, json);
		});
	});
}
