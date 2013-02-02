/**
	@author themunsonsapps
	@website http://themunsonsapps.blogspot.com
	@twitter @themunsonsapps
	@facebook http://www.facebook.com/pages/The-Munsons-Apps/161428533911544 Like us!
	
	script hosting: https://sites.google.com/site/themunsonsapps/mtg/autocard.js
	script website: http://themunsonsapps.blogspot.com/2011/05/include-mtg-autocard-popup-in-your.html

	To use it include this lines in your website: 

	<!-- MTG AUTOCARD BEGIN -->
	<script type="text/javascript">
	  URL_START = "http://themunsonsapps.blogspot.com";
	</script>

	<script src="https://sites.google.com/site/themunsonsapps/mtg/autocard.js" type="text/javascript"></script>
	<!-- MTG AUTOCARD END -->
	

	Sample that will trigger:
	
	<a href="http://themunsonsapps.blogspot.com/watheveryouwant.any">Serra Angel</a>

	You can also declare the URL_STAR_IMG to get the img from another site, for example: 

	<!-- MTG AUTOCARD BEGIN -->
	<script type="text/javascript">
	  URL_START_IMG = "http://magiccards.info/scans";
	</script>

	<script src="https://sites.google.com/site/themunsonsapps/mtg/autocard.js" type="text/javascript"></script>
	<!-- MTG AUTOCARD END -->
	
	this will trigger getting the img directly from the link and regardless the card Name: 
	
	<a href="http://magiccards.info/scans/en/nph/38.jpg">Misstep</a>

	you can declare both, URL_START_IMG and URL_START, both will trigger.

*/

var URL_START;
var URL_START_IMG;
var URL_START_IMG_DEFAULT = "http://magiccards.info/scans";
var URL_START_DEFAULT = "http://www.mtg-forum.de/db/magiccard.php";
var CSS_BORDER_STYLE = "border-bottom-left-radius:2em; border-bottom-right-radius:2em; border-top-right-radius:2em; border-top-left-radius:2em; background: #000000; border-color: #000000; border:2px solid; padding:10px; ";
var GATHERER_HELPER = "https://sites.google.com/site/themunsonsapps/mtg/gatherer_helper.js";
var CSS_TAG = "mtgcard";
var CARD_HEIGHT = 310;
var CARD_WIDTH = 220;
var BORDER_WIDTH = 13;
var body;

function loadScript(url, callback){
    // adding the script tag to the head as suggested before
   var head= document.getElementsByTagName('head')[0];
   var script= document.createElement('script');
   script.type= 'text/javascript';
   script.src= url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback

   // fire the loading
   head.appendChild(script);
};

function callbackFunction(e){
};

function showImgPopup(element){
		var imgSrc = "";

		if(element.href!=undefined && element.href.indexOf(URL_START_IMG)!=-1){
			// If we want to get the image from link
			imgSrc = element.href;
		}else if(element.href!=undefined && element.innerHTML!=undefined){
			// If we want to get the image from card name text
			imgSrc = getWizardsSrc(element.innerHTML);
		}

		hp = document.getElementById("hoverpopup"); 
		
		// Set position of hover-over popup 
		hp.style.top = getTop(element)+"px";
		hp.style.left = determineLeft(element)+"px";

		hp.innerHTML = "<img src=\""+imgSrc+"\" onerror=\"this.onerror=null;this.onmouseout=null;this.onmouseover=null;hideImgPopup();\" width=\""+CARD_WIDTH+"\" height=\""+CARD_HEIGHT+"\"/>";
		/** TODO onerror=hideImgPopup */
		hp.style.visibility = "Visible";	
}

function hideImgPopup(){
	hp = document.getElementById("hoverpopup"); 
	hp.style.visibility = "Hidden";
        /*if(document.all) {
            hp.style.display = "none";
            hp.style.visibility = "hidden";
        } else {
            hp.style.cssText = "display: none; visibility: hidden;";
        }*/
}

function getTop(element) {
	// height margin
	var OFFSET_TOP = 0; 
	var tempElement = element;
	var top = 0;

	while(tempElement.offsetParent!=null){
		tempElement = tempElement.offsetParent;
		top+=tempElement.offsetTop==null?0:tempElement.offsetTop;
	}
	top+= element.offsetTop + element.offsetHeight;
	top+= OFFSET_TOP;

	if(body!=null && body.offsetHeight!=null && body.offsetHeight<top+CARD_HEIGHT+(2*BORDER_WIDTH)){
		top = body.offsetHeight - CARD_HEIGHT - OFFSET_TOP- (2 * BORDER_WIDTH);
	}

	return top;
}

function determineLeft(element) {
	// width margin
	var OFFSET_LEFT = 0;  
	var tempElement = element;
	var left = 0;
	while(tempElement.offsetParent!=null){
		tempElement = tempElement.offsetParent;
		left+=tempElement.offsetLeft==null?0:tempElement.offsetLeft;
	}
	left+= element.offsetLeft + element.offsetWidth;
	left+= OFFSET_LEFT;

	if(body!=null && body.offsetWidth!=null && body.offsetWidth<left+CARD_WIDTH+(2*BORDER_WIDTH)){
		left = body.offsetWidth - CARD_WIDTH - OFFSET_LEFT - (2 * BORDER_WIDTH);
	}
	return left;
}

function getOffset( el ) {
	return isNaN(el) ? 0:el;
}

// loading gatherer helper script
loadScript(GATHERER_HELPER,callbackFunction);

// placeholder creation
hover = document.createElement("div");
hover.id = "hoverpopup";
hover.setAttribute("class","card");//top:10; left:0; 
hover.setAttribute("style","visibility:hidden; position:absolute; top:10px; left:5px; "+CSS_BORDER_STYLE);

// Inserting placeholder into the body
body = document.getElementsByTagName('body')[0];
body.appendChild(hover);

// Initializing URL values
if(URL_START == undefined || URL_START == null){
	URL_START = URL_START_DEFAULT;
}
if(URL_START_IMG == undefined || URL_START_IMG == null){
	URL_START_IMG = URL_START_IMG_DEFAULT;
}

// Adding onmouseover and onmouseout listeners to all matching links
var cardLinks = document.getElementsByTagName("a");
for (var i=0;i<cardLinks.length;i++) {
  var elem = cardLinks[i];
  
  if(elem.className === CSS_TAG || elem.href.indexOf(URL_START)!=-1 || elem.href.indexOf(URL_START_IMG)!=-1) {

	elem.onmouseover = function(evt){
		var sourceElement;
		if(document.all) {
			sourceElement = evt.srcElement; // for IE
		} else {
			sourceElement = evt.target;
		}
		showImgPopup(sourceElement);
	}
	elem.onmouseout  = function(){
		hideImgPopup();
	}
  }
}



