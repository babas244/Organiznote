function XX(integer) {
	return integer>9 ? ""+integer : "0"+integer;
}

function ajaxCall(sPathPhp, fCallBack, parameter1, parameter2, parameter3) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', sPathPhp);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallBack(xhr.responseText, parameter1, parameter2, parameter3);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) {
				alert('Une erreur est survenue !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}