var 	gnucard = require('./src/nodejs/server')
,	config = require('./config')
,	game = require('./src/nodejs/game');

gnucard.startServer(config.port);
