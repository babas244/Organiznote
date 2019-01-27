var aNbOfLabels =[];
var isDisplayDateExpired = false;
var aLabelsChecked = [];
var aLabelNbItems = {}; 
var aLabelColor = [];

document.getElementById('contentToDoHtmlArchived').innerHTML = hackDisplayLinks(contentToDoHtmlArchived);
initializePageToDo();

function initializePageToDo () {
	ajaxCall('../phpAjaxCalls_ToDo/retrieveLabels.php?idTopic=' + idTopic, initializetoDoFailed, displayLabelsCheckboxes);
}
		
function displayLabelsCheckboxes(sLabelsJSON) {
	oLabels = JSON.parse(sLabelsJSON);
	for (var labelTitleRank = 0; labelTitleRank < oLabels.title.length; labelTitleRank ++) {
		aLabelsChecked[labelTitleRank] = [];
		aLabelColor[labelTitleRank] = [];
		for (var labelRank = 0 ; labelRank < oLabels.content[labelTitleRank].length; labelRank++) {
			aNbOfLabels[labelTitleRank] = oLabels.content[labelTitleRank].length;
			//alert ('h = ' + labelTitleRank/oLabels.title.length + '    s = ' + labelRank/oLabels.content[labelTitleRank].length);
			aLabelColor[labelTitleRank][labelRank] = HSVtoHex(labelTitleRank/oLabels.title.length,(labelRank)/oLabels.content[labelTitleRank].length, 1)
		}
	}
	counterInsertDivSeparatorLabels();
}

		
function counterInsertDivSeparatorLabels() {
	for (var label0=0 ; label0<aNbOfLabels[0] ; label0++) {
		for (var label1=0 ; label1<aNbOfLabels[1] ; label1++) {
			for (var label2=0 ; label2<aNbOfLabels[2] ; label2++) {
				for (var label3=0 ; label3<aNbOfLabels[3] ; label3++) {
					var counterDivSeparatorLabels = document.createElement("div");
					counterDivSeparatorLabels.id = "separatorLabels"+label0+label1+label2+label3;
					document.getElementById("noScroll").insertBefore(counterDivSeparatorLabels , document.getElementById('lastAndInvisible'));
				}	
			} 			
		} 
	}
	ajaxCall('../phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + sBuildLabelsPhp(), initializetoDoFailed, insertToDoListBefore);	
}

function sBuildLabelsPhp() {
	var sLabelsPhp;
	var labelTitleRank;
	var labelRank;
	sLabelsPhp="";
	for (labelTitleRank = 0 ; labelTitleRank < 4 ; labelTitleRank++) {
		//alert (sLabelsPhp)
		sLabelsPhp += "&label" + labelTitleRank + "="
			for (labelRank = 0 ; labelRank < aNbOfLabels[labelTitleRank]; labelRank++) {
				sLabelsPhp += labelRank;
			}		
		}
	//alert (sLabelsPhp);
	return sLabelsPhp;	
}


function initializetoDoFailed(errorMessage) {
	alert ("L'initialisation de la todo liste n'a pas fonctionné. Veuillez recharger la page (touche F5)." + errorMessage);
}

function loadToDoListFailed(errorMessage) {
	alert ("La liste ne peut pas être chargée depuis le serveur. Vérifiez votre connexion Internet et recommencez." + errorMessage);
}

function insertToDoListBefore(sToDoListJSON) {
	//alert ("sToDoListJSON : " + sToDoListJSON + " fCallback :" + fCallback.name + " sIsNew : " + sIsNew);
	//if (sToDoListJSON =="" && pathFocused=="01") {alert("Pas encore de notes. Cliquer sur le + pour en ajouter une.");}
	
	if (sToDoListJSON !== "" && IsJSONValid(sToDoListJSON)) {
		var oToDoListJSONParsed = JSON.parse(sToDoListJSON);
		var sContent;
		var nNbOfToDoInLabels;
		var i,j;
		for (sLabels in oToDoListJSONParsed) {
			if (aLabelNbItems[sLabels] === undefined) {
				aLabels = sLabels.split("");
				nNbOfToDoInLabels = oToDoListJSONParsed[sLabels].length;
				aLabelNbItems[sLabels] = aLabelNbItems[sLabels]=== undefined ? 0 : aLabelNbItems[sLabels]; // dernier membre : nNbOfToDoInLabels ou aLabelNbItems[sLabels] ??
				var oDOMSeparatorLabels = document.getElementById("separatorLabels"+sLabels);
				if (nNbOfToDoInLabels !== 0) {
					if (oDOMSeparatorLabels.firstElementChild === null) {
						for (j = 0 ; j < 4 ; j ++) {
							var oDOMLabelsNameSeparator = document.createElement("span");
							oDOMLabelsNameSeparator.className = "labelsNameSeparator";
							oDOMLabelsNameSeparator.style.backgroundColor = aLabelColor[j][aLabels[j]];
							oDOMLabelsNameSeparator.innerHTML = oLabels.content[j][aLabels[j]];
							oDOMSeparatorLabels.appendChild(oDOMLabelsNameSeparator);
						}		
					}
				}
				//alert (nNbOfToDoInLabels+"     "+aLabelNbItems[sLabels])
				for (i = 0 ; i < nNbOfToDoInLabels; i++ ) {
					sContent = oToDoListJSONParsed[sLabels][i][0];
					var oDOMToDo = document.createElement("div");
					oDOMToDo.style.backgroundColor = backgroundColorToDo;
					oDOMToDo.className = 'toDo';
					oDOMToDo.content = sContent;
					oDOMToDo.innerHTML = hackDisplayLinks(sContent).replace(/\n/gi, "<Br>")+'<span class="dateExpired">'+ (oDOMToDo.dateExpired === undefined ? "" : oDOMToDo.dateExpired) + '</div>'; 
					document.getElementById("noScroll").insertBefore(oDOMToDo , document.getElementById("separatorLabels"+sLabels).nextSibling);
				}
			aLabelNbItems[sLabels] += nNbOfToDoInLabels;	
			}
			else {
				var aDOMToDoToDisplay = document.querySelectorAll('div[id^="toDo' + sLabels + '"]');
				for (var j = 0 ; j < aDOMToDoToDisplay.length ; j++) {
					aDOMToDoToDisplay[j].style.display = 'block';
					var oDOMIsSeparator = aDOMToDoToDisplay[j].previousSibling;
					if (oDOMIsSeparator.id.substr(0,6) == "separa") {
						oDOMIsSeparator.style.display ='block';
					}	
				}
			}
		}		
	}
}				

function handleErrorsFromServer(errorMessageFromServer) {
	if (errorMessageFromServer==="reload") {
		alert ("Veuillez recharger la page, elle a dû être modifiée dans une autre page et n'est plus à jour. Si le problème persiste, contacter l'administrateur du site");
	}
	else {
		alert ("Erreur inattendue lors de la mise à jour dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);
	}
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

function hackDisplayLinks(str) {
	return str.replace(/([-a-z0-9+&@#\/%?=~_|!:,;]+\.)+[-a-z0-9+&@#\/%?=~_|!:,;]+/gi, function (x) {
		return '<a href="'+(x.startsWith('http') ? '' : 'http://')+x+'" target="_blank">'+x+'</a>';
	});
}