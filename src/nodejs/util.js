exports.getUniqueId = (function() {
	var id = 0;
	return function() {
		if(arguments[0] === 0) {
			id = 1;
			return 0;
		} else {
			return id++;
		}
	};
})();

function getRandom(arr, size) {
  var copy = arr.slice(0), rand = [];
  for (var i = 0; i < size && i < copy.length; i++) {
    var index = Math.floor(Math.random() * copy.length);
    //console.log(copy.splice(index, 1)[0]);
    rand.push(copy.splice(index, 1)[0]);
  }
  return rand;
}


exports.initPile = function(size) {
	//the following is test code
	var fs = require('fs');
	var cubecards = fs.readFileSync('textcubelist.txt').toString().split("\n");

	var poo = [];
	var x = getRandom(cubecards, size);
	console.log('foobat');
	return(x);
}
	//end test code

exports.shuffle = function(deck) {
	for(var i = 0; i < deck.length; i++) {
		var j = Math.floor(Math.random() * deck.length);
		var tempi = deck[i];
		deck[i] = deck[j];
		deck[j] = tempi;
	}
	return deck;
};

exports.explodeDeck = function(deck) {
	var exploded = [];
	for(var i = 0; i < deck.length; i++) {
		for(var j = 0; j < parseInt(deck[i][0]); j++) {
			exploded.push(deck[i][1]);
		}
	}
	return exploded;
}

exports.delayMap = function(items, callback, delay) {
	var o = new function() {};
	var i = 0;
	var f = function() {
		if(i < items.length) {
			callback(items[i++]);
			return o.id = setTimeout(f, delay);
		}
	};
	o.id = f();
	return o;
}
