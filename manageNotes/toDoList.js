var toDoFocused = null;
var IdOfFirstToDo = 1000;

document.getElementById("noScroll").addEventListener('touchmove', function(event) {
	event.preventDefault();
}, false);

addEventsDragAndDropToLastAndInvisible(document.getElementById("lastAndInvisible"));

ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic, insertToDoListBefore, 'lastAndInvisible')

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

				
function insertToDoListBefore(sToDoListJSON, idDOMBeforeToInsert) {
	var oToDoListJSONParsed = sToDoListJSON == "" ? "" : JSON.parse(sToDoListJSON); 
	// if oToDoListJSONParsed =="" afficher "pas encore de notes" : non à mettre en dehors de cette function
	var i = 0;
	for (x in oToDoListJSONParsed) {
		var sContent = oToDoListJSONParsed[x][0].replace(/&lt;br&gt;/gi, "\n");
		var oDOMToDo = document.createElement("div");
		oDOMToDo.id = 'toDo'+(i+IdOfFirstToDo);
		oDOMToDo.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			toDoFocused = e.target.id;
			displayContextMenuToDo(toDoFocused);
		}, false);
		oDOMToDo.innerHTML = sContent; 
		oDOMToDo.className = "toDo";
		oDOMToDo.draggable = "true";
		oDOMToDo.dateCreation = oToDoListJSONParsed[x][1];
		oDOMToDo.dateExpired = oToDoListJSONParsed[x][2];
		addEventsDragAndDrop(oDOMToDo);
		document.getElementById("noScroll").insertBefore(oDOMToDo , document.getElementById(idDOMBeforeToInsert));
		i ++;
	}
}				
				
// insérer un nouveau toDo avant le premier déjà affiché puis le placer dans la bdd
document.getElementById("addToDoButton").addEventListener('click', function () {
	document.getElementById('addToDoButton').style.display = 'none';
	document.getElementById('submitToDo').style.display = 'block';
	document.getElementById('addToDoFrame').style.display = 'block';
	document.getElementById("toDoTextarea").focus();
}, false);

document.getElementById("submitToDo").addEventListener('click', function () {
	submitToDo();
	}, false); 

function submitToDo(){
	var toDoContent = document.getElementById("toDoTextarea").value;
	document.getElementById('addToDoButton').style.display = 'block';
	hideFormEnterToDo();	
	IdOfFirstToDo -=1;
	ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + toDoContent, insertToDoListBefore, 'toDo' + parseInt(IdOfFirstToDo + 1));
}

function hideFormEnterToDo() {
	document.getElementById('submitToDo').style.display = 'none';
	document.getElementById("addToDoForm").reset();
	document.getElementById('addToDoFrame').style.display = 'none';
} 

function displayContextMenuToDo() {
	//document.getElementById('contextMenuToDo').style.display = 'block';
	
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
		this.parentNode.insertBefore(newElement, this);
		droppedElement.parentNode.removeChild(droppedElement);
	}, false);	
}



// effacer un toDo : par appui long ?? puis touche corbeille. ou icones dedans mais pas beaucoup  de place ???? En plus il faut du multiple !!


// archiver un toDo comme fait 