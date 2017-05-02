function XX(integer) {
	return integer>9 ? ""+integer : "0"+integer;
}

function ajaxCall(sPathPhp, fCallbackFailed, fCallback, parameter1, parameter2, parameter3, parameter4) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', sPathPhp);
	xhr.send(null);
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