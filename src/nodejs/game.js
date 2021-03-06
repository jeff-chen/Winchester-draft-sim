var util = require('./util');

var games = {}
var namesToPlayers = {};
var clientsToGames = {};

exports.games = games;
exports.namesToPlayers = namesToPlayers;
exports.clientsToGames = clientsToGames;


//TODO: Wrap images around div with style="z-index: 0, 1, 2, etc.", position: absolute, margin-top: 0px, 30px, 60px, etc.
//and mouseover/mouseoff events on the image to adjust the z-index.


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
	//this.pile = loadPile();
	this.namesToCards = {};
	this.playerPiles = {};
	this.gameIsStarted = 0;
	this.activePlayer = '';
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

Game.prototype.start = function(mode){
	console.log('starting');
	console.log(Object.keys(this.playerPiles)[0]);
	console.log(Object.keys(this.playerPiles)[1]);
	console.log(this.playerPiles);
	//console.log(this.namesToPlayers);
	if(!this.gameIsStarted && Object.keys(this.playerPiles).length > 1){
	//if(!this.gameIsStarted){
	//todo: check there are exactly two players before starting, though gameIsStarted should handle that already
  	this.gameIsStarted = 1;
  	this.pile = loadPile(mode,90);
    this.addToPiles();
    this.activePlayer = Object.keys(this.playerPiles)[Math.floor(Math.random()*Object.keys(this.playerPiles).length)]; //first player.name
	  //also view should be rendered here along with appropriate js binding events rather than on index.html.
  }
} 

Game.prototype.startSealed = function(mode){
		console.log('starting');
		console.log(this.playerPiles);
		if(!this.gameIsStarted){
	  	this.gameIsStarted = 1;
	  	this.pile = loadPile(mode,180); //90 per player.
	    console.log('omghai');
	    console.log(this.pile.length);
	    this.assignSealedToPlayers();
	    //this.addToPiles();
	    //this.activePlayer = Object.keys(this.playerPiles)[Math.floor(Math.random()*Object.keys(this.playerPiles).length)]; 
		  //also view should be rendered here along with appropriate js binding events rather than on index.html.
		  
	  }
}

Game.prototype.clients = function() {
	var self = this;
	return Object.keys(this.clientsToClients).map(function(c) {
		return self.clientsToClients[c];
	});
};

Game.prototype.assignSealedToPlayers = function(){
	for(var i=0; i < Object.keys(this.playerPiles).length;i++){
		for(var j=0; j < 90;j++){
			tempcard = this.pile.pop();
			if(tempcard){
				this.playerPiles[Object.keys(this.playerPiles)[i]].push(tempcard);
			}
		}
	}
}

Game.prototype.assignPileToPlayer = function(pile_id, player){
	nums = this.piles[pile_id].length;
	pilescopy = this.piles[pile_id].slice(0);
	//console.log(this.playerPiles);
	//console.log(player);
	//console.log('hithar');
	if(nums > 0 && player == this.activePlayer){
		for(i = 0; i < nums; i++){
			abc = this.piles[pile_id].pop();
			this.playerPiles[player].push(abc);
		}
		this.addToPiles();
		this.setNextPlayer();
		console.log(this.playerPiles);
		console.log(this.piles);
		var takenAction = {player: player, piles: pilescopy};
		console.log(takenAction);
		return(takenAction); //this is used to tell that update was a success so view can be updated
	} else {
		console.log(player);
		console.log(this.activePlayer);
		return(0);
	}
}

Game.prototype.reset = function() {
	this.deck = getNewDeck();
	for(k in this.namesToCards) {
		this.namesToCards[k] = [];
	}
};

function loadPile(mode,quantity){
	return util.initPile(quantity,mode);	
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

Game.prototype.setNextPlayer = function(){
	x = Object.keys(this.playerPiles).indexOf(this.activePlayer);
	y = x+1;
	if(y >= Object.keys(this.playerPiles).length){
		y = 0;
	}
	this.activePlayer = Object.keys(this.playerPiles)[y];
	console.log('active player is');
	console.log(this.activePlayer);
}

function reset() {
	games = {};
	clientsToPlayers = {};
	namesToPlayers = {};
}

exports.reset = reset;

