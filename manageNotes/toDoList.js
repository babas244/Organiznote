var toDoFocused = [{id:null},{sLabels:null},{position:null}];
var aNbOfLabels = [5,3,3,3]; // à charger depuis la bdd
var isDisplayDateExpired = false;
var aLabelsChecked =[[1,0,0,0,0],[1,1,1],[1,1,1],[1,1,1]]; // à fabriquer par une boucle après chargement de aNbOfLabels
var aLabelNbItems = {}; 

addEventsDragAndDropToLastAndInvisible(document.getElementById("lastAndInvisible"));

counterInsertDivSeparatorLabels();

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

ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + "&label0=0&label1=012&label2=012&label3=012", insertToDoListBefore);

ajaxCall('phpAjaxCalls_ToDo/retrieveLabels.php?idTopic=' + idTopic, displayLabelsCheckboxes); 

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

function ajaxCallNoResponse(sPathPhp, fCallBack, parameter1, parameter2, parameter3) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', sPathPhp);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallBack(parameter1, parameter2, parameter3);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) {
				alert('Une erreur est survenue !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
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
			document.getElementById("containerOfToDo").appendChild(oDOMLabelCheckbox);
			var oDOMDivLabel = document.createElement("span");
			oDOMDivLabel.innerHTML = oLabels.content[labelTitleRank][labelRank];
			document.getElementById("containerOfToDo").appendChild(oDOMDivLabel);				
		}	
		oDOMElementBr = document.createElement("Br");
		document.getElementById("containerOfToDo").appendChild(oDOMElementBr);
	}
	updateCheckboxes();
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
			ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + addressPhpLabels, insertToDoListBefore)		
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
			
function insertToDoListBefore(sToDoListJSON, sIsNew) {
	//alert (sToDoListJSON);
	var oToDoListJSONParsed = sToDoListJSON == "" ? "" : JSON.parse(sToDoListJSON);
	// if oToDoListJSONParsed =="" afficher "pas encore de notes" : non à mettre en dehors de cette function
	var sContent;
	var nNbOfToDoInLabels;
	for (sLabels in oToDoListJSONParsed) {
		//alert (sLabels);
		//alert (aLabelNbItems[sLabels]);
		if (aLabelNbItems[sLabels] === undefined || sIsNew === "newNote") { // il faut en fait deux fCallback différentes ici
			aLabels = sLabels.split("");
			nNbOfToDoInLabels = oToDoListJSONParsed[sLabels].length;
			aLabelNbItems[sLabels] = aLabelNbItems[sLabels]=== undefined ? 0 : aLabelNbItems[sLabels];
			//alert (nNbOfToDoInLabels+"     "+aLabelNbItems[sLabels])
			for (var i = 0 ; i < nNbOfToDoInLabels; i++ ) {
				//alert (i)
				sContent = oToDoListJSONParsed[sLabels][i][0].replace(/&lt;br&gt;/gi, "\n");
				var oDOMToDo = document.createElement("div");
				oDOMToDo.id = 'toDo'+sLabels+(parseInt(i)+parseInt(aLabelNbItems[sLabels]));
				addContextMenu(oDOMToDo);
				oDOMToDo.className = 'toDo toDo0a'+aLabels[0]+' toDo1a'+aLabels[1]+' toDo2a'+aLabels[2]+' toDo3a'+aLabels[3];
				oDOMToDo.draggable = "true";
				oDOMToDo.dateCreation = oToDoListJSONParsed[sLabels][i][1];
				oDOMToDo.dateExpired = oToDoListJSONParsed[sLabels][i][2];
				oDOMToDo.content = sContent;
				oDOMToDo.innerHTML = sContent + " :"+sLabels+(parseInt(i)+parseInt(aLabelNbItems[sLabels]))+'<span class="dateExpired">'+ (oDOMToDo.dateExpired === undefined ? "" : oDOMToDo.dateExpired) + '</div>'; 
				addEventsDragAndDrop(oDOMToDo);
				document.getElementById("noScroll").insertBefore(oDOMToDo , document.getElementById("separatorLabels"+sLabels).nextSibling);
			}
		aLabelNbItems[sLabels] += nNbOfToDoInLabels;	
		//alert ("sLabels "+ sLabels+"a items = "+ aLabelNbItems[sLabels])
		}
		else {
			var aDOMToDoToDisplay = document.querySelectorAll('div[id^="toDo' + sLabels + '"]');
			for (var j = 0 ; j < aDOMToDoToDisplay.length ; j++) {
				aDOMToDoToDisplay[j].style.display = 'block';
			}
		}
	}
}				
				
function deleteToDo () {
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir effacer la note :\n" + document.getElementById(toDoFocused[0].id).content) == true) {
		ajaxCallNoResponse('phpAjaxCalls_ToDo/deleteToDo.php?idTopic=' + idTopic + "&sLabels=" + toDoFocused[0].sLabels + "&position=" + toDoFocused[0].position, deleteToDoAndHideContextMenu, toDoFocused[0].id);	
	}
	else { 
		hideContextMenuToDo();
	}
}

function stateToDoDone () {
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir archiver comme faite la note :\n" + document.getElementById(toDoFocused[0].id).content) == true) {
		var dateArchive = new Date().toISOString().slice(0,-8);
		var sForm = '[{"name":"DateArchive", "attributes" : {"value" : "' + dateArchive + '" }, "label" : "Date d\'archivage (format AAAA-MM-JJThh:mm)"}]';
		//alert (sForm);
		superFormModale(sForm, "Confirmation de la date d'archivage", setToDoDoneAjax, "array", fCheckFormDateArchive);
	} 
	else {
		hideContextMenuToDo();
	}
}

function setToDoDoneAjax(aDateArchive) {
	ajaxCallNoResponse('phpAjaxCalls_ToDo/stateToDoDone.php?idTopic=' + idTopic + '&dateArchive=' + aDateArchive[0].replace("T"," ")+":00" + "&sLabels=" + toDoFocused[0].sLabels + "&position=" + toDoFocused[0].position, deleteToDoAndHideContextMenu, toDoFocused[0].id);		
}

function deleteToDoAndHideContextMenu(idDOMToDelete) {
	deleteToDoFromDOM(idDOMToDelete);
	hideContextMenuToDo();
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
	sForm += '{"name":"content","HTMLType" : "textarea" , "attributes" : { "rows" : "5" , "cols" : "10", "value" : "' + document.getElementById(toDoFocused[0].id).content + '" }, "label" : "note"},{';
	for (var labelTitleRank = 0; labelTitleRank < oLabels.title.length; labelTitleRank ++) {
		sForm += '"name":"'+labelTitleRank+'","HTMLType":"select","attributes":{"selectedIndex":"'+document.getElementById(toDoFocused[0].id).id.substr(4+labelTitleRank,1)+'"},"options":['; 
		for (var labelRank = 0 ; labelRank < oLabels.content[labelTitleRank].length; labelRank++) {
			sForm += '"'+oLabels.content[labelTitleRank][labelRank]+'",';
		}
	sForm = sForm.slice(0,-1)+ '], "label" : "'+oLabels.title[labelTitleRank]+'"},{';
	}
	sForm = sForm.slice(0,-2)+']';
	//alert (sForm);
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
			var dateCreation = new Date().toISOString().slice(0,-8).replace("T"," ")+":00";
			var sToDoAddedJSON = '{"'+ sLabelsForm +'":[["'+ ResponseForm[0] +'","'+ dateCreation +'",""]]}';
			//alert (sToDoAddedJSON); 
			ajaxCallNoResponse('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + ResponseForm[0] + "&dateCreation=" + dateCreation + "&sLabels=" + sLabels, addNewToDoWithLabels, sToDoAddedJSON);
		}
		else { // c'est donc un update que l'on fait
			ajaxCallNoResponse('phpAjaxCalls_ToDo/updateToDo.php?idTopic=' + idTopic + "&toDoContent=" + ResponseForm[0] + "&sLabels=" + toDoFocused[0].sLabels + "&position=" + toDoFocused[0].position + "&sNewLabels=" + sLabelsForm, updateToDo, ResponseForm[0], sLabelsForm);
		}
	}
}

function addNewToDoWithLabels(sToDoAddedJSON) {
	insertToDoListBefore(sToDoAddedJSON);
	hideContextMenuToDo();
}

function updateToDo(sNewContent, sNewLabels) {
	var oDOMToDoFocused = document.getElementById(toDoFocused[0].id);
	if (toDoFocused[0].sLabels === sNewLabels) { // les sLabels ne changent pas
		oDOMToDoFocused.innerHTML = sNewContent + '<span class="dateExpired">'+ (oDOMToDoFocused.dateExpired === undefined ? "" : oDOMToDoFocused.dateExpired) + '</div>'
		oDOMToDoFocused.content = sNewContent;
	}
	else { // les sLabels changent aussi
		deleteToDoFromDOM(toDoFocused[0].id);
		var aLabelsOfNewToDo = sNewLabels.split("");
		if (aLabelsChecked[0][aLabelsOfNewToDo[0]]==1 && aLabelsChecked[1][aLabelsOfNewToDo[1]]==1 && aLabelsChecked[2][aLabelsOfNewToDo[2]]==1 && aLabelsChecked[3][aLabelsOfNewToDo[3]]==1) {// afficher le nouveau toDo seulement si il a des labels déjà demandés à être affichés
			var sToDoNewJSON = '{"'+ sNewLabels +'":[["'+ sNewContent +'","'+ oDOMToDoFocused.dateCreation +'","'+ (oDOMToDoFocused.dateExpired === undefined ? "" : oDOMToDoFocused.dateExpired) +'"]]}';
			insertToDoListBefore(sToDoNewJSON, "newNote");
		}
	}
	hideContextMenuToDo();
}

function deleteToDoFromDOM (idDOMToDoFocused) {
	document.getElementById('noScroll').removeChild(document.getElementById(idDOMToDoFocused)); 
	for (var i = parseInt(toDoFocused[0].position) + 1 ; i < aLabelNbItems[toDoFocused[0].sLabels] ; i++) {
		alert (i);
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
		var dateCreation = new Date().toISOString().slice(0,-5).replace("T"," ");
		alert (dateCreation)
		var sToDoAddedJSON = '{"0000":[["'+ sToDoContent +'","'+ dateCreation +'",""]]}';
		if (aLabelNbItems["0000"] === undefined) {
			aLabelNbItems["0000"]=0;
		}
		ajaxCallNoResponse('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + sToDoContent + "&dateCreation=" + dateCreation + "&sLabels=0000", insertToDoListBefore, sToDoAddedJSON, "newNote");
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

function displayContextMenuToDo() {
	document.getElementById(toDoFocused[0].id).style.backgroundColor = '#777777';
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

// effacer un toDo : par appui long ?? puis touche corbeille. ou icones dedans mais pas beaucoup  de place ???? En plus il faut du multiple !!


// archiver un toDo comme fait 