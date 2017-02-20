var toDoFocused = null;

document.getElementById("noScroll").addEventListener('touchmove', function(event) {
	event.preventDefault();
}, false);


ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic, displayToDoList)

function ajaxCall(sPathPhp, fCallBack) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', sPathPhp);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallBack(xhr.responseText =="" ? undefined : xhr.responseText);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) {
				alert('Une erreur est survenue !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}
				
function displayToDoList(sToDoListRetrieved) {
	var aToDoListJSONParsed = sToDoListRetrieved == "" ? "" : JSON.parse(sToDoListRetrieved); 
	// if aToDoListJSONParsed =="" afficher "pas encore de notes"
	var nbOfItemsOfToDoListJSONParsed = aToDoListJSONParsed.length; 
	for (i = 0 ; i < nbOfItemsOfToDoListJSONParsed; i ++) {
		var sContent = aToDoListJSONParsed[i].replace(/&lt;br&gt;/gi, "\n");
		var oDOMToDo = document.createElement("div");
		oDOMToDo.id = 'toDo'+(i+1);
		oDOMToDo.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			toDoFocused = e.target.id;
			displayContextMenuToDo(toDoFocused);
		}, false);
		oDOMToDo.innerHTML = sContent; 
		oDOMToDo.className = "toDo";
		oDOMToDo.draggable = "true";
		addEventsDragAndDrop(oDOMToDo);
		document.getElementById("noScroll").appendChild(oDOMToDo);
	}
}
				

// insérer un nouveau toDo avant le premier déjà affiché puis le placer dans la bdd
document.getElementById("addToDoButton").addEventListener('click', function () {
	document.getElementById('addToDoButton').style.display = 'none';
	document.getElementById('submitToDo').style.display = 'block';
	document.getElementById('addToDoFrame').style.display = 'block';
}, false);

document.getElementById("submitToDo").addEventListener('click', function () {
	submitToDo();
	}, false); 

function submitToDo(){
	document.getElementById('addToDoButton').style.display = 'block';
	var toDoContent = document.getElementById("toDoTextarea").value;
	document.getElementById('submitToDo').style.display = 'none';
	//alert (toDoContent);
	ajaxCall('phpAjaxCalls_ToDo/addToDo.php?idTopic=' + idTopic + "&toDoContent=" + toDoContent, addToDoToDOM);
}

function addToDoToDOM(){
	//document.getElementById("frameOfToDo").insertBefore(oCategorieAffichageDOM , noteAlreadyLoadedInDOM );				
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

function addEventsDragAndDropToLastAndInvisible(DOMElement) { // nécessaire ?
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