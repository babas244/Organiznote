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