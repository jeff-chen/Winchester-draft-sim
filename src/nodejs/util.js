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

genpack = function(set){
	var fs = require('fs');
	var pack = [];
	
	var commons = fs.readFileSync(set + 'commons.txt').toString().split("\n");
  var y = getRandom(commons, 10);
  pack.push(y);

	var uncommons = fs.readFileSync(set + 'uncommons.txt').toString().split("\n");
  var y = getRandom(uncommons, 3);
  pack.push(y);

  var rarelist = fs.readFileSync(set + 'rares.txt').toString().split("\n");
  var rarelist2 = fs.readFileSync(set + 'rares.txt').toString().split("\n");
  var mythiclist = fs.readFileSync(set + 'mythics.txt').toString().split("\n");
  rarelist.push(rarelist2);
  rarelist.push(mythiclist);
  rarelist = flatten(rarelist);

  var y = getRandom(rarelist, 1);
  pack.push(y);

	//make an exception for dragon's maze
	if(set == 'dgm'){
		console.log('insering land');
		var landlist = fs.readFileSync(set + 'lands.txt').toString().split("\n");
		var y = getRandom(landlist, 1);
		pack.push(y);
		console.log(pack);
	}
	pack = flatten(pack);
	return(pack);
}

draftformats = 
  {"rtr":["rtr","rtr","rtr","rtr","rtr","rtr"],
   "gtc":["gtc","gtc","gtc","gtc","gtc","gtc"],
   "dgm":["rtr","rtr","gtc","gtc","dgm","dgm"],
   "lrw":["lrw","lrw","lrw","mor","mor","mor"],
   "mma":["mma","mma","mma","mma","mma","mma"]
}


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
    /*for(i=0;i<6;i++){
      x.push(genpack(mode));
    }*/
    for(i in draftformats[mode]){
	    x.push(genpack(draftformats[mode][i]));
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
