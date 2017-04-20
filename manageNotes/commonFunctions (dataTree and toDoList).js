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

function checkResponseAjax(sJSONString, nameOfFunctionCalling) {
	alert("La string JSON est : " + sJSONString + ", arrivée dans la fonction : " + nameOfFunctionCalling);
}

function getGeolocation(fCallback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fCallback);
	}
	else { 
        fCallback("not supported");
    }
}