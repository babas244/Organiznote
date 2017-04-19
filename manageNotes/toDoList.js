var toDoFocused = [{id:null},{sLabels:null},{position:null}];
var aNbOfLabels = [5,3,3,3]; // à charger depuis la bdd
var isDisplayDateExpired = false;
var aLabelsChecked =[[1,0,0,0,0],[1,1,1],[1,1,1],[1,1,1]]; // à fabriquer par une boucle après chargement de aNbOfLabels
var aLabelNbItems = {}; 

initializePageToDo();

function initializePageToDo () {
	addEventsDragAndDropToLastAndInvisible(document.getElementById("lastAndInvisible"));
	counterInsertDivSeparatorLabels();
	document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
	ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + "&label0=0&label1=012&label2=012&label3=012", initializetoDoFailed, insertToDoListBefore, retrieveLabels);	
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
}

function retrieveLabels() {
	ajaxCall('phpAjaxCalls_ToDo/retrieveLabels.php?idTopic=' + idTopic, initializetoDoFailed, displayLabelsCheckboxes); 	
}

document.getElementById("addToDoButton").addEventListener('click', initializeFormToDo, false);
document.getElementById("cancelAddToDo").addEventListener('click', hideFormEnterToDo, false);
document.getElementById("resetAddToDoForm").addEventListener('click', resetFormToDo, false);
document.getElementById("deleteToDo").addEventListener('click', deleteToDo, false);
document.getElementById("StatedToDoDone").addEventListener('click', stateToDoDone, false);
document.getElementById("editToDo").addEventListener('click', editToDo, false);
document.getElementById("cancelContextMenu").addEventListener('click', hideContextMenuToDo, false);

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
		for (var labelRank = 0 ; labelRank < oLabels.content[labelTitleRank].length; labelRank++) {
			var oDOMLabelCheckbox = document.createElement("input");
			oDOMLabelCheckbox.type = "checkbox";
			oDOMLabelCheckbox.id = "checkboxLabel"+labelTitleRank+"a"+labelRank;
			oDOMLabelCheckbox.labelTitleRank = labelTitleRank;
			oDOMLabelCheckbox.labelRank = labelRank;
			oDOMLabelCheckbox.addEventListener('input', function (e){
				displayToDoList(e.target.labelTitleRank, e.target.labelRank, e.target.checked);
				// faut-il mettre ici à jour aLabelsChecked ?
			}, false);
			document.getElementById("containerOfLabelsCheckBoxes").appendChild(oDOMLabelCheckbox);
			var oDOMDivLabel = document.createElement("span");
			oDOMDivLabel.innerHTML = oLabels.content[labelTitleRank][labelRank];
			document.getElementById("containerOfLabelsCheckBoxes").appendChild(oDOMDivLabel);				
		}	
		oDOMElementBr = document.createElement("Br");
		document.getElementById("containerOfLabelsCheckBoxes").appendChild(oDOMElementBr);
	}
	updateCheckboxes();
	resetToDoReadyForEvent();
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
			}
		}
	}
}

function insertToDoListBefore(sToDoListJSON, fCallback, sIsNew) {
	//alert ("sToDoListJSON : " + sToDoListJSON + " fCallback :" + fCallback.name + " sIsNew : " + sIsNew);
	//if (sToDoListJSON =="" && pathFocused=="01") {alert("Pas encore de notes. Cliquer sur le + pour en ajouter une.");}
	var oToDoListJSONParsed = sToDoListJSON == "" ? "" : JSON.parse(sToDoListJSON);
	var sContent;
	var nNbOfToDoInLabels;
	for (sLabels in oToDoListJSONParsed) {
		if (aLabelNbItems[sLabels] === undefined || sIsNew === "newNote") { // il faut en fait deux fCallback différentes ici
			aLabels = sLabels.split("");
			nNbOfToDoInLabels = oToDoListJSONParsed[sLabels].length;
			aLabelNbItems[sLabels] = aLabelNbItems[sLabels]=== undefined ? 0 : aLabelNbItems[sLabels];
			//alert (nNbOfToDoInLabels+"     "+aLabelNbItems[sLabels])
			for (var i = 0 ; i < nNbOfToDoInLabels; i++ ) {
				sContent = oToDoListJSONParsed[sLabels][i][0].replace(/&lt;br&gt;/gi, "\n");
				var oDOMToDo = document.createElement("div");
				oDOMToDo.id = 'toDo'+sLabels+(parseInt(i)+parseInt(aLabelNbItems[sLabels]));
				addContextMenu(oDOMToDo);
				oDOMToDo.className = 'toDo toDo0a'+aLabels[0]+' toDo1a'+aLabels[1]+' toDo2a'+aLabels[2]+' toDo3a'+aLabels[3];
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
			}
		}
	}
	fCallback();
}				
				
function deleteToDo () {
	if (confirm("Êtes-vous sûr de bien vouloir effacer la note :\n" + document.getElementById(toDoFocused[0].id).content) == true) {
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
		ajaxCall('phpAjaxCalls_ToDo/deleteToDo.php?idTopic=' + idTopic + "&sLabels=" + toDoFocused[0].sLabels + "&position=" + toDoFocused[0].position, deleteToDoFailed, deleteToDoAndHideContextMenu, toDoFocused[0].id);	
	}
	else { 
		hideContextMenuToDo();
	}
}

function stateToDoDone () {
	if (confirm("Êtes-vous sûr de bien vouloir archiver comme faite la note :\n" + document.getElementById(toDoFocused[0].id).content) == true) {
			var dateArchiveCreated = new Date()
			var dateArchive = dateArchiveCreated.toISOString().substr(0,11)+dateArchiveCreated.getHours()+dateArchiveCreated.toISOString().substr(13,3);
			var sForm = '[{"name":"DateArchive", "attributes" : {"value" : "' + dateArchive + '" }, "label" : "Date d\'archivage (format AAAA-MM-JJThh:mm)"}]';
		//alert (sForm);
		superFormModale(sForm, "Confirmation de la date d'archivage", setToDoDoneAjax, "array", fCheckFormDateArchive);
	} 
	else {
		hideContextMenuToDo();
	}
}

function setToDoDoneAjax(aFormDateArchive) {
	document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
	ajaxCall('phpAjaxCalls_ToDo/stateToDoDone.php?idTopic=' + idTopic + '&dateArchive=' + aFormDateArchive[0].replace("T"," ")+":00" + "&sLabels=" + toDoFocused[0].sLabels + "&position=" + toDoFocused[0].position, setToDoDoneFailed, deleteToDoAndHideContextMenu, toDoFocused[0].id);		
}

function deleteToDoAndHideContextMenu(errorMessageFromServer,idDOMToDelete) {
	//alert(errorMessageFromServer + " dans deleteToDoAndHideContextMenu")
	if (errorMessageFromServer==="") {
		deleteToDoFromDOM(idDOMToDelete);
	} 
	else {
		alert ("Erreur inattendue lors de la mise à jour dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);
	}
	hideContextMenuToDo();
	resetToDoReadyForEvent();
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
			ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + ResponseForm[0] + "&dateCreation=" + dateCreation + "&sLabels=" + sLabels, submitToDoFullFailed, addNewToDoWithLabels, sToDoAddedJSON);
		}
		else { // c'est donc un update que l'on fait
			document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
			ajaxCall('phpAjaxCalls_ToDo/updateToDo.php?idTopic=' + idTopic + "&toDoContent=" + ResponseForm[0] + "&sLabels=" + toDoFocused[0].sLabels + "&position=" + toDoFocused[0].position + "&sNewLabels=" + sLabelsForm, updateToDoFailed, updateToDo, ResponseForm[0], sLabelsForm);
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
	//alert (errorMessageFromServer + " in updateToDo ")
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
		alert ("Erreur inattendue lors de l'update dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
	hideContextMenuToDo();
}

function deleteToDoFromDOM (idDOMToDoFocused) {
	document.getElementById('noScroll').removeChild(document.getElementById(idDOMToDoFocused)); 
	for (var i = parseInt(toDoFocused[0].position) + 1 ; i < aLabelNbItems[toDoFocused[0].sLabels] ; i++) {
		document.getElementById('toDo'+toDoFocused[0].sLabels+i).id = 'toDo'+toDoFocused[0].sLabels+parseInt(i-1); // on décale les id de 1
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
	hideFormEnterToDo();
	if (sToDoContent !=="") {
		var dateCreation = sLocalDatetime(new Date());
		var sToDoAddedJSON = '{"0000":[["'+ sToDoContent +'","'+ dateCreation +'",""]]}';
		if (aLabelNbItems["0000"] === undefined) {
			aLabelNbItems["0000"]=0;
		}
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
		ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + sToDoContent + "&dateCreation=" + dateCreation + "&sLabels=0000", submitToDoQuickFailed, submitToDoQuickCheckResponse, sToDoAddedJSON);
	}
}

function submitToDoQuickCheckResponse(errorMessageFromServer, sToDoAddedJSON) {
	if (errorMessageFromServer==="") {
		insertToDoListBefore(sToDoAddedJSON, resetToDoReadyForEvent, "newNote");
	}
	else {
		alert ("Erreur inattendue lors de l'update dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
	hideContextMenuToDo();
}


function hideFormEnterToDo() {
	document.getElementById("addToDoForm").reset();
	document.getElementById('addToDoFrame').style.display = 'none';
	document.getElementById('addToDoButton').style.display = 'block';
} 

function resetFormToDo() {
	document.getElementById("addToDoForm").reset();	
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
		document.getElementById(toDoFocused[0].id).style.backgroundColor = '#eeaaee';
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
		var droppedElement = document.getElementById(idDroppedElement);
		var newElement = droppedElement.cloneNode(true);
		addEventsDragAndDrop(newElement);
		addContextMenu(newElement);
		this.parentNode.insertBefore(newElement, this);
		droppedElement.parentNode.removeChild(droppedElement);
	}, false);	
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
	oDOMToDo.addEventListener('contextmenu', function(e) {
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