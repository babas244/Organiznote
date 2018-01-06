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
var isUniqueLabelChecked = false;
var oJSONTemp = {};
var oJSONFormTemp = [];

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
	ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + sBuildLabelsPhp(0,0), initializetoDoFailed, insertToDoListBefore, resetToDoReadyForEvent);	
}

function sBuildLabelsPhp(labelTitleRankToDisplay, labelRankToDisplay) {
	var sLabelsPhp;
	var labelTitleRank;
	var labelRank;
	if (isUniqueLabelChecked) {
		sLabelsPhp="";
		for (labelTitleRank = 0 ; labelTitleRank < 4 ; labelTitleRank++) {
			//alert (sLabelsPhp)
			sLabelsPhp += "&label" + labelTitleRank + "="
			if (labelTitleRank === labelTitleRankToDisplay) {
				sLabelsPhp += labelRankToDisplay; 
			}  
			else {
				for (labelRank = 0 ; labelRank < aNbOfLabels[labelTitleRank]; labelRank++) {
					sLabelsPhp += labelRank;
				}			
			}
		}
	}
	else {
		sLabelsPhp ="&";
		for (var labelTitleRank = 0 ; labelTitleRank < 4 ; labelTitleRank++) {
			if (labelTitleRank!==labelTitleRankToDisplay) {
				sLabelsPhp += 'label'+labelTitleRank+'=';
				for (var labelRank = 0 ; labelRank < aNbOfLabels[labelTitleRank] ; labelRank++) {
					if (aLabelsChecked[labelTitleRank][labelRank]) {							
						sLabelsPhp += labelRank;
					}
				}
			sLabelsPhp += '&';
			}
		}
		sLabelsPhp += 'label'+labelTitleRankToDisplay+'='+labelRankToDisplay;		
	}
	//alert (sLabelsPhp);
	return sLabelsPhp;	
}

document.getElementById("addToDoButton").addEventListener('click', initializeFormToDo, false);
document.getElementById("cancelAddToDo").addEventListener('click', hideFormEnterToDo, false);
document.getElementById("resetAddToDoForm").addEventListener('click', resetFormToDo, false);
document.getElementById("deleteToDo").addEventListener('click', deleteToDo, false);
document.getElementById("StatedToDoDone").addEventListener('click', stateToDoDone, false);
document.getElementById("editToDo").addEventListener('click', editToDo, false);
document.getElementById("cancelContextMenu").addEventListener('click', hideContextMenuToDo, false);
document.getElementById("exportToDoList").addEventListener('click', exportToDoList, false);
document.getElementById("displayCompleteToDoList").addEventListener('click', displayCompleteToDoList, false);
document.getElementById("selectAllToDoOrOne").addEventListener('click', selectAllToDoOrOne, false);

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
	var labelRank;
	for (var labelTitleRank = 0 ; labelTitleRank < 4 ; labelTitleRank++) {
		for (labelRank = 0 ; labelRank < aNbOfLabels[labelTitleRank] ; labelRank++) {
			document.getElementById("checkboxLabel"+labelTitleRank+"a"+labelRank).checked = aLabelsChecked[labelTitleRank][labelRank];
		}
	}	
}

function displayToDoList (labelTitleRank, labelRank, isChecked) {	
	document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
	if (!isChecked) {  // if unchecked
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
	document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'none';
	}
	else { // isChecked
		if (isUniqueLabelChecked) {			
			var labelRankCounter;		
			for (var labelTitleRankCounter = 0 ; labelTitleRankCounter < 4 ; labelTitleRankCounter++) { // cocher correctement les checkboxLabel
				for (labelRankCounter = 0 ; labelRankCounter < aNbOfLabels[labelTitleRankCounter] ; labelRankCounter++) {
					if (labelTitleRankCounter !== labelTitleRank) { // on coche toutes les checkboxes si elles sont d'un autre title que celui demandé
						aLabelsChecked[labelTitleRankCounter][labelRankCounter] = 1;
						document.getElementById("checkboxLabel"+labelTitleRankCounter+"a"+labelRankCounter).checked = 1;
					}
					else if (labelRankCounter === labelRank) {
						aLabelsChecked[labelTitleRankCounter][labelRankCounter] = 1;				
					}
					else { // il faut donc aussi effacer les contenus de ces toDo ci
						aLabelsChecked[labelTitleRankCounter][labelRankCounter] = 0;
						document.getElementById("checkboxLabel"+labelTitleRankCounter+"a"+labelRankCounter).checked = 0;

						var aDOMHasClassOfToDo = document.querySelectorAll('div[class*="toDo"]'); //'+labelTitleRank+'a"]');  
						//alert ('div[class^="toDo'+labelTitleRank+'a"]');
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
			}		
		}
		else { // on demande pas de uniqueLabel
			aLabelsChecked[labelTitleRank][labelRank] = 1;
		}
	ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + sBuildLabelsPhp(labelTitleRank, labelRank), loadToDoListFailed, insertToDoListBefore, resetToDoReadyForEvent);	
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
					sContent = oToDoListJSONParsed[sLabels][i][0];
					var oDOMToDo = document.createElement("div");
					oDOMToDo.id = 'toDo'+sLabels+(parseInt(i)+parseInt(aLabelNbItems[sLabels]));
					addContextMenu(oDOMToDo);
					oDOMToDo.style.backgroundColor = backgroundColorToDo;
					oDOMToDo.className = 'unselectable toDo toDo0a'+aLabels[0]+' toDo1a'+aLabels[1]+' toDo2a'+aLabels[2]+' toDo3a'+aLabels[3];
					oDOMToDo.draggable = "true";
					oDOMToDo.dateCreation = oToDoListJSONParsed[sLabels][i][1];
					oDOMToDo.dateExpired = oToDoListJSONParsed[sLabels][i][2];
					oDOMToDo.content = sContent;
					oDOMToDo.innerHTML = sContent.replace(/\n/gi, "<Br>")+'<span class="dateExpired">'+ (oDOMToDo.dateExpired === undefined ? "" : oDOMToDo.dateExpired) + '</div>'; 
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
		+ "&sContentStart=" + encodeURIComponent(document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString)), 
		deleteToDoFailed, deleteToDoAndHideContextMenu, toDoFocused[0].id);	
	}
	else { 
		hideContextMenuToDo();
	}
}

function stateToDoDone () {
	var dateArchive = sLocalDatetime(new Date()).slice(0,-3);
	var dateCreation = document.getElementById(toDoFocused[0].id).dateCreation
	oJSONFormTemp[0] = {}; //mettre un var ici ?
	oJSONFormTemp[0].name = "DateArchive";
	oJSONFormTemp[0].attributes = {};
	oJSONFormTemp[0].attributes.value = dateArchive;
	oJSONFormTemp[0].label = "Date d\'archivage (format AAAA-MM-JJ hh:mm)";
	oJSONFormTemp[1]={};
	oJSONFormTemp[1].name = "content";
	oJSONFormTemp[1].HTMLType="textarea";
	oJSONFormTemp[1].attributes={};
	oJSONFormTemp[1].attributes.cols="30"
	oJSONFormTemp[1].attributes.maxLength="1700"
	oJSONFormTemp[1].attributes.rows="5"
	oJSONFormTemp[1].attributes.value= document.getElementById(toDoFocused[0].id).content;
	oJSONFormTemp[1].label="note";
	oJSONFormTemp[2] = {};
	oJSONFormTemp[2].name = "DateCreation";
	oJSONFormTemp[2].attributes = {};
	oJSONFormTemp[2].attributes.value = dateCreation;
	oJSONFormTemp[2].label = "Optionnel : remodifier date de création de la note (format AAAA-MM-JJ hh:mm:ss) initialement il y a <b>"
									+ displayDatesComparison(dateCreation, dateArchive+":00", "de création", "d'archive")+"</b>.";
	var sForm = JSON.stringify(oJSONFormTemp);
	oJSONFormTemp = [];
	superFormModale(sForm, "Confirmation de la date d'archivage", setToDoDoneAjax, fCheckFormDateArchive);
}

function setToDoDoneAjax(aFormDateArchive) {
	var sToDoContent = hackReplaceAll(aFormDateArchive[1]);
	if (aFormDateArchive !== "") {
		document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
		ajaxCall('phpAjaxCalls_ToDo/stateToDoDone.php?idTopic=' + idTopic 
		+ "&toDoContent=" + encodeURIComponent(sToDoContent) 
		+ '&dateArchive=' + aFormDateArchive[0]+":00" 
		+ '&dateCreation=' + aFormDateArchive[2]
		+ "&sLabels=" + toDoFocused[0].sLabels 
		+ "&position=" + toDoFocused[0].position
		+ "&sContentStart=" + encodeURIComponent(document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString)), 		
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

function fCheckFormDateArchive(aResponseFormArray) {
	if (!/^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]$/.test(aResponseFormArray[0])) {
		alert ('Le format de la date d\'archivage est non correct, il faut AAAA-MM-JJ hh:mm, et dans des valeurs possibles');
		return "DateArchive";
	}
	if (aResponseFormArray[1] ==="") {
		alert('La note est vide, il faut la remplir.')
		return "DateArchive";
	}
	if (!/^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(aResponseFormArray[2])) {
		alert ('Le format de la date de création de la note est non correct, il faut AAAA-MM-JJ hh:mm:ss, et dans des valeurs possibles');
		return "DateArchive";
	} 
	return "ok";
}

function editToDo() {
	oJSONFormTemp[0]={};
	oJSONFormTemp[0].name = "content";
	oJSONFormTemp[0].HTMLType="textarea";
	oJSONFormTemp[0].attributes={};
	oJSONFormTemp[0].attributes.cols="30"
	oJSONFormTemp[0].attributes.maxLength="1700"
	oJSONFormTemp[0].attributes.rows="5"
	oJSONFormTemp[0].attributes.value= document.getElementById(toDoFocused[0].id).content;
	oJSONFormTemp[0].label="note";
	var rankInForm = 1
	for (var labelTitleRank = 0; labelTitleRank < oLabels.title.length; labelTitleRank ++) {
		for (var labelRank = 0 ; labelRank < oLabels.content[labelTitleRank].length; labelRank++) {	
			oJSONFormTemp[rankInForm]= {};
			if (labelRank === 0) {
				oJSONFormTemp[rankInForm].labelForAllRadioList = oLabels.title[labelTitleRank];				
			}
			oJSONFormTemp[rankInForm].name = labelTitleRank.toString();
			oJSONFormTemp[rankInForm].attributes = {};
			oJSONFormTemp[rankInForm].attributes.type = "radio";		
			oJSONFormTemp[rankInForm].attributes.id = "radio"+labelTitleRank+labelRank;		
			oJSONFormTemp[rankInForm].attributes.value = labelRank;
			if (labelRank == toDoFocused[0].sLabels.substr(labelTitleRank,1)) {
				oJSONFormTemp[rankInForm].checked = true;
			}
			oJSONFormTemp[rankInForm].label = oLabels.content[labelTitleRank][labelRank]; 
			oJSONFormTemp[rankInForm].labelBackgroundColor = aLabelColor[labelTitleRank][labelRank];		
			rankInForm += 1;
		}
	}
	var nextRank = rankInForm
	var dateCreation = document.getElementById(toDoFocused[0].id).dateCreation;
	var dateNow = sLocalDatetime(new Date());
	oJSONFormTemp[nextRank] = {};
	oJSONFormTemp[nextRank].name = "DateCreation";
	oJSONFormTemp[nextRank].attributes = {};
	oJSONFormTemp[nextRank].attributes.value = dateCreation;
	oJSONFormTemp[nextRank].label = "Optionnel : remodifier date de création de la note (format AAAA-MM-JJ hh:mm:ss) initialement il y a <b>"
									+ displayDatesComparison(dateCreation, dateNow, "de création", "de maintenant")+"</b>.";
	var sForm = JSON.stringify(oJSONFormTemp);
	oJSONFormTemp = [];
	superFormModale(sForm, "Etiquettes", submitToDoFull, fCheckFormToDo);
}

function fCheckFormToDo(aResponseFormArray){
	if (aResponseFormArray[0] ==="") {
		alert('La note est vide, il faut la remplir.')
		return 'content';
	}
	if (!/^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(aResponseFormArray[5])) {
		alert (aResponseFormArray[5]+' : le format de la date de création de la note est non correct, il faut AAAA-MM-JJ hh:mm:ss, et dans des valeurs possibles');
		return "content";
	} 
	else {
		return "ok";
	}
}

function submitToDoFull(ResponseForm) {
	if (ResponseForm !== "") {
		var sLabelsForm = ResponseForm[1].toString()+ResponseForm[2]+ResponseForm[3]+ResponseForm[4];
		var sDateCreation = ResponseForm[5];
		var sToDoContent = hackReplaceAll(ResponseForm[0]);
		if (toDoFocused[0].id === null ) {
			var dateCreation = sLocalDatetime(new Date());
			oJSONTemp[sLabelsForm]= [];
			oJSONTemp[sLabelsForm][0] = [];
			oJSONTemp[sLabelsForm][0][0] = sToDoContent;
			oJSONTemp[sLabelsForm][0][1] = dateCreation;
			oJSONTemp[sLabelsForm][0][2] = "";
			var sToDoAddedJSON = JSON.stringify(oJSONTemp);
			oJSONTemp[sLabelsForm]= [];
			document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
			ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic 
			+ "&toDoContent=" + encodeURIComponent(sToDoContent) 
			+ "&dateCreation=" + dateCreation 
			+ "&sLabels=" + sLabels
			+ "&sContentStart=" + encodeURIComponent(document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString)), 
			submitToDoFullFailed, addNewToDoWithLabels, sToDoAddedJSON);
		}
		else { // c'est donc un update que l'on fait
			document.getElementById("transparentLayerOnContainerOfToDo").style.display = 'block';
			ajaxCall('phpAjaxCalls_ToDo/updateToDo.php?idTopic=' + idTopic 
			+ "&toDoContent=" + encodeURIComponent(sToDoContent)
			+ "&sLabels=" + toDoFocused[0].sLabels 
			+ "&position=" + toDoFocused[0].position 
			+ "&sNewLabels=" + sLabelsForm
			+ "&dateCreation=" + sDateCreation
			+ "&sContentStart=" + encodeURIComponent(document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString)), 
			updateToDoFailed, updateToDo, sToDoContent, sLabelsForm, sDateCreation);
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

function updateToDo(errorMessageFromServer , sNewContent, sNewLabels, sDateCreation) {
	if (errorMessageFromServer==="") {
		var oDOMToDoFocused = document.getElementById(toDoFocused[0].id);
		if (toDoFocused[0].sLabels === sNewLabels) { // les sLabels ne changent pas
			oDOMToDoFocused.innerHTML = sNewContent.replace(/\n/gi, "<Br>") + '<span class="dateExpired">'+ (oDOMToDoFocused.dateExpired === undefined ? "" : oDOMToDoFocused.dateExpired) + '</div>'
			oDOMToDoFocused.content = sNewContent;
			oDOMToDoFocused.dateCreation = sDateCreation;
		}
		else { // les sLabels changent aussi
			deleteToDoFromDOM(toDoFocused[0].id);
			var aLabelsOfNewToDo = sNewLabels.split("");
			if (aLabelsChecked[0][aLabelsOfNewToDo[0]]==1 && aLabelsChecked[1][aLabelsOfNewToDo[1]]==1 && aLabelsChecked[2][aLabelsOfNewToDo[2]]==1 && aLabelsChecked[3][aLabelsOfNewToDo[3]]==1) {// afficher le nouveau toDo seulement si il a des labels d�j� demand�s � �tre affich�s
				oJSONTemp[sNewLabels]= [];
				oJSONTemp[sNewLabels][0] = [];
				oJSONTemp[sNewLabels][0][0] = sNewContent;
				oJSONTemp[sNewLabels][0][1] = sDateCreation;
				oJSONTemp[sNewLabels][0][2] = oDOMToDoFocused.dateExpired === undefined ? null : oDOMToDoFocused.dateExpired;
				var sToDoNewJSON = JSON.stringify(oJSONTemp);
				oJSONTemp[sNewLabels]= [];
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
	var sToDoContent = hackReplaceAll(document.getElementById("toDoTextarea").value);
	if (sToDoContent !=="") {
		var dateCreation = sLocalDatetime(new Date());
		oJSONTemp['0000']= [];
		oJSONTemp['0000'][0] = [];
		oJSONTemp['0000'][0][0] = sToDoContent;
		oJSONTemp['0000'][0][1] = dateCreation;
		oJSONTemp['0000'][0][2] = null;
		var sToDoAddedJSON = JSON.stringify(oJSONTemp);
		oJSONTemp['0000']= [];
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
		+ "&sContentStart=" + document.getElementById(toDoFocused[0].id).content.substr(0, lengthCheckedString), 
		+ "&accuracyPosition=" + oPosition.coords.accuracy,
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

function displayCompleteToDoList() {
	window.open('displayCompleteToDoListInNewWindow/displayCompleteToDoList.php?idTopic='+idTopic);		
	alert("Fait !\n\nLes toDos ont été exportés dans un autre onglet ou une fenêtre (cela dépend de votre navigateur).");
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
					newElement.dateCreation = droppedElement.dateCreation;
					newElement.dateExpired = droppedElement.dateExpired;
					newElement.content = droppedElement.content;
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

function selectAllToDoOrOne(){
	isUniqueLabelChecked =  isUniqueLabelChecked === true ? false : true;
}

function sLocalDatetime(date){
	return date.getFullYear()+"-"+XX(date.getMonth()+1)+"-"+XX(date.getDate())+" "+XX(date.getHours())+":"+XX(date.getMinutes())+":"+XX(date.getSeconds());	
}