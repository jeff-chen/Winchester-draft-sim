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

function flatten(array){
    var flat = [];
    for (var i = 0, l = array.length; i < l; i++){
        var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
        if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten(array[i]) : array[i]); }
    }
    return flat;
}

shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


exports.initPile = function(size, mode) {
	//the final thing returned is a list of names from the pool
	var fs = require('fs');
	var x = [];
	mode = mode.toLowerCase();
	console.log("the mode is");
	console.log(mode);
	if(typeof mode === 'undefined' || mode.toLowerCase() == 'cube' || mode.length == 0){
	  var cubecards = fs.readFileSync('textcubelist.txt').toString().split("\n");
	  var x = getRandom(cubecards, size);
  } else {
  // RTR
    for(i=0;i<6;i++){
	    var commons = fs.readFileSync(mode + 'commons.txt').toString().split("\n");
	    var y = getRandom(commons, 10);
	    x.push(y);
	  
	  	var uncommons = fs.readFileSync(mode + 'uncommons.txt').toString().split("\n");
	    var y = getRandom(uncommons, 3);
	    x.push(y);
	  
	    var rarelist = fs.readFileSync(mode + 'rares.txt').toString().split("\n");
	    var rarelist2 = fs.readFileSync(mode + 'rares.txt').toString().split("\n");
	    var mythiclist = fs.readFileSync(mode + 'mythics.txt').toString().split("\n");
	    rarelist.push(rarelist2);
	    rarelist.push(mythiclist);
	    rarelist = flatten(rarelist);

	    var y = getRandom(rarelist, 1);
	    x.push(y);
    }
  }
  x = flatten(x);
  x = shuffle(x);

	for(i in x) {
	    console.log(x[i]);
	}
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
