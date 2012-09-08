var socket;
var admin = false;
var COMMANDS = {};
var PLAYERS = {};

function init() {
	$('#main').hide();
	$('#logonbutton').bind('click', ev_logon);
	$('#draw').bind('click', ev_draw);
	$('#reset').bind('click', ev_reset);
  $('#startgame').bind('click', ev_start);

  $('.takepile').bind('click', ev_takepile);  

	$(window).unload(function() {
        	send_message(['disconnect', {}]);
        });
}

function runCmd(json) {
	//alert(json);
	var func = COMMANDS[json[0]];

	if(func) {
		func(json[1]);
	} else {
		COMMANDS.notify({message: 'Function ' + funcName + ' not found!'});
	}
}

function ev_draw(event) {
	send_message(['draw', {}]);
}

function ev_takepile(event){
	pileid = $(this)[0].id[4];
	send_message(['takePile', {pileid:pileid}])
	//alert(pileid);
	//alert(parseInt(pileid));
}

function ev_reset(event) {
	send_message(['reset', {}]);
}

function ev_start(event) {
	//alert('hallo');
	send_message(['startGame', {}]);
}

function notify(json) {
	alert(json.message);
}

COMMANDS.notify = notify;

function send_message(msg) {
	socket.emit('msg', JSON.stringify(msg));
}

function ev_logon(event) {
	var	server = $('#server').val(),
		port = parseInt($('#port').val());

	socket = io.connect('http://' + server + ':' + port) //, {rememberTransport: false, port: port});
	socket.on('msg', function(data) {
		runCmd(JSON.parse(data));
	});
	socket.on('connect', function() {
		alert('connected!');
		send_message(['logon', {game: $('#gamename').val(), gamepass: $('#gamepass').val(), name: $('#username').val(), namepass: $('#userpass').val()}]);
	});
	event.preventDefault();
}

function logon(json) {
	$('#logon').hide();
	$('#main').show();
	if(!json.admin) {
		$('#reset').hide();
		$('#startgame').hide();
	} else {
		admin = true;
	}
}

COMMANDS.logon = logon;

function add_player(json) {
	if(!PLAYERS[json.name]) {
		if(admin) {
			if(!json.admin) {
				var remove = $('<input type="button">').val('X').bind('click', function() {
					send_message(['removePlayer', {name: json.name}]);
				});
			} else {
				var remove = $('<span>').text(':)');
			};
			var draw = $('<input type="button">').val(json.name).bind('click', function() {
				send_message(['draw', {name: json.name}]);
			});
			var p = $('<div>').attr('id', json.name).append($('<p>').append(draw).append(remove)).addClass('col');
		} else {
			var p = $('<div>').attr('id', json.name).append($('<p>').text(json.name)).addClass('col');
		}
		PLAYERS[json.name] = p;
		$('#main').append(p);
	}
}

COMMANDS.add_player = add_player;

function remove_player(json) {
	$('#' + json.name).remove();
	delete PLAYERS[json.name];
}

COMMANDS.remove_player = remove_player;

function create_card(json) {
	var	p = PLAYERS[json.player],
		c = $('<img>').attr('src', '/img/' + json.id + '.png').css({'width':72, 'height':96});

	if(p) {
		$(p).find('p').after(c);
	} else {
		p = $('<div>').attr('id', json.player).append($('<p>').text(json.player)).append(c).addClass('col');
		PLAYERS[json.player] = p;
		$('#main').append(p);
	}

}

function update_all_piles(json){
	//should this clear the pile divs first or just assume that each input represents only new cards? leaning the former
	//alert('fubat'); //like a zubat
	for(var i=0;i<=3;i++){
		pilename = '#pile' + i.toString();
		$(pilename + ' > label').remove();
		for(var j=0; j < json.piles[i].length;j++){
			$(pilename).append('<label>' + json.piles[i][j] + '<br/></label>');
		}
	}
}

function update_player_piles(json){
	for(var i in json.piles){
		pilename = '#' + i;
		$(pilename + ' > label').remove();
		//alert(pilename + ' > label');
		for(var j in json.piles[i]){
			$(pilename).append('<label>' + json.piles[i][j] + '<br/></label>');
		}
	}
}

COMMANDS.update_player_piles = update_player_piles;

COMMANDS.update_all_piles = update_all_piles;
/*function startgame(json){
	
}


COMMANDS.startgame = startgame;*/

COMMANDS.create_card = create_card;

function reset(json) {
	$('div.col > img').remove();
}

COMMANDS.reset = reset;
