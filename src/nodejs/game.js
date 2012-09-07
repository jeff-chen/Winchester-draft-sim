var util = require('./util');

var games = {}
var namesToPlayers = {};
var clientsToGames = {};

exports.games = games;
exports.namesToPlayers = namesToPlayers;
exports.clientsToGames = clientsToGames;





function Player(name, pass) {
	this.name = name;
	this.pass = pass;
}

exports.Player = Player;

function Game(name, pass, admin) {
	this.self = this;
	this.admin = admin;
	this.name = name;
	this.pass = pass;
	this.deck = getNewDeck();
	this.pile = loadPile();
	this.namesToCards = {};
	this.playerPiles = {};
	this.gameIsStarted = 0;
	this.piles = [[],[],[],[]];
	this.clientsToPlayers = {};
	this.clientsToClients = {};
	this.namesToClients = {};
}



Game.prototype.remove = function(name) {
	var	c = this.namesToClients[name],
		p = this.clientsToPlayers[c];

	delete this.namesToClients[name];
	delete this.clientsToClients[c];
	delete this.clientsToPlayers[c];
	delete this.namesToCards[name];

	return [c, p];
};

Game.prototype.start = function(){
	console.log(Object.keys(this.playerPiles).length);
	if(!this.gameIsStarted){
	//todo: check there are exactly two players before starting, though gameIsStarted should handle that already
  	this.gameIsStarted = 1;
  	this.pile = loadPile();
    this.addToPiles();
	  console.log('lolocaust');
	  //also view should be rendered here along with appropriate js binding events rather than on index.html.
  }
} 

Game.prototype.clients = function() {
	var self = this;
	return Object.keys(this.clientsToClients).map(function(c) {
		return self.clientsToClients[c];
	});
};


Game.prototype.reset = function() {
	this.deck = getNewDeck();
	for(k in this.namesToCards) {
		this.namesToCards[k] = [];
	}
};

function loadPile(){
	return util.initPile(90);
	
}

Game.prototype.addToPiles = function(){
	for(abc = 0; abc < this.piles.length; abc++){
		tempcard = this.pile.pop();
		if(tempcard){
			this.piles[abc].push(tempcard);
		}
	}
}

function getNewDeck() {
	var a = [];
	for(var i = 1; i <= 54; i++) {
		a.push(i);
	}
	return util.shuffle(a);
}

exports.Game = Game;

function reset() {
	games = {};
	clientsToPlayers = {};
	namesToPlayers = {};
}

exports.reset = reset;

