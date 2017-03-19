var toDoFocused = null;
var IdOfFirstToDo = 1000;
var IdOfFirstToDoInitial = IdOfFirstToDo;

addEventsDragAndDropToLastAndInvisible(document.getElementById("lastAndInvisible"));

ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic + "&labelTitleRank=1&labelRank=1", insertToDoListBefore, 'lastAndInvisible')

ajaxCall('phpAjaxCalls_ToDo/retrieveLabels.php?idTopic=' + idTopic, displayLabelsCheckboxes); 

document.getElementById("addToDoButton").addEventListener('click', initializeFormToDo, false);
document.getElementById("cancelAddToDo").addEventListener('click', hideFormEnterToDo, false);
document.getElementById("resetAddToDoForm").addEventListener('click', resetFormToDo, false);
document.getElementById("deleteToDo").addEventListener('click', deleteToDo, false);
document.getElementById("StatedToDoDone").addEventListener('click', stateToDoDone, false);
document.getElementById("cancelContextMenu").addEventListener('click', hideContextMenuToDo, false);

document.getElementById("noScroll").addEventListener('touchmove', function(event) {
	event.preventDefault();
}, false);

document.getElementById("addToDoForm").addEventListener('submit', function(e) {
	e.preventDefault();
}, false);

function ajaxCall(sPathPhp, fCallBack, parameter1) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', sPathPhp);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallBack(xhr.responseText =="" ? undefined : xhr.responseText, parameter1);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) {
				alert('Une erreur est survenue !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function ajaxCallNoResponse(sPathPhp, fCallBack, parameter1, parameter2) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', sPathPhp);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallBack(parameter1, parameter2);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) {
				alert('Une erreur est survenue !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function displayLabelsCheckboxes(sLabelsJSON) {
	var oLabels = JSON.parse(sLabelsJSON);
	var rankOfTitleLabel = 1;
	var rankOfLabel;
	for (titleLabel in oLabels) {
		for (var rankOfLabel=1 ; rankOfLabel < oLabels[titleLabel].length + 1 ; rankOfLabel++) {
			var oDOMLabelCheckbox = document.createElement("input");
			oDOMLabelCheckbox.type = "checkbox";
			oDOMLabelCheckbox.id = "checkboxLabel"+rankOfTitleLabel+"a"+rankOfLabel;
			oDOMLabelCheckbox.rankOfTitleLabel = rankOfTitleLabel;
			oDOMLabelCheckbox.rankOfLabel = rankOfLabel;
			oDOMLabelCheckbox.addEventListener('input', function (e){
				displayToDoList(e.target.rankOfTitleLabel, e.target.rankOfLabel, e.target.checked);
			}, false);
			document.getElementById("containerOfToDo").appendChild(oDOMLabelCheckbox);
			var oDOMDivLabel = document.createElement("span");
			oDOMDivLabel.innerHTML = oLabels[titleLabel][rankOfLabel-1];
			document.getElementById("containerOfToDo").appendChild(oDOMDivLabel);				
		}	
		oDOMElementBr = document.createElement("Br");
		document.getElementById("containerOfToDo").appendChild(oDOMElementBr);

		rankOfTitleLabel +=1;
	}
}
			
function displayToDoList (rankOfTitleLabel, rankOfLabel, isChecked) {
	var aDOMHasClassOfToDo = document.querySelectorAll('div[class="toDo'+rankOfTitleLabel+'a'+rankOfLabel+'"]');
	var numberOfToDo = aDOMHasClassOfToDo.length;
	if (isChecked) {
		// tester d'abord s'il y a déjà un toDo de cette class déjà instancié. vaudrait-il mieux avoir une variable globale qui dit si déjà chargé ou pas ? 
		if (numberOfToDo === 0) {
			ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic, insertToDoListBefore, 'lastAndInvisible')		
		}
		else {
			for (var i = 0; i < numberOfToDo ; i++) {
				aDOMHasClassOfToDo[i].style.display = 'block';
			}
		}
	}
	else {
		for (var j = 0; j < numberOfToDo ; j++) {
			aDOMHasClassOfToDo[i].style.display = 'none';
		}
	}
}
			
function insertToDoListBefore(sToDoListJSON, idDOMBeforeToInsert) {
	var oToDoListJSONParsed = sToDoListJSON == "" ? "" : JSON.parse(sToDoListJSON); 
	// if oToDoListJSONParsed =="" afficher "pas encore de notes" : non à mettre en dehors de cette function
	var i = 0;
	for (x in oToDoListJSONParsed) {
		var sContent = oToDoListJSONParsed[x][0].replace(/&lt;br&gt;/gi, "\n");
		var oDOMToDo = document.createElement("div");
		oDOMToDo.id = 'toDo'+(i+IdOfFirstToDo);
		addContextMenu(oDOMToDo);
		oDOMToDo.innerHTML = sContent; 
		oDOMToDo.className = "toDo";
		oDOMToDo.draggable = "true";
		oDOMToDo.idInDdb = x;
		oDOMToDo.dateCreation = oToDoListJSONParsed[x][1];
		oDOMToDo.dateExpired = oToDoListJSONParsed[x][2];
		addEventsDragAndDrop(oDOMToDo);
		document.getElementById("noScroll").insertBefore(oDOMToDo , document.getElementById(idDOMBeforeToInsert));
		i ++;
	}
}				
				
function deleteToDo () {
	hideContextMenuToDo();
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir effacer la note :\n" + document.getElementById(toDoFocused).innerHTML) == true) {
		ajaxCallNoResponse('phpAjaxCalls_ToDo/deleteToDo.php?idTopic=' + idTopic + "&idInDdb=" + document.getElementById(toDoFocused).idInDdb, deleteToDoFromDOM, toDoFocused);	
	}
	else {
		toDoFocused = null;
	}
}

function stateToDoDone () {
	hideContextMenuToDo();
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir archiver comme faite la note :\n" + document.getElementById(toDoFocused).innerHTML) == true) {
		ajaxCallNoResponse('phpAjaxCalls_ToDo/stateToDoDone.php?idTopic=' + idTopic + "&idInDdb=" + document.getElementById(toDoFocused).idInDdb, deleteToDoFromDOM, toDoFocused);	
	}
	else {
		toDoFocused = null;
	}
}



function deleteToDoFromDOM (idDOMElementToDelete)  {
	document.getElementById('noScroll').removeChild(document.getElementById(idDOMElementToDelete)); 
}				

function initializeFormToDo() {
	document.getElementById('addToDoButton').style.display = 'none';
	document.getElementById('addToDoFrame').style.display = 'block';
	document.getElementById("toDoTextarea").focus();
}


function submitToDo(){
	var toDoContent = document.getElementById("toDoTextarea").value;
	hideFormEnterToDo();
	if (toDoContent !=="") {
		IdOfFirstToDo -=1;
		var oDOMToInsertBefore = document.getElementById('toDo'+ IdOfFirstToDoInitial) === null ? 'lastAndInvisible' : 'toDo' + parseInt(IdOfFirstToDo + 1); 
		ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + toDoContent + "&labels=11", insertToDoListBefore, oDOMToInsertBefore); // oDOMToInsertBefore est une string ici...
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