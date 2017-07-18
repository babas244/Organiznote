var toDoFocused = [{id:null},{sLabels:null},{position:null}];
var aNbOfLabels =[];
var isDisplayDateExpired = false;
var aLabelsChecked = [];
var aLabelNbItems = {}; 
var toDoSendGeolocationLabels = null;
var toDoSendGeolocationPosition = null;
var aLabelColor = [];
var isToDoOkToMoveRankOnServer = true; 
var lengthCheckedString = 30;

initializePageToDo();

function initializePageToDo () {
	addEventsDragAndDropToLastAndInvisible(document.getElementById("lastAndInvisible"));
	document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
	ajaxCall('phpAjaxCalls_ToDo/retrieveLabels.php?idTopic=' + idTopic, initializetoDoFailed, displayLabelsCheckboxes);
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
	retrieveToDoListFirstTime();
}

function retrieveToDoListFirstTime() {
	var sLabelsPhp="";
	var labelTitleRank;
	var labelRank;
	for (labelTitleRank = 0 ; labelTitleRank < 4 ; labelTitleRank++) {
		//alert (sLabelsPhp)
		sLabelsPhp += "&label" + labelTitleRank + "="
		if (labelTitleRank === 0) {
			sLabelsPhp += "0"; 
		}  
		else {
			for (labelRank = 0 ; labelRank < aNbOfLabels[labelTitleRank]; labelRank++) {
				sLabelsPhp += labelRank;
			}			
		}
	}
	//alert (sLabelsPhp);
	ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + sLabelsPhp, initializetoDoFailed, insertToDoListBefore, resetToDoReadyForEvent);	
	
}

document.getElementById("addToDoButton").addEventListener('click', initializeFormToDo, false);
document.getElementById("cancelAddToDo").addEventListener('click', hideFormEnterToDo, false);
document.getElementById("resetAddToDoForm").addEventListener('click', resetFormToDo, false);
document.getElementById("deleteToDo").addEventListener('click', deleteToDo, false);
document.getElementById("StatedToDoDone").addEventListener('click', stateToDoDone, false);
document.getElementById("editToDo").addEventListener('click', editToDo, false);
document.getElementById("cancelContextMenu").addEventListener('click', hideContextMenuToDo, false);
document.getElementById("exportToDoList").addEventListener('click', exportToDoList, false);

document.getElementById("noScroll").addEventListener('touchmove', function(event) {
	event.preventDefault();
}, false);

document.getElementById("addToDoForm").addEventListener('submit', function(e) {
	e.preventDefault();
	submitToDoQuick();
}, false);

function initializetoDoFailed(errorMessage) {
	alert ("L'initialisation de la todo liste n'a pas fonctionné. Veuillez recharger la page (touche F5)." + errorMessage);
	resetToDoReadyForEvent();
}

function loadToDoListFailed(errorMessage) {
	alert ("La liste ne peut pas être chargée depuis le serveur. Vérifiez votre connexion Internet et recommencez." + errorMessage);
	resetToDoReadyForEvent();
}

function deleteToDoFailed(errorMessage) {
	alert ("Impossible d'effacer la note sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenuToDo();
	resetToDoReadyForEvent();
}

function setToDoDoneFailed(errorMessage) {
	alert ("Impossible d'accéder à la note sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenuToDo();
	resetToDoReadyForEvent();
}

function submitToDoFullFailed(errorMessage) {
	alert ("Impossible d'accéder à la note sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenuToDo();
	resetToDoReadyForEvent();
}

function updateToDoFailed(errorMessage) {
	alert ("Impossible d'accéder à la note sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenuToDo();
	resetToDoReadyForEvent();
}
	
function submitToDoQuickFailed(errorMessage) {
	alert ("Impossible d'accéder à la note sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage);
}

function displayLabelsCheckboxes(sLabelsJSON) {
	oLabels = JSON.parse(sLabelsJSON);
	for (var labelTitleRank = 0; labelTitleRank < oLabels.title.length; labelTitleRank ++) {
		aLabelsChecked[labelTitleRank] = [];
		aLabelColor[labelTitleRank] = [];
		for (var labelRank = 0 ; labelRank < oLabels.content[labelTitleRank].length; labelRank++) {
			aNbOfLabels[labelTitleRank] = oLabels.content[labelTitleRank].length;
			var oDOMFrameCheckbox = document.createElement("span");
			oDOMFrameCheckbox.className = 'frameCheckbox';
			//alert ('h = ' + labelTitleRank/oLabels.title.length + '    s = ' + labelRank/oLabels.content[labelTitleRank].length);
			aLabelColor[labelTitleRank][labelRank] = HSVtoHex(labelTitleRank/oLabels.title.length,(labelRank)/oLabels.content[labelTitleRank].length, 1)
			oDOMFrameCheckbox.style.backgroundColor = aLabelColor[labelTitleRank][labelRank];
			document.getElementById("containerOfLabelsCheckBoxes").appendChild(oDOMFrameCheckbox);
			var oDOMLabelCheckbox = document.createElement("input");
			oDOMLabelCheckbox.type = "checkbox";
			oDOMLabelCheckbox.id = "checkboxLabel"+labelTitleRank+"a"+labelRank;
			oDOMLabelCheckbox.labelTitleRank = labelTitleRank;
			oDOMLabelCheckbox.labelRank = labelRank;
			oDOMLabelCheckbox.addEventListener('change', function (e){
				displayToDoList(e.target.labelTitleRank, e.target.labelRank, e.target.checked);
				// faut-il mettre ici à jour aLabelsChecked ?
			}, false);
			oDOMFrameCheckbox.appendChild(oDOMLabelCheckbox);
			var oDOMDivLabel = document.createElement("label");
			oDOMDivLabel.innerHTML = oLabels.content[labelTitleRank][labelRank];
			oDOMDivLabel.htmlFor = oDOMLabelCheckbox.id;
			oDOMFrameCheckbox.appendChild(oDOMDivLabel);
			aLabelsChecked[labelTitleRank][labelRank] = (labelTitleRank === 0 &&  labelRank > 0) ? 0 : 1;// [[1,0,0,0,0],[1,1,1],[1,1,1],[1,1,1]];
		}	
		oDOMElementBr = document.createElement("Br");
		document.getElementById("containerOfLabelsCheckBoxes").appendChild(oDOMElementBr);
	}
	updateCheckboxes();
	counterInsertDivSeparatorLabels();
}
			
function resetToDoReadyForEvent() {
	document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'none';
}

function updateCheckboxes() {
	for (var labelTitleRank = 0 ; labelTitleRank < 4 ; labelTitleRank++) {
		for (var labelRank = 0 ; labelRank < aNbOfLabels[labelTitleRank] ; labelRank++) {
			document.getElementById("checkboxLabel"+labelTitleRank+"a"+labelRank).checked = aLabelsChecked[labelTitleRank][labelRank];
		}
	}	
}

function displayToDoList (labelTitleRank, labelRank, isChecked) {
	if (isChecked) {
			aLabelsChecked[labelTitleRank][labelRank] = 1;
			var addressPhpLabels ="&";
			for (var i = 0 ; i < 4 ; i++) {
				if (i!==labelTitleRank) {
					addressPhpLabels += 'label'+i+'=';
					for (var j = 0 ; j < aNbOfLabels[i] ; j++) {
						if (aLabelsChecked[i][j]) {							
							addressPhpLabels += j;
						}
					}
				addressPhpLabels += '&';
				}
			}
			addressPhpLabels += 'label'+labelTitleRank+'='+labelRank;
			//alert (addressPhpLabels);
			document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
			ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + addressPhpLabels, loadToDoListFailed, insertToDoListBefore, resetToDoReadyForEvent)		
		}
	else { // unchecked
		aLabelsChecked[labelTitleRank][labelRank] = 0;
		var aDOMHasClassOfToDo = document.querySelectorAll('.toDo'+labelTitleRank+'a'+labelRank);  //('div[classname="toDo'+labelTitleRank+'a'+labelRank+'"]'); marche pas ??
		var numberOfToDo = aDOMHasClassOfToDo.length;
		//alert (numberOfToDo);	
		if (numberOfToDo !== 0) {
			for (var k = 0; k < numberOfToDo ; k++) {
				aDOMHasClassOfToDo[k].style.display = 'none';
				var oDOMISSeparator = aDOMHasClassOfToDo[k].previousSibling; //previousElementSibling non ???
				if (oDOMISSeparator.id.substr(0,6) == "separa") {
					oDOMISSeparator.style.display ='none';
				}
			}
		}
	}
}

function insertToDoListBefore(sToDoListJSON, fCallback, sIsNew) {
	//alert ("sToDoListJSON : " + sToDoListJSON + " fCallback :" + fCallback.name + " sIsNew : " + sIsNew);
	//if (sToDoListJSON =="" && pathFocused=="01") {alert("Pas encore de notes. Cliquer sur le + pour en ajouter une.");}
	
	if (sToDoListJSON !== "" && IsJSONValid(sToDoListJSON)) {
		var oToDoListJSONParsed = JSON.parse(sToDoListJSON);
		var sContent;
		var nNbOfToDoInLabels;
		var i,j;
		for (sLabels in oToDoListJSONParsed) {
			if (aLabelNbItems[sLabels] === undefined || sIsNew === "newNote") { // il faut en fait deux fCallback différentes ici
				aLabels = sLabels.split("");
				nNbOfToDoInLabels = oToDoListJSONParsed[sLabels].length;
				aLabelNbItems[sLabels] = aLabelNbItems[sLabels]=== undefined ? 0 : aLabelNbItems[sLabels]; // dernier membre : nNbOfToDoInLabels ou aLabelNbItems[sLabels] ??
				//alert (sLabels + " " + aLabelNbItems[sLabels]);
				var oDOMSeparatorLabels = document.getElementById("separatorLabels"+sLabels);
				if (nNbOfToDoInLabels !== 0) {
					if (oDOMSeparatorLabels.firstElementChild === null) {
						for (j = 0 ; j < 4 ; j ++) {
							var oDOMLabelsNameSeparator = document.createElement("span");
							oDOMLabelsNameSeparator.className = "labelsNameSeparator";
							//alert (aLabelColor[j][aLabels[j]]);
							oDOMLabelsNameSeparator.style.backgroundColor = aLabelColor[j][aLabels[j]];
							oDOMLabelsNameSeparator.innerHTML = oLabels.content[j][aLabels[j]];
							//alert ("separatorLabels"+sLabels);
							oDOMSeparatorLabels.appendChild(oDOMLabelsNameSeparator);
						}		
					}
				}
				//alert (nNbOfToDoInLabels+"     "+aLabelNbItems[sLabels])
				for (i = 0 ; i < nNbOfToDoInLabels; i++ ) {
					sContent = oToDoListJSONParsed[sLabels][i][0].replace(/&lt;br&gt;/gi, "\n");
					var oDOMToDo = document.createElement("div");
					oDOMToDo.id = 'toDo'+sLabels+(parseInt(i)+parseInt(aLabelNbItems[sLabels]));
					addContextMenu(oDOMToDo);
					oDOMToDo.style.backgroundColor = backgroundColorToDo;
					oDOMToDo.className = 'unselectable toDo toDo0a'+aLabels[0]+' toDo1a'+aLabels[1]+' toDo2a'+aLabels[2]+' toDo3a'+aLabels[3];
					oDOMToDo.draggable = "true";
					oDOMToDo.dateCreation = oToDoListJSONParsed[sLabels][i][1];
					oDOMToDo.dateExpired = oToDoListJSONParsed[sLabels][i][2];
					oDOMToDo.content = sContent;
					oDOMToDo.innerHTML = sContent+'<span class="dateExpired">'+ (oDOMToDo.dateExpired === undefined ? "" : oDOMToDo.dateExpired) + '</div>'; 
					addEventsDragAndDrop(oDOMToDo);
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
	fCallback();
}				
				
function deleteToDo () {
	if (confirm("Êtes-vous sûr de bien vouloir effacer la note :\n" + document.getElementById(toDoFocused[0].id).content) == true) {
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
		ajaxCall('phpAjaxCalls_ToDo/deleteToDo.php?idTopic=' + idTopic 
		+ "&sLabels=" + toDoFocused[0].sLabels 
		+ "&position=" + toDoFocused[0].position
		+ "&sContentStart=" + document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString), 
		deleteToDoFailed, deleteToDoAndHideContextMenu, toDoFocused[0].id);	
	}
	else { 
		hideContextMenuToDo();
	}
}

function stateToDoDone () {
	if (confirm("Êtes-vous sûr de bien vouloir archiver comme faite la note :\n" + document.getElementById(toDoFocused[0].id).content) == true) {
			var dateArchiveCreated = new Date()
			var dateArchive = dateArchiveCreated.toISOString().substr(0,11)+XX(dateArchiveCreated.getHours())+dateArchiveCreated.toISOString().substr(13,3);
			var sForm = '[{"name":"DateArchive", "attributes" : {"value" : "' + dateArchive + '" }, "label" : "Date d\'archivage (format AAAA-MM-JJThh:mm)"}]';
		//alert (sForm);
		superFormModale(sForm, "Confirmation de la date d'archivage", setToDoDoneAjax, "array", fCheckFormDateArchive);
	} 
	else {
		hideContextMenuToDo();
	}
}

function setToDoDoneAjax(aFormDateArchive) {
	if (aFormDateArchive !== "") {
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
		ajaxCall('phpAjaxCalls_ToDo/stateToDoDone.php?idTopic=' + idTopic 
		+ '&dateArchive=' + aFormDateArchive[0].replace("T"," ")+":00" 
		+ "&sLabels=" + toDoFocused[0].sLabels + "&position=" 
		+ toDoFocused[0].position
		+ "&sContentStart=" + document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString), 		
		setToDoDoneFailed, deleteToDoAndHideContextMenu, toDoFocused[0].id);		
	}
	else {
		hideContextMenuToDo();
	}
}

function deleteToDoAndHideContextMenu(errorMessageFromServer,idDOMToDelete) {
	//alert(errorMessageFromServer + " dans deleteToDoAndHideContextMenu")
	if (errorMessageFromServer==="") {
		deleteToDoFromDOM(idDOMToDelete);
	} 
	else {
		handleErrorsFromServer(errorMessageFromServer);
	}
	hideContextMenuToDo();
	resetToDoReadyForEvent();
}

function handleErrorsFromServer(errorMessageFromServer) {
	if (errorMessageFromServer==="reload") {
		alert ("Veuillez recharger la page, elle a dû être modifiée dans une autre page et n'est plus à jour. Si le problème persiste, contacter l'administrateur du site");
		resetToDoReadyForEvent();
	}
	else {
		alert ("Erreur inattendue lors de la mise à jour dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);
	}
}

function fCheckFormDateArchive() {
	if (/^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]$/.test(oForm[0].value)) {
		return 'ok';		
	} 
	else {
		alert ('Format de date non correct, il faut AAAA-MM-JJThh:mm, et dans des valeurs possibles')
		return "DateArchive"
	}
}

function editToDo() {
	var sForm = '[';
	sForm += '{"name":"content","HTMLType" : "textarea" , "attributes" : { "rows" : "5" , "cols" : "30", "maxLength" : "1700", "value" : "' + document.getElementById(toDoFocused[0].id).content + '" }, "label" : "note"},{';
	for (var labelTitleRank = 0; labelTitleRank < oLabels.title.length; labelTitleRank ++) {
		sForm += '"name":"'+labelTitleRank+'","HTMLType":"select","attributes":{"selectedIndex":"'+toDoFocused[0].sLabels.substr(labelTitleRank,1)+'"},"options":['; 
		for (var labelRank = 0 ; labelRank < oLabels.content[labelTitleRank].length; labelRank++) {
			sForm += '"'+oLabels.content[labelTitleRank][labelRank]+'",';
		}
	sForm = sForm.slice(0,-1)+ '], "label" : "'+oLabels.title[labelTitleRank]+'"},{';
	}
	sForm = sForm.slice(0,-2)+']';
	superFormModale(sForm, "Etiquettes", submitToDoFull, "array", fCheckFormToDo);
}

function fCheckFormToDo(){
	if (oForm[0].value ==="") {
		alert('La note est vide, il faut la remplir.')
		return 'content';
	}
	else {
		return "ok";
	}
}

function submitToDoFull(ResponseForm) {
	if (ResponseForm !== "") {
		var sLabelsForm = ResponseForm[1].toString()+ResponseForm[2]+ResponseForm[3]+ResponseForm[4];
		if (toDoFocused[0].id === null ) {
			var dateCreation = sLocalDatetime(new Date());
			var sToDoAddedJSON = '{"'+ sLabelsForm +'":[["'+ ResponseForm[0] +'","'+ dateCreation +'",""]]}';
			//alert (sToDoAddedJSON);
			document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
			ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic 
			+ "&toDoContent=" + ResponseForm[0] 
			+ "&dateCreation=" + dateCreation 
			+ "&sLabels=" + sLabels
			+ "&sContentStart=" + document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString), 
			submitToDoFullFailed, addNewToDoWithLabels, sToDoAddedJSON);
		}
		else { // c'est donc un update que l'on fait
			document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
			ajaxCall('phpAjaxCalls_ToDo/updateToDo.php?idTopic=' + idTopic 
			+ "&toDoContent=" + encodeURIComponent(ResponseForm[0])
			+ "&sLabels=" + toDoFocused[0].sLabels 
			+ "&position=" + toDoFocused[0].position 
			+ "&sNewLabels=" + sLabelsForm 
			+ "&sContentStart=" + document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString), 
			updateToDoFailed, updateToDo, ResponseForm[0], sLabelsForm);
		}
	}
	else {
		hideContextMenuToDo();
	}
}

function addNewToDoWithLabels(errorMessageFromServer,sToDoAddedJSON) {
	//alert (errorMessageFromServer)
	if (errorMessageFromServer==="") {
		insertToDoListBefore(sToDoAddedJSON, hideContextMenuToDo);
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'none';
	} 
	else {
		alert ("Erreur inattendue lors de l'insertion de la note dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);
	}
	hideContextMenuToDo();
}

function updateToDo(errorMessageFromServer , sNewContent, sNewLabels) {
	if (errorMessageFromServer==="") {
		var oDOMToDoFocused = document.getElementById(toDoFocused[0].id);
		if (toDoFocused[0].sLabels === sNewLabels) { // les sLabels ne changent pas
			oDOMToDoFocused.innerHTML = sNewContent + '<span class="dateExpired">'+ (oDOMToDoFocused.dateExpired === undefined ? "" : oDOMToDoFocused.dateExpired) + '</div>'
			oDOMToDoFocused.content = sNewContent;
		}
		else { // les sLabels changent aussi
			deleteToDoFromDOM(toDoFocused[0].id);
			var aLabelsOfNewToDo = sNewLabels.split("");
			if (aLabelsChecked[0][aLabelsOfNewToDo[0]]==1 && aLabelsChecked[1][aLabelsOfNewToDo[1]]==1 && aLabelsChecked[2][aLabelsOfNewToDo[2]]==1 && aLabelsChecked[3][aLabelsOfNewToDo[3]]==1) {// afficher le nouveau toDo seulement si il a des labels d�j� demand�s � �tre affich�s
				var sToDoNewJSON = '{"'+ sNewLabels +'":[["'+ sNewContent +'","'+ oDOMToDoFocused.dateCreation +'","'+ (oDOMToDoFocused.dateExpired === undefined ? "" : oDOMToDoFocused.dateExpired) +'"]]}';
				insertToDoListBefore(sToDoNewJSON, hideContextMenuToDo, "newNote");
			}
		}
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'none';
	}
	else {
		handleErrorsFromServer(errorMessageFromServer);
	}
	hideContextMenuToDo();
}

function deleteToDoFromDOM (idDOMToDoFocused) {
	document.getElementById('noScroll').removeChild(document.getElementById(idDOMToDoFocused));
	if (aLabelNbItems[toDoFocused[0].sLabels] === 1) {// s'il n'y avait qu'une seule note au moment de l'effacement
		document.getElementById("separatorLabels"+toDoFocused[0].sLabels).style.display = 'none';
	}
	else {
		for (var i = parseInt(toDoFocused[0].position) + 1 ; i < aLabelNbItems[toDoFocused[0].sLabels] ; i++) {
			document.getElementById('toDo'+toDoFocused[0].sLabels+i).id = 'toDo'+toDoFocused[0].sLabels+parseInt(i-1); // on décale les id de 1
		}
	}
	aLabelNbItems[toDoFocused[0].sLabels] -= 1;
}				

function initializeFormToDo() {
	document.getElementById('addToDoButton').style.display = 'none';
	document.getElementById('addToDoFrame').style.display = 'block';
	document.getElementById("toDoTextarea").focus();
}


function submitToDoQuick(){
	var sToDoContent = document.getElementById("toDoTextarea").value;
	if (sToDoContent !=="") {
		var dateCreation = sLocalDatetime(new Date());
		var sToDoAddedJSON = '{"0000":[["'+ sToDoContent.replace(/"/gi,"\\\"") +'","'+ dateCreation +'",""]]}';
		if (aLabelNbItems["0000"] === undefined) {
			aLabelNbItems["0000"]=0;
		}
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
		ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + encodeURIComponent(sToDoContent) + "&dateCreation=" + dateCreation + "&sLabels=0000", submitToDoQuickFailed, submitToDoQuickCheckResponse, sToDoAddedJSON);
	}
}

function submitToDoQuickCheckResponse(errorMessageFromServer, sToDoAddedJSON) {
	if (errorMessageFromServer==="") {
		hideFormEnterToDo();
		insertToDoListBefore(sToDoAddedJSON, resetToDoReadyForEvent, "newNote");
		toDoSendGeolocationLabels = "0000";
		toDoSendGeolocationPosition = parseInt(aLabelNbItems["0000"]) - 1;
		getGeolocation(insertGeolocationToDoInDbb);
	}
	else if (errorMessageFromServer==="disconnected"){
		alert("Vous avez été déconnecté. Impossible de récupérer des données ou de faire des changements sur le serveur sans se reconnecter.");
		resetToDoReadyForEvent();		
	}
	else {
		alert ("Erreur inattendue lors de l'update dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}

function insertGeolocationToDoInDbb(oPosition) {
	if (oPosition==="not supported") {
		getGeolocationToDoFailed("Warning : Geolocation is not supported by this browser.");
	}
	else {
		ajaxCall('phpAjaxCalls_ToDo/insertToDoGeolocation.php?idTopic=' + idTopic 
		+ "&sLabels=" + toDoSendGeolocationLabels 
		+ "&position=" + toDoSendGeolocationPosition 
		+ "&latitude=" + oPosition.coords.latitude 
		+ "&longitude=" + oPosition.coords.longitude
		+ "&accuracyPosition=" + oPosition.coords.accuracy,
		+ "&sContentStart=" + document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString), 
		getGeolocationToDoFailed, getLocationToDoUpdateClient);	
	}
	toDoSendGeolocationLabels = null;
	toDoSendGeolocationPosition = null;
}

function getGeolocationToDoFailed(errorMessage) {
	alert (errorMessage + "\nLa position n'a pas pu être insérée.");
	//document.getElementById("noScroll").innerHTML += "la position n'a pas pu être insérée.";
}

function getLocationToDoUpdateClient(errorMessageFromServer) {
	if (errorMessageFromServer!=="") {
		handleErrorsFromServer(errorMessageFromServer);
	}
}

function hideFormEnterToDo() {
	document.getElementById("addToDoForm").reset();
	document.getElementById('addToDoFrame').style.display = 'none';
	document.getElementById('addToDoButton').style.display = 'block';
} 

function resetFormToDo() {
	document.getElementById("addToDoForm").reset();	
}

function exportToDoList() {
	window.open('exports/downloadToDoListJSON.php?idTopic='+idTopic);	
	alert("Le fichier à télécharger a été créé.");
}

function displayContextMenuToDo() {
	document.getElementById(toDoFocused[0].id).style.backgroundColor = '#777777';
	document.getElementById("containerOfLabelsCheckBoxes").style.display = 'none';
	document.getElementById('greyLayerOnNoScroll').style.display = 'block';
	document.getElementById('cancelContextMenu').style.display = 'inline-block';
	document.getElementById('deleteToDo').style.display = 'inline-block';
	document.getElementById('StatedToDoDone').style.display = 'inline-block';
	document.getElementById('editToDo').style.display = 'inline-block';
	
}

function hideContextMenuToDo () {
	if (document.getElementById(toDoFocused[0].id) !== null) {
		document.getElementById(toDoFocused[0].id).style.backgroundColor = backgroundColorToDo;
	}
	toDoFocused = [{id:null},{sLabels:null},{position:null}];
	document.getElementById('greyLayerOnNoScroll').style.display = 'none';
	document.getElementById("containerOfLabelsCheckBoxes").style.display = 'block';
	document.getElementById('cancelContextMenu').style.display = 'none';
	document.getElementById('deleteToDo').style.display = 'none';
	document.getElementById('StatedToDoDone').style.display = 'none';
	document.getElementById('editToDo').style.display = 'none';
	
}

function addEventsDragAndDrop(DOMElement) {
	DOMElement.addEventListener('dragstart', function(e){
		e.dataTransfer.setData("text", e.target.id);
	}, false);
	
	DOMElement.addEventListener('dragover', function(e) {
		e.preventDefault(); // Annule l'interdiction de drop
		this.style.borderTop = "10px blue solid";
	}, false);
					
	DOMElement.addEventListener('dragleave', function(e) {
		this.style.borderTop = "1px black solid";
	}, false);
	
	DOMElement.addEventListener('drop', function(e){
		e.preventDefault();
		this.style.borderTop = "1px black solid";
		var idDroppedElement = e.dataTransfer.getData("text");
		//alert ('idDroppedElement = ' + idDroppedElement);
		if (idDroppedElement.startsWith('toDo')) {
			var sLabels = idDroppedElement.substr(4,4); 
			if (sLabels === this.id.substr(4,4)) {
				var oldRank = parseInt(idDroppedElement.substr(8));
				var targetedRank = parseInt(this.id.substr(8));
				if (targetedRank !== oldRank && targetedRank !== oldRank - 1) {
					var droppedElement = document.getElementById(idDroppedElement);
					var newElement = droppedElement.cloneNode(true);
					addEventsDragAndDrop(newElement);
					addContextMenu(newElement);
					this.parentNode.insertBefore(newElement, this);
					droppedElement.parentNode.removeChild(droppedElement);
					//alert ('targetedRank = '+ targetedRank);
						if (targetedRank > oldRank) {
							upperRank = targetedRank;
							lowerRank = oldRank + 1;
							increase = - 1;
							var newRank = targetedRank;
						}
						else {
							upperRank = oldRank - 1;
							lowerRank = targetedRank + 1;
							increase = + 1;	
							var newRank = targetedRank + 1;
						}
					for (var i = lowerRank ; i <= upperRank ; i ++) {
						//alert ('Ancien id toDo+sLabels+i).id =' + document.getElementById('toDo'+sLabels+i).id + '\n et nouveau : '+ 'toDo'+sLabels+parseInt(i+increase));
						document.getElementById('toDo'+sLabels+i).id = 'toDo'+sLabels+parseInt(i+increase); // on décale les id de 1			
					}
					//alert ('newElement.id = ' + 'toDo'+sLabels+parseInt(newRank))
					newElement.id = 'toDo'+sLabels+parseInt(newRank); // on update oldRank en newRank					
					if (isToDoOkToMoveRankOnServer) {
						ajaxCall('phpAjaxCalls_ToDo/changeRankOfToDoInsideSLabels.php?idTopic=' + idTopic 
						+ "&sLabels=" + sLabels 
						+ "&oldRank=" + oldRank 
						+ "&targetedRank=" + targetedRank,
						//+ "&sContentStart=" + droppedElement.content.substr(0, lengthCheckedString), 
						changeRankOfToDoFailed, changeRankOfToDoClient);	
					}
				}
			}
		}
	}, false);	
}

function changeRankOfToDoFailed(errorMessage) {
	console.log("Accès au serveur impossible, pas de déplacement du toDO dans le serveur" + errorMessage);
	isToDoOkToMoveRankOnServer = false;
}

function changeRankOfToDoClient(errorMessageFromServer) {
	if (errorMessageFromServer !== "") {
		handleErrorsFromServer(errorMessageFromServer);	
		isToDoOkToMoveRankOnServer = false;
	}
}

function addEventsDragAndDropToLastAndInvisible(DOMElement) {
	DOMElement.addEventListener('dragover', function(e) {
		e.preventDefault(); // Annule l'interdiction de drop
		this.style.borderTop = "10px blue solid";
	}, false);

	DOMElement.addEventListener('dragleave', function(e) {
		this.style.borderTop = "none";
	}, false);
	
	DOMElement.addEventListener('drop', function(e){
		e.preventDefault();
		this.style.borderTop = "none";
		var idDroppedElement = e.dataTransfer.getData("text");
		var droppedElement = document.getElementById(idDroppedElement);
		var newElement = droppedElement.cloneNode(true); // faire seulement un insertbefore et plus besoin de removechild
		addEventsDragAndDrop(newElement);
		addContextMenu(newElement);
		this.parentNode.insertBefore(newElement, this);
		droppedElement.parentNode.removeChild(droppedElement);			
	}, false);	
}

function addContextMenu(oDOMToDo) {
	oDOMToDo.addEventListener('dblclick', function(e) {
		e.preventDefault();
		toDoFocused[0].id = e.target.id;
		toDoFocused[0].sLabels = toDoFocused[0].id.substr(4,4);
		toDoFocused[0].position = toDoFocused[0].id.substr(8); 
		displayContextMenuToDo();
	}, false);
}

function sLocalDatetime(date){
	return date.getFullYear()+"-"+XX(date.getMonth()+1)+"-"+XX(date.getDate())+" "+XX(date.getHours())+":"+XX(date.getMinutes())+":"+XX(date.getSeconds());	
}