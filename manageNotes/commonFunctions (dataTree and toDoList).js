var textareaFormsMaxSize = 16383;

var monthNameAbbreviation=["jan","fev","mar","avr","mai","jun","jlt","aou","sep","oct","nov","dec"]; 
var dayAbbreviation=["Di","Lu","Ma","Me","Je","Ve","Sa"];

function hackReplaceAll(sStringtoSearchAndReplace) {
	return sStringtoSearchAndReplace.replace(/%dc%/g,hackReplaceDateChineseFormat()).replace(/%d%/g,hackReplaceDate());;
}

function hackReplaceDateChineseFormat() {
	oNewDate = new Date();
	var monthNumber = oNewDate.getMonth();
	var sNewDate = oNewDate.getFullYear()+"-"+XX(parseInt(monthNumber)+1)+monthNameAbbreviation[monthNumber]+"-"+XX(oNewDate.getDate()); 				
	return sNewDate;
}

function hackReplaceDate() {
	oNewDate = new Date();
	var sNewDate = "("+dayAbbreviation[oNewDate.getDay()]+" "+oNewDate.getDate()+" "+" "+monthNameAbbreviation[oNewDate.getMonth()]+" "+oNewDate.getFullYear()+")"; 				
	return sNewDate;
}

function hackDisplayLinks(str) {
	return str.replace(/([-a-z0-9+&@#\/%?=~_|!:,;]+\.)+[-a-z0-9+&@#\/%?=~_|!:,;]+/gi, function (x) {
		return '<a href="'+(x.startsWith('http') ? '' : 'http://')+x+'" target="_blank">'+x+'</a>';
	});
}

function XX(integer) {
	return integer>9 ? ""+integer : "0"+integer;
}

setInterval(checkConnection,5*60*1000);

document.getElementById('checkConnection').addEventListener('click',checkConnection);

function checkConnection() {
	var rand = Math.floor((1 + Math.random()) * 1000);
	ajaxCall('../checkConnection.php?rand='+rand,'',fAlertOffline, fCheckSessionStatus)
}

function fAlertOffline(errorMessage) {
	document.getElementById('checkConnection').style.color = '#C3C3C3';
	alert('Vous êtes hors-ligne.'+errorMessage)
}

function fCheckSessionStatus(errorMessageFromServer) {
	document.getElementById('checkConnection').style.color = 'black';
	if (errorMessageFromServer === 'disconnected') {
		document.getElementById('header').style.color = '#C3C3C3';
		alert('La session sous votre nom d\'utilisateur a été terminée. \nPlus aucune action en ligne n\'est possible.\n\nVeuillez vous reconnecter.')
	}
}

function ajaxCall(sPathPhp, sPostRequestContent, fCallbackFailed, fCallback, parameter1, parameter2, parameter3, parameter4) {
	var xhr = new XMLHttpRequest(); 
	
	if (sPostRequestContent==='') {
		xhr.open ('GET', sPathPhp);
		xhr.send(null);
	}
	else {
		xhr.open ('POST', sPathPhp);
		//alert(sPathPhp + '\n\n sPostRequestContent :' + sPostRequestContent);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(sPostRequestContent);		
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallback(xhr.responseText, parameter1, parameter2, parameter3, parameter4);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) {
			var errorMessage = "\n\n(Si le problème persiste, contacter l'administrateur du site à " 
								+ emailAddressSiteAdmin + " avec les infomations suivantes :\nCalled function : "
								+ fCallback.name + ", status :" 
								+ xhr.status + ", statusText: " 
								+ (xhr.statusText==undefined||"" ? "-" : xhr.statusText) + ")";
			fCallbackFailed(errorMessage);
		}
	}
}

function IsJSONValid(sJSONString) {
	try {
		JSON.parse(sJSONString);
	}
	catch(e) {
		alert ("Erreur inattendue. Contactez l'administrateur. Le message est :\n\n" + e + "\n\nin : " + sJSONString);
		return false;
	}
	return true;
}

function checkResponseAjaxIsJSON(sJSONString, nameOfFunctionCalling) {
	//alert("La string JSON est : " + sJSONString + ", arrivée dans la fonction : " + nameOfFunctionCalling);
	try {
		JSON.parse(sJSONString);
	}
	catch(e) {
		if (sJSONString === "disconnected") {
			alert("Vous avez été déconnecté. Impossible de récupérer des données ou de faire des changements sur le serveur sans se reconnecter.");
		}
		else {
			alert ("Erreur inattendue lors de l'accès au serveur. Contactez l'administrateur. Le message est :\n" + sJSONString);
		}
		return false;
	}
	return true;
}

function getGeolocation(fCallback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fCallback);
	}
	else { 
        fCallback("not supported");
    }
}

function HSVtoHex(h, s, v) { // 0 <= (h et s et v) <= 1, inspired by http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return '#' + colorParameterToHex2digits(r) + colorParameterToHex2digits(g) + colorParameterToHex2digits(b);
}

function colorParameterToHex2digits(colorParameter) {
	var hexColor = Math.round(colorParameter * 255).toString(16);
	return hexColor.length == 1 ? "0"+ hexColor : hexColor;
}

function displayDatesComparison (sDateBefore, sDateAfter, sDescriptionDateBefore, sDescriptionDateAfter) { // accepte dates au format "2017-11-01 22:25:00"
	var sDeltaDisplayed;
	var oDateBefore = new Date(sDateBefore.substr(0,4), sDateBefore.substr(5,2), sDateBefore.substr(8,2),
			sDateBefore.substr(11,2), sDateBefore.substr(14,2), sDateBefore.substr(17,2), 0);

	var oDateAfter = new Date(sDateAfter.substr(0,4), sDateAfter.substr(5,2), sDateAfter.substr(8,2),
			sDateAfter.substr(11,2), sDateAfter.substr(14,2), sDateAfter.substr(17,2), 0);
			
	deltaDatesInSecondes = (oDateAfter.getTime() - oDateBefore.getTime())/1000;

	var _1day = 24*3600;
	var _1month = 30*_1day;
	var _1year = 365*_1day;

	if (deltaDatesInSecondes > 2*_1year) {sDeltaDisplayed = Math.round(deltaDatesInSecondes/_1year) + " ans"}
	else if (deltaDatesInSecondes > 2*_1month) {sDeltaDisplayed = Math.round(deltaDatesInSecondes/_1month) + " mois"}
	else if (deltaDatesInSecondes > _1day) {sDeltaDisplayed = Math.round(deltaDatesInSecondes/_1day) + " jour(s)"}
	else if (deltaDatesInSecondes < 0 ) {sDeltaDisplayed =  "...bizarre, la date "+ sDescriptionDateBefore +" arrive après la date "+ sDescriptionDateAfter +"...??"}
	else {sDeltaDisplayed = "moins de 1 jour"}

	return sDeltaDisplayed;
}