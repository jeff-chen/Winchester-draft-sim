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
	//TODO: reject a logon if a game is started already
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
				COMMANDS.updateView(client,args);
			} else {
				calljs(client, ['notify', {message: 'Wrong game or user pass!'}]);
			}
		} else {
			if(args.gamepass === g.pass) {
				if(g.gameIsStarted){ //TODO: check here that theres at least one player
					calljs(client, ['notify', {message: 'That game is already started!'}]);
				} else {
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
				  COMMANDS.updateView(client,args);
				}
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
		COMMANDS.updateView(client,args);
	}
};

COMMANDS.startGame = function(client, args){
	var g = game.clientsToGames[client];
	g.start(args.mode);
	COMMANDS.updateView(client, args);
	if(g.gameIsStarted){
		COMMANDS.hideStartButton(client, args);
	}
}

COMMANDS.hideStartButton = function(client,args){
	var g = game.clientsToGames[client];
	callalljs(g.clients(), ['hide_start_button', {}]);
}


COMMANDS.updateView = function(client, args){
	var g = game.clientsToGames[client];
	
	if(g.gameIsStarted){
  	COMMANDS.updateAllPiles(client, args);
	  COMMANDS.updatePlayerPiles(client, args);
	  COMMANDS.updateActivePlayer(client, args);
  }
}

COMMANDS.updatePlayerPiles = function(client, args){
	var	g = game.clientsToGames[client];
	
	var piles = g.playerPiles;

	for(var playername in piles){
		var tempclient = g.namesToClients[playername];
		var playerspile = piles[playername];
		calljs(tempclient, ['update_player_piles', {playerspile:playerspile}]);
	}
}

COMMANDS.updateAllPiles = function(client, args){
	var	g = game.clientsToGames[client];
	piles = g.piles;
	callalljs(g.clients(), ['update_all_piles', {piles:piles}]);
}

COMMANDS.updateActivePlayer = function(client, args){
	var	g = game.clientsToGames[client];
	var ap = g.activePlayer;
	var piles = g.playerPiles;
	labeltext = ("It's " + ap + "'s turn!");
	for(var playername in piles){
		if(playername == ap){
			calljs(g.namesToClients[playername], ['update_active_player', {labeltext:labeltext}]);
		} else {
			calljs(g.namesToClients[playername], ['update_inactive_player', {labeltext:labeltext}]);
		}
	}
}

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
	
	//sometimes someone does not properly log on but still closes the window causing this function to be called when it shouldn't.
	//hence the conditional
  if(g){
  	delete g.clientsToPlayers[client];
  	delete g.clientsToClients[client];
  	delete game.clientsToGames[client];
  }
};

COMMANDS.removePlayer = function(client, args) {
	var	g = game.clientsToGames[client],
		a = g.remove(args.name),
		c = a[0],
		p = a[1];
	
	calljs(c, ['notify', {message: 'You have been removed from the game!'}]);
	callalljs(g.clients(), ['remove_player', {name: args.name}]);
};

COMMANDS.drawPile = function(client, args){
	var	g = game.clientsToGames[client],
		p = g.clientsToPlayers[client],
		//abc = g.pile.pop(),
		
		c = g.deck.pop(),
		n = args.name || p.name;
		pid = args.id;
}


COMMANDS.reset = function(client, args) {
	var	g = game.clientsToGames[client];

	g.reset();
	callalljs(g.clients(), ['reset', {}]);
};

COMMANDS.takePile = function(client, args){
	var	g = game.clientsToGames[client],
  	p = g.clientsToPlayers[client];

  var n = p.name;
	activeplayer = g.activePlayer;
	
	pid = parseInt(args.pileid);
	notes = g.assignPileToPlayer(pid, n);
	if(notes != 0){
		stuff = {player:notes['player'], piles:notes['piles']};
		console.log(stuff);
  	callalljs(g.clients(), ['update_log', {player:notes['player'], piles:notes['piles']}]);
  	COMMANDS.updateView(client, args);
  }else{
	  console.log('hayo');
  }
}
