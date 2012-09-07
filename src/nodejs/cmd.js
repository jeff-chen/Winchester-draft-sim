var	game = require('./game'),
	sys = require('sys'),
	util = require('./util');

var COMMANDS = {};

function calljs(client, msg) {
	var msg = JSON.stringify(msg);
	sys.log(msg);
	client.emit('msg', msg);
}

function callalljs(list, msg) {
	var msg = JSON.stringify(msg);
	sys.log(msg);
	
	for(c in list) {
		list[c].emit('msg', msg);
	}
}

function runCmd(client, funcName, args) {
	var func = COMMANDS[funcName];

	if(func) {
		func(client, args);
	} else {
		calljs(client, ['notify', {message: 'Function ' + funcName + ' not found!'}]);
	}
}

exports.calljs = calljs;

exports.callalljs = callalljs;

exports.dispatch = function (client, json) {
	var funcName = json[0];
	var args = json[1];
	args['client'] = client;

	runCmd(client, funcName, args);
};

COMMANDS.logon = function(client, args) {
	var	g = game.games[args.game],
		p = game.namesToPlayers[args.name];

	if(g) {
		if(p) {
			if(args.namepass === p.pass && args.gamepass === g.pass) {
				p.client = client;
				g.clientsToPlayers[client] = p;
				g.clientsToClients[client] = client;
				g.namesToClients[args.name] = client;
				game.clientsToGames[client] = g;
				if(!g.namesToCards[args.name]) {
					g.namesToCards[args.name] = [];
				}
				if(!g.playerPiles[args.name]) {
					g.playerPiles[args.name] = [];
				}
				calljs(client, ['logon', {admin: (g.admin === p.name)}]);
				callalljs(g.clients(), ['add_player', {name: args.name, admin: (g.admin === p.name)}]);
				COMMANDS.updateCards(client);
			} else {
				calljs(client, ['notify', {message: 'Wrong game or user pass!'}]);
			}
		} else {
			if(args.gamepass === g.pass) {
				p = new game.Player(args.name, args.namepass);
				game.namesToPlayers[args.name] = p;
				g.clientsToPlayers[client] = p;
				g.clientsToClients[client] = client;
				g.namesToClients[args.name] = client;
				game.clientsToGames[client] = g;
				g.namesToCards[args.name] = [];
				g.playerPiles[args.name] = [];
				calljs(client, ['logon', {}]);
				callalljs(g.clients(), ['add_player', {name: args.name}]);
				COMMANDS.updateCards(client);
			} else {
				calljs(client, ['notify', {message: 'Wrong game pass!'}]);
			}
		}
	} else {
		g = new game.Game(args.game, args.gamepass, args.name);
		game.games[args.game] = g;
		
		if(!p) {
			p = new game.Player(args.name, args.namepass);
			game.namesToPlayers[args.name] = p;
		}

		g.clientsToPlayers[client] = p;
		g.clientsToClients[client] = client;
		g.namesToClients[args.name] = client;
		game.clientsToGames[client] = g;
		g.namesToCards[args.name] = [];
		g.playerPiles[args.name] = [];
		calljs(client, ['logon', {admin: true}]);
		callalljs(g.clients(), ['add_player', {name: args.name, admin: true}]);
		COMMANDS.updateCards(client);
	}
};


COMMANDS.updateCards = function(client, args) {
	var	g = game.clientsToGames[client];

	for(k in g.namesToCards) {
		calljs(client, ['add_player', {name: k}]);
		for(j in g.namesToCards[k]) {
			calljs(client, ['create_card', {player: k, id: g.namesToCards[k][j]}]);
		}
	}
};

COMMANDS.disconnect = function(client, args) {
	var g = game.clientsToGames[client];

	delete g.clientsToPlayers[client];
	delete g.clientsToClients[client];
	delete game.clientsToGames[client];
};

COMMANDS.removePlayer = function(client, args) {
	var	g = game.clientsToGames[client],
		a = g.remove(args.name),
		c = a[0],
		p = a[1];
	
	calljs(c, ['notify', {message: 'You have been removed from the game!'}]);
	callalljs(g.clients(), ['remove_player', {name: args.name}]);
};

COMMANDS.draw = function(client, args) {
	var	g = game.clientsToGames[client],
		p = g.clientsToPlayers[client],
		abc = g.pile.pop(),
		c = g.deck.pop(),
		n = args.name || p.name;

	sys.log(sys.inspect(g.namesToCards));
	sys.log(sys.inspect(abc));
	//sys.log(sys.inspect(p));
  //sys.log(sys.inspect(g.pile));
	if(!c) {
		if(g.deck.length > 0) {
			COMMANDS.draw(client, args);
		}
	} else {
		sys.log('Card: ' + c);
		g.namesToCards[n].push(c);
		g.playerPiles[n].push(abc);
		sys.log(sys.inspect(g.playerPiles));
		callalljs(g.clients(), ['create_card', {player: n, id: c}]);
	}
};

COMMANDS.reset = function(client, args) {
	var	g = game.clientsToGames[client];

	g.reset();
	callalljs(g.clients(), ['reset', {}]);
};
