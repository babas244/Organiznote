var toDoFocused = null;
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
	hideContextMenuToDo();
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir effacer la note :\n" + document.getElementById(toDoFocused).content) == true) {
		toDoToDelete = toDoFocused;
		var sLabelsAndPositionToDoFocused = document.getElementById(toDoFocused).id.substr(4,5);
		ajaxCallNoResponse('phpAjaxCalls_ToDo/deleteToDo.php?idTopic=' + idTopic + "&sLabelsAndPositionToDo=" + sLabelsAndPositionToDoFocused, deleteToDoFromDOM, toDoToDelete);	
	}
	else {
		toDoFocused = null;
	}
}

function stateToDoDone () {
	hideContextMenuToDo();
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir archiver comme faite la note :\n" + document.getElementById(toDoFocused).content) == true) {
		ajaxCallNoResponse('phpAjaxCalls_ToDo/stateToDoDone.php?idTopic=' + idTopic + "&idInDdb=" + document.getElementById(toDoFocused).idInDdb, deleteToDoFromDOM, toDoFocused);	
	}
	else {
		toDoFocused = null;
	}
}

function editToDo() {
	var sForm = '[';
	sForm += '{"name":"content","HTMLType" : "textarea" , "attributes" : { "rows" : "5" , "cols" : "10", "value" : "' + document.getElementById(toDoFocused).content + '" }, "label" : "note"},{';
	for (var labelTitleRank = 0; labelTitleRank < oLabels.title.length; labelTitleRank ++) {
		sForm += '"name":"'+labelTitleRank+'","HTMLType":"select","attributes":{"selectedIndex":"'+document.getElementById(toDoFocused).id.substr(4+labelTitleRank,1)+'"},"options":['; 
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
	hideContextMenuToDo();
	//alert (ResponseForm);
	if (ResponseForm !== "") {
		var sLabels = ResponseForm[1].toString()+ResponseForm[2]+ResponseForm[3]+ResponseForm[4];
		if (toDoFocused === null ) {
			var dateCreation = Date.now();
			var sToDoAddedJSON = '{"'+ sLabels +'":[["'+ ResponseForm[0] +'","'+ dateCreation +'",""]]}';
			//alert (sToDoAddedJSON); 
			ajaxCallNoResponse('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + ResponseForm[0] + "&dateCreation=" + dateCreation + "&sLabels=" + sLabels, insertToDoListBefore, sToDoAddedJSON);
		}
		else { // c'est donc un update que l'on fait
			var sLabelsAndPositionToDoFocused = document.getElementById(toDoFocused).id.substr(4,5);
			//alert (sLabelsAndPositionToDoFocused);
			//alert (sLabels);
			ajaxCallNoResponse('phpAjaxCalls_ToDo/updateToDo.php?idTopic=' + idTopic + "&toDoContent=" + ResponseForm[0] + "&sLabelsAndPositionToDoFocused=" + sLabelsAndPositionToDoFocused + "&sNewLabels=" + sLabels, updateToDo, ResponseForm[0], sLabelsAndPositionToDoFocused, sLabels);
		}
	}
}

function updateToDo(sNewContent, sLabelsAndPositionToDoFocused, sNewLabels) {
	var sLabelsToDoFocused = sLabelsAndPositionToDoFocused.substr(0,4);
	//alert (sLabelsToDoFocused)
	var oDOMToDoFocused = document.getElementById('toDo'+sLabelsAndPositionToDoFocused);
	
	if (sLabelsToDoFocused === sNewLabels) { // les sLabels ne changent pas
		oDOMToDoFocused.innerHTML = sNewContent + '<span class="dateExpired">'+ (oDOMToDoFocused.dateExpired === undefined ? "" : oDOMToDoFocused.dateExpired) + '</div>'
		oDOMToDoFocused.content = sNewContent;
	}
	else { // les sLabels changent aussi
		var sToDoFocusedPosition = sLabelsAndPositionToDoFocused.substr(4,1);
		deleteToDoFromDOM(toDoFocused);
		for (var i = parseInt(sToDoFocusedPosition) + 1 ; i < aLabelNbItems[sLabelsToDoFocused] ; i++) {
			//alert ('toDo'+sLabelsToDoFocused+i)
			document.getElementById('toDo'+sLabelsToDoFocused+i).id = 'toDo'+sLabelsToDoFocused+parseInt(i-1); // on décale les id de 1
		}
		aLabelNbItems[sLabelsToDoFocused] -= 1;
		var sToDoNewJSON = '{"'+ sNewLabels +'":[["'+ sNewContent +'","'+ oDOMToDoFocused.dateCreation +'","'+ (oDOMToDoFocused.dateExpired === undefined ? "" : oDOMToDoFocused.dateExpired) +'"]]}';
		insertToDoListBefore(sToDoNewJSON, "newNote");
		var aLabelsOfNewToDo = sNewLabels.split("");
		//alert ("aLabelsOfNewToDo =" +aLabelsOfNewToDo[0] + aLabelsOfNewToDo[1] + aLabelsOfNewToDo[2]+aLabelsOfNewToDo[3])
		//alert (aLabelsOfNewToDo[0]+aLabelsOfNewToDo[1]+aLabelsOfNewToDo[2]+aLabelsOfNewToDo[3]+ " = "+aLabelsChecked[0][aLabelsOfNewToDo[0]]+aLabelsChecked[1][aLabelsOfNewToDo[1]]+aLabelsChecked[2][aLabelsOfNewToDo[2]]+aLabelsChecked[3][aLabelsOfNewToDo[3]]);
		if (aLabelsChecked[0][aLabelsOfNewToDo[0]]==0 || aLabelsChecked[1][aLabelsOfNewToDo[1]]==0 || aLabelsChecked[2][aLabelsOfNewToDo[2]]==0 || aLabelsChecked[3][aLabelsOfNewToDo[3]]==0) {// afficher le nouveau toDo seulement si il a des labels déjà demandés à être affichés
			//alert ('toDo'+sNewLabels+aLabelNbItems[sNewLabels])
			document.getElementById('toDo'+sNewLabels+parseInt((aLabelNbItems[sNewLabels])-1)).style.display = 'none';
		}
	}
}

function deleteToDoFromDOM (idDOMElementToDelete) {
	document.getElementById('noScroll').removeChild(document.getElementById(idDOMElementToDelete)); 
	// renommer les id  
	toDoFocused = null;
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
		var dateCreation = Date.now();
		var sToDoAddedJSON = '{"0000":[["'+ sToDoContent +'","'+ dateCreation +'",""]]}';
		if (aLabelNbItems["0000"] === undefined) {
			aLabelNbItems["0000"]=0;
		} 
		//aLabelNbItems["0000"] += 1;
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
	document.getElementById('greyLayerOnNoScroll').style.display = 'block';
	document.getElementById('cancelContextMenu').style.display = 'inline-block';
	document.getElementById('deleteToDo').style.display = 'inline-block';
	document.getElementById('StatedToDoDone').style.display = 'inline-block';
	document.getElementById('editToDo').style.display = 'inline-block';
	
}

function hideContextMenuToDo () {
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
		toDoFocused = e.target.id;
		displayContextMenuToDo(toDoFocused);
	}, false);
}

// effacer un toDo : par appui long ?? puis touche corbeille. ou icones dedans mais pas beaucoup  de place ???? En plus il faut du multiple !!


// archiver un toDo comme fait 