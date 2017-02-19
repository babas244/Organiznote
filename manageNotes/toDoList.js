var toDoFocused = null;

document.getElementById("noscroll").addEventListener('touchmove', function(event) {
	event.preventDefault();
}, false);


ajaxCall('phpAjaxCalls_ToDo/retrieveToDoList.php?idTopic=' + idTopic, displayToDoList)

function ajaxCall(sPathPhp, fCallBack) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', sPathPhp);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallBack(xhr.responseText);
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
			displayContextMenu(toDoFocused);
		}, false);
		oDOMToDo.innerHTML = sContent; 
		oDOMToDo.className = "toDo";
		document.getElementById("frameOfToDo").appendChild(oDOMToDo);
	}
}
				

// insérer un nouveau toDo avant le premier déjà affiché puis le placer dans la bdd
document.getElementById("addToDo").addEventListener('click', function () {
	
}, false);


// effacer un toDo : par appui long ?? puis touche corbeille. ou icones dedans mais pas beaucoup  de place ???? En plus il faut du multiple !!


// archiver un toDo comme fait 