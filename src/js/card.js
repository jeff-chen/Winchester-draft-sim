var socket;
var admin = false;
var COMMANDS = {};
var PLAYERS = {};

function WizardsAutoCard (cardname) { 
  windowName = "WotCWindow";
  params = "toolbar=0, location=0, directories=0, status=0,menubar=0, scrollbars=0, resizable=0, width=450, height=400";
  win = window.open("http://www.wizards.com/magic/autocard.asp?name="+cardname, windowName, params);
  //http://gatherer.wizards.com/Handlers/Image.ashx?size=small&type=card&name=Watery%20Grave&options=
}

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
	game_mode = $('input[name=draftformat]:checked').val();
	send_message(['startGame', {mode:game_mode}]);
	//if($('input#Cube').attr('checked')){
	//	send_message(['startGame', {mode:'cube'}]);
	//} else {
	//	send_message(['startGame', {mode:'rtr'}])
	//}
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
		$('.adminonly').hide();
	} else {
		admin = true;
	}
}

COMMANDS.logon = logon;

function add_player(json) {
	if(!PLAYERS[json.name]) {
		var p = $('<li>').attr('id', json.name).append(json.name).addClass('col');
		PLAYERS[json.name] = p;
		$('ul#playersul').append(p);
	}
}

COMMANDS.add_player = add_player;

function remove_player(json) {
	$('#' + json.name).remove();
	delete PLAYERS[json.name];
}

COMMANDS.remove_player = remove_player;

function update_all_piles(json){
	//alert('fubat'); //like a zubat
	for(var i=0;i<=3;i++){
		pilename = '#pile' + i.toString();
		$(pilename + ' > img').remove();
		$(pilename + ' > label').remove();
		for(var j=0; j < json.piles[i].length;j++){
			//alert(j);
			$(pilename).append(cardize(json.piles[i][j]));
			//$(pilename).append(cardize(json.piles[i][j],j));
			//$(pilename).append('<label>' + json.piles[i][j] + '<br/></label>');
		}
	}
}

function cardize(text){
	stuff = '<img src=\"http://gatherer.wizards.com/Handlers/Image.ashx?size=small&type=card&name='
	 + text 
	 + '&options=\">'
	return(stuff);
}
/*function cardize(text,offset){
	//alert(offset);
	stuff = '<img src=\"http://gatherer.wizards.com/Handlers/Image.ashx?size=small&type=card&name='
	 + text 
	 + '&options=\" style=\"position:absolute; top:' + (offset*40+60) + 'px; z-index:' + offset + '\">'
	//alert(stuff);
	return(stuff);
	//return('<label><a href=\"#\" class=\"mtgcard\" onmouseover=>' + text + '</a><br/></label>');
}*/

function update_player_piles(json){
	pilenametype = '#cardstaken';
	$(pilenametype + ' > img').remove();
	$(pilenametype + ' > label').remove();	
	$(pilenametype + ' > br').remove();
	for(var j in json.playerspile){
		$(pilenametype).append(cardize(json.playerspile[j]));
		//$(pilenametype).append(cardize(json.playerspile[j],j));
		//$(pilenametype).append('<label><a href=\"\" class=\"mtgcard\" target=\"_blank\">' + json.playerspile[j] + '</a><br/></label>');
	}
	for(var j in json.playerspile){
		$(pilenametype).append('<br/><label>' + json.playerspile[j] + '</label>');
	}
}

function update_log(logtext){
	$('#log > label').remove();
	$('#log').append("<label>" + logtext + "</label>");
}

function update_active_player(json){
	$('.takepile').show();
	$('.notice').html(json.labeltext);
}

function update_inactive_player(json){
	$('.takepile').hide();
	$('.notice').html(json.labeltext);
}

function hide_start_button(json){
	$('input#startgame').remove();
}

COMMANDS.hide_start_button = hide_start_button;

COMMANDS.update_active_player = update_active_player;

COMMANDS.update_inactive_player = update_inactive_player;

COMMANDS.update_player_piles = update_player_piles;

COMMANDS.update_all_piles = update_all_piles;

COMMANDS.create_card = create_card;

function reset(json) {
	$('div.col > img').remove();
}

COMMANDS.reset = reset;
