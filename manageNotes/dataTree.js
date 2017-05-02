var iRetraitAffichagedUneCategorie= 10;
var pathFocused = null;
var ongoingAction = null;
var pathToPaste = null;
var TreezIndex = -1;
var emailAddressSiteAdmin = "postmaster@";
var pathSendGeolocation;

document.getElementById("displayAndHideTree").addEventListener('click', function () {
	TreezIndex = TreezIndex === -1 ? 1 : -1; 
	document.getElementById("containerOfTree").style.zIndex = TreezIndex;
}, false);


ajaxCall('ajax/InstantiateRoot.php?idTopic=' + idTopic, instantiateRootFailed, instantiateRoot)

function instantiateRoot(topic) {
	//checkResponseAjax(topic,"instantiateRoot");
	document.getElementById("greyLayerOnFrameOfTree").style.display = "block";
	oDOMRoot = document.getElementById("01")
	oDOMRoot.innerHTML = topic;   //textContent? 
	oDOMRoot.style.border = '2px black solid'  // className is Root ?
	oTreeNotes = new SimpleTree("01");					
	oDOMRoot.addEventListener('click', function(e) {
		oTreeNotes.moveInSimpleTree(e.target.id);
	}, false);					
	addContextMenuDataTree(oDOMRoot);
	pathFocused = "01";
	oDOMFocused = document.getElementById("01");
	ajaxCall('ajax/getCategoryChild.php?idTopic=' + idTopic + '&sPathParent=01' , instantiateRootFailed, prepareInstantiateFolder, "01", displayRoot);
}

function instantiateRootFailed(errorMessage) {
	alert ("Le chargement de l'aborescence n'a pas fonctionné. Veuillez recharger la page (touche F5)." + errorMessage);
}

function prepareInstantiateFolderFailed(errorMessage) {
	alert("La catégorie ne peut pas être chargée depuis le serveur, vérifiez votre connexion Internet et recommencez." + errorMessage);
	resetDataTreeReadyForEvent();
}

function moveInTree(requestedFolder) {
	oTreeNotes.moveInSimpleTree(requestedFolder);
}

function prepareInstantiateFolder(sTreeItemsWithoutPathParent, pathParent, fCallback, path) {
	//console.log("....In prepareInstantiateFolder, pathParent = "+pathParent);
	if (sTreeItemsWithoutPathParent ==="") {
		oDOMParent = document.getElementById(pathParent);
		oDOMParent.nbOfFolders = 0;
		oDOMParent.nbOfNotes = 0;
		fCallback(path);
	}
	else if (checkResponseAjaxIsJSON(sTreeItemsWithoutPathParent,"prepareInstantiateFolder")) {	
		instantiateRetrievedTree('[{"' + pathParent + '":' + sTreeItemsWithoutPathParent + '}]', fCallback, path);
	} 
	else {
		pathFocused = null;
		document.getElementById("greyLayerOnFrameOfTree").style.display = "none";	
	}
}

function displayRoot() {
	oTreeNotes.displaySimpleTree("01");
	document.getElementById("greyLayerOnFrameOfTree").style.display = "none";	
}

function displayContextMenuDataTree(path) {
	//alert (typeof(path));
/* 	var sColorOfDivTreeItemFocused;
	if (pathFocused === "01" || pathFocused.substr(-3,1)==="a") {
		sColorOfDivTreeItemFocused = '#bbbbbb';
	}
	else {
		sColorOfDivTreeItemFocused = '#eeeeee';		
	}
	document.getElementById(pathFocused).style.backgroundColor = sColorOfDivTreeItemFocused;
 */
	document.getElementById(pathFocused).style.backgroundColor = '#cccccc';

	openContextMenu = document.getElementById("fondMenuCategorie");
	openContextMenu.style.display = 'block';
	document.getElementById("frameContextMenuTree").style.display = 'block';
	var aElementsToDisplay;
	
	if (path === "01") {
		if (ongoingAction === 'moveTreeItem') {
			aElementsToDisplay = openContextMenu.getElementsByClassName("isPastingHere");
		}
		else {
			aElementsToDisplay = openContextMenu.getElementsByClassName("isRoot");
		}
	}
	else if (path.substr(-3,1)==="a") {
		if (ongoingAction === 'moveTreeItem') {
			aElementsToDisplay = openContextMenu.getElementsByClassName("isPastingHere");
		}
		else {
			aElementsToDisplay = openContextMenu.getElementsByClassName("isFolder");					
		}	
	}	
	else {
		if (ongoingAction === 'moveTreeItem') {
			aElementsToDisplay = openContextMenu.getElementsByClassName("isCancel");
		}	
		else {
			aElementsToDisplay = openContextMenu.getElementsByClassName("isNote");			
		}
	}	
	for (var i = 0 ; i < aElementsToDisplay.length ; i++ ) { // plutot queryselectorall si plusieurs classes ?
		aElementsToDisplay[i].style.display = 'block';
	}		
}

function hideContextMenu() {
	openContextMenu = document.getElementById("fondMenuCategorie");
	openContextMenu.style.display = 'none';
	aElementsToHide = document.getElementById("frameContextMenuTree").children;
	for (var i = 0 ; i < aElementsToHide.length ; i++ ) { // plutot mettre chaque groupes d'item d'un menu selon sa classe cmme enfants dans une div?
		//alert (aElementsToHide[i]);
		aElementsToHide[i].style.display = 'none';
	}
}
	
function SimpleTree(openedFolder) {
	this.openedFolder = openedFolder;

	this.displaySimpleTree = function (requestedFolder) { // déplié depuis Root seule affichée

		var intermediatePathToDisplay = "";
		var i = 0;
		
		if (requestedFolder !=="01") {
			do { // afficher les intermédaires
				intermediatePathToDisplay = requestedFolder.substr(0,6 + 3*i);
				//alert (intermediatePathToDisplay);
				document.getElementById(intermediatePathToDisplay).style.display = 'block';
				i+= 1;
			} while (intermediatePathToDisplay !== requestedFolder);
		}
		
		for (var j = 0 ; j < document.getElementById(requestedFolder).nbOfFolders; j++) { // afficher les folders dans requestedFolder
			document.getElementById(requestedFolder+'a'+XX(j+1)).style.display = 'block';
		}
	
		for (var m = 0 ; m < document.getElementById(requestedFolder).nbOfNotes; m++) { // afficher les notes dans requestedFolder
			document.getElementById(requestedFolder+'b'+XX(m+1)).style.display = 'block';
		}
	}
		
	this.moveInSimpleTree = function (requestedFolder) {
		if (requestedFolder !== this.openedFolder) { // on enlève le cas ou rien de nouveau n'est demandé

			document.getElementById(this.openedFolder).style.border = '1px black solid';

			for (var i = 0 ; i < document.getElementById(this.openedFolder).nbOfNotes; i++) { // d'abord replier les Notes filles de openedFolder
				//alert (this.openedFolder+'b'+XX(i+1));
				document.getElementById(this.openedFolder+'b'+XX(i+1)).style.display = 'none';					
			}
			

			if (requestedFolder.length < this.openedFolder.length) { // si requestedFolder est une categorie ancetre de openedFolder
					
				for (var k = 0 ; k < document.getElementById(this.openedFolder).nbOfFolders; k++) { // Replier tous les folders enfants de openedFolder
					//console.log(this.openedFolder+'a'+XX(k+1));
					document.getElementById(this.openedFolder+'a'+XX(k+1)).style.display = 'none';
				}
				var intermediatePathToDisplay = this.openedFolder;
					
				while (intermediatePathToDisplay !== requestedFolder) { // effacer les intermédaires
					document.getElementById(intermediatePathToDisplay).style.display = 'none';
						intermediatePathToDisplay = intermediatePathToDisplay.slice(0,-3);
				}
				
						
			}						
			else { // on vient donc de cliquer sur un des folders de openedFolder	
				for (var i = 0 ; i < document.getElementById(this.openedFolder).nbOfFolders; i++) { // Replier les folders enfants de openedFolder, sauf requestedFolder
					if (this.openedFolder+'a'+XX(i+1) !== requestedFolder) {
						//alert (this.openedFolder+'a'+XX(i+1))
						document.getElementById(this.openedFolder+'a'+XX(i+1)).style.display = 'none';
					}				  
				}
			}
			
			document.getElementById(requestedFolder).style.border = '2px black solid';
			
			for (var j = 0 ; j < document.getElementById(requestedFolder).nbOfFolders; j++) { // afficher les folders dans requestedFolder
				document.getElementById(requestedFolder+'a'+XX(j+1)).style.display = 'block';
			}
		
			for (var m = 0 ; m < document.getElementById(requestedFolder).nbOfNotes; m++) { // afficher les notes dans requestedFolder
				document.getElementById(requestedFolder+'b'+XX(m+1)).style.display = 'block';
			}
		this.openedFolder = requestedFolder;  
		//alert("en fin de function, this.openedFolder = " + this.openedFolder);
		}	
	document.getElementById("greyLayerOnFrameOfTree").style.display = "none";
	}		
}

function instantiateRetrievedTree ( sTreeItems , fCallback, path ) { // path = paramater1OfCallback ?
	console.log ("In instantiateRetrievedTree with fCallback = " + (fCallback !== undefined ? fCallback.name : "-") + ", and sTreeItems =" + sTreeItems);
	var aTreeItems = sTreeItems == "" ? "" : JSON.parse(sTreeItems);
	var i,j,k;
	var nbOfFoldersAddedInPathParent;
	var nbOfNotesAddedInPathParent;
	
	for (var i = 0 ; i < aTreeItems.length; i++) {
	
		for (pathParent in aTreeItems[i]) { // il n'y a qu'1 seul pathParent, mais on ne connait pas sa valeur
			
			oDOMParent = document.getElementById(pathParent);
			oDOMParent.nbOfFolders = oDOMParent.nbOfFolders===undefined ? 0 : oDOMParent.nbOfFolders;
			oDOMParent.nbOfNotes = oDOMParent.nbOfNotes===undefined ? 0 : oDOMParent.nbOfNotes;
			nbOfFoldersAddedToParent = aTreeItems[i][pathParent].a == undefined ? 0 : aTreeItems[i][pathParent].a.length;
			nbOfNotesAddedToParent = aTreeItems[i][pathParent].b == undefined ? 0 : aTreeItems[i][pathParent].b.length;
			
			for (j = 0 ; j < nbOfFoldersAddedToParent ; j++) {
				var oDOMFolder = document.createElement("div");
				oDOMFolder.id  = pathParent + "a" + XX(oDOMParent.nbOfFolders+j+1);
				//alert ("i = " + i + "pathParent =" +pathParent +  "aTreeItems[i][pathParent].a[j][0] =" + aTreeItems[i][pathParent].a[j][0])
				oDOMFolder.content = aTreeItems[i][pathParent].a[j][0].replace(/&lt;br&gt;/gi, "\n");
				oDOMFolder.innerHTML = oDOMFolder.content;
				oDOMFolder.style.display = 'none';
				oDOMFolder.className = "folder";
				addContextMenuDataTree(oDOMFolder);
				oDOMFolder.addEventListener('click', function(e) {
					moveInSimpleTreeLaunch(e.target.id);
				}, false);				
				var iLevelinTree = ((pathParent.length+4)/3)-1;
				oDOMFolder.style.marginLeft = iRetraitAffichagedUneCategorie*(iLevelinTree) + 'px'; // mettre la marge en fonction du niveau de la cat�gorie
				if (oDOMParent.nbOfNotes === 0) {// si il n'y pas une seule note
					document.getElementById("frameOfTree").appendChild(oDOMFolder);
				}
				else { // si il y a au déjà au moins une note
					document.getElementById("frameOfTree").insertBefore(oDOMFolder , document.getElementById(pathParent+"b01")); // +"b00"		
				}
			}
			oDOMParent.nbOfFolders += nbOfFoldersAddedToParent;
			
			for (k = 0 ; k < nbOfNotesAddedToParent ; k++) {
				var oDOMNote = document.createElement("div");
				oDOMNote.id  = pathParent + "b" + XX(oDOMParent.nbOfNotes+k+1);
				oDOMNote.content = aTreeItems[i][pathParent].b[k][0].replace(/&lt;br&gt;/gi, "\n");
				oDOMNote.innerHTML = oDOMNote.content;
				oDOMNote.style.display = 'none';
				oDOMNote.className = "note";
				addContextMenuDataTree(oDOMNote);		
				var iLevelinTree = ((pathParent.length+4)/3)-1;
				oDOMNote.style.marginLeft = iRetraitAffichagedUneCategorie*(iLevelinTree) + 'px'; // mettre la marge en fonction du niveau de la catꨯrie
				document.getElementById("frameOfTree").appendChild(oDOMNote);
			}
			oDOMParent.nbOfNotes += nbOfNotesAddedToParent;
		}	
	if (fCallback !==undefined) {fCallback(path);}
	}
}

function moveInSimpleTreeLaunch(pathRequested) {
	oDOMRequested = document.getElementById(pathRequested);
	if (oDOMRequested.nbOfFolders===undefined) {
		document.getElementById("greyLayerOnFrameOfTree").style.display = "block"; 
		ajaxCall('ajax/getCategoryChild.php?idTopic=' + idTopic + '&sPathParent=' + pathRequested, prepareInstantiateFolderFailed, prepareInstantiateFolder, pathRequested, moveInTree, pathRequested);			
	}
	else {
		oTreeNotes.moveInSimpleTree(pathRequested);
	}	
}

function addContextMenuDataTree(oDOMTreeItem) {
	oDOMTreeItem.addEventListener('dblclick', function(e) {
		e.preventDefault();
		oDOMFocused = e.target;
		pathFocused = e.target.id;
		displayContextMenuDataTree(pathFocused);
	}, false);
}

document.getElementById("insertNewNote").addEventListener('click', insertNewNoteLaunch, false);
document.getElementById("insertNewFolder").addEventListener('click', insertNewFolderLaunch, false);
document.getElementById("editTreeItem").addEventListener('click', editTreeItemLaunch, false);
document.getElementById("deleteFolder").addEventListener('click', deleteFolderLaunch, false);
document.getElementById("deleteNote").addEventListener('click', deleteNoteLaunch, false);

function insertNewNoteLaunch() {
	hideContextMenu();
	if (oDOMFocused.nbOfFolders !== undefined) {
		if (oDOMFocused.nbOfNotes <= 98) {
			var sForm = '[{"name":"content","HTMLType" : "textarea" , "attributes" : { "rows" : "5" , "cols" : "30", "maxLength" : "1700"}, "label" : "Entrez le nom de la nouvelle note :"}]';
			superFormModale(sForm, "Nouvelle catégorie", insertNewNoteInDbb, "array", fCheckFormInsertOnlyTextarea);	
		}
		else {
			alert("Pas possible d'insérer une nouvelle note dans cette catégorie.\n\nVous avez atteint la limite prévue des 99 notes !\n\nIl serait utile de mieux réorganiser les catégories.")
			resetColorTreeItem();
			pathFocused = null;
		}	
	}
	else {
		alert("Pour insérer votre nouvelle note, cliquer d'abord sur cette catégorie (celle dans laquelle vous voulez insérer) pour l'ouvrir car elle n'est pas encore chargée depuis le serveur. Puis insérez.");
		resetColorTreeItem();
		pathFocused = null;
	}
}

function insertNewFolderLaunch() {
	hideContextMenu();
	if (oDOMFocused.nbOfFolders !== undefined) {
		if (oDOMFocused.nbOfFolders <= 98) {
			var sForm = '[{"name":"content","HTMLType" : "textarea" , "attributes" : { "rows" : "5" , "cols" : "30", "maxLength" : "1700"}, "label" : "Entrez le nom de la nouvelle catégorie :"}]';
			superFormModale(sForm, "Nouvelle catégorie", insertNewFolderInDbb, "array", fCheckFormInsertOnlyTextarea);	
		}
		else {
			alert("Pas possible d'insérer une nouvelle catégorie.\n\nVous avez atteint la limite prévue des 99 sous-catégories !\n\nIl serait utile de mieux réorganiser les catégories.")
			resetColorTreeItem();
			pathFocused = null;
		}
	}
	else {
		alert("Pour insérer votre nouvelle catégorie, cliquer d'abord sur cette catégorie (celle dans laquelle vous voulez insérer) pour l'ouvrir car elle n'est pas encore chargée depuis le serveur. Puis insérez.");
		resetColorTreeItem();
		pathFocused = null;
	}
}

function fCheckFormInsertOnlyTextarea(){
	if (oForm[0].value ==="") {
		alert('La note est vide, il faut la remplir.')
		return 'content';
	}
	else {
		return "ok";
	}
}

function insertNewNoteInDbb(aResponseForm) {
	if (aResponseForm!=="") {
		var sNewNote = aResponseForm[0].replace(/\r\n|\r|\n/g,'<br>');
		var sPathTreeItemToInsert = pathFocused + "b" + XX(parseInt(oDOMFocused.nbOfNotes)+1);
		document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
		ajaxCall('ajax/insertNewTreeItem.php?idTopic=' + idTopic + '&newNote=' + sNewNote
				+ '&sPathTreeItemToInsert=' + sPathTreeItemToInsert, insertNewTreeItemInDbbFailed, insertNewTreeItemUpdateClient, sNewNote, "b");
	}
	else {
		resetDataTreeReadyForEvent();	
	}
}

function insertNewFolderInDbb(aResponseForm) {
	if (aResponseForm!=="") {
		var sNewNote = aResponseForm[0].replace(/\r\n|\r|\n/g,'<br>');
		var sPathTreeItemToInsert = pathFocused + "a" + XX(parseInt(oDOMFocused.nbOfFolders)+1);
		document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
		ajaxCall('ajax/insertNewTreeItem.php?idTopic=' + idTopic + '&newNote=' + sNewNote
				+ '&sPathTreeItemToInsert=' + sPathTreeItemToInsert, insertNewTreeItemInDbbFailed, insertNewTreeItemUpdateClient, sNewNote, "a");
	}
	else {
		resetDataTreeReadyForEvent();	
	}
}

function insertNewTreeItemInDbbFailed(errorMessage) {
	alert ("Impossible d'insérer la catégorie sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenu();
	resetDataTreeReadyForEvent();
}

function insertNewTreeItemUpdateClient(errorMessageFromServer, sNewNote, aORb) {
	if (errorMessageFromServer==="") {
		sNewNote = sNewNote.replace(/"/g, '\\"');
		var sTreeItems = '[{"' + pathFocused + '":{"'+ aORb +'":[["' + sNewNote + '"]]}}]';
		instantiateRetrievedTree(sTreeItems);			
		if (pathFocused === oTreeNotes.openedFolder) {
			var sNbOfItems = aORb ==="a" ? "nbOfFolders" : "nbOfNotes"; 
			//alert (pathFocused + aORb + XX(oDOMFocused.nbOfFolders));
			document.getElementById(pathFocused + aORb + XX(oDOMFocused[sNbOfItems])).style.display = 'block';				
		}
		else {
			oTreeNotes.moveInSimpleTree(pathFocused);
		}
		pathSendGeolocation = pathFocused + aORb + XX(oDOMFocused[sNbOfItems]);
		getGeolocation(insertGeolocationTreeItemInDbb);
		resetDataTreeReadyForEvent();
	}
	else {
		alert ("Erreur inattendue lors de l'insertion dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}

function insertGeolocationTreeItemInDbb(oPosition) {
	if (oPosition==="not supported") {
		getGeolocationTreeItemFailed("Warning : Geolocation is not supported by this browser.");
	}
	else {
		ajaxCall('ajax/insertTreeItemGeolocation.php?idTopic=' + idTopic + "&pathToUpdateGeolocation=" + pathSendGeolocation 
																	+ "&latitude=" + oPosition.coords.latitude 
																	+ "&longitude=" + oPosition.coords.longitude
																	+ "&accuracyPosition=" + oPosition.coords.accuracy,
																	getGeolocationTreeItemFailed, getLocationTreeItemUpdateClient);	
	}
	toDoSendGeolocationPosition = null;
}

function getGeolocationTreeItemFailed(errorMessage) {
	alert (errorMessage + "\nLa position n'a pas pu être insérée.");
	//document.getElementById("noScroll").innerHTML += "la position n'a pas pu être insérée.";
}

function getLocationTreeItemUpdateClient(errorMessageFromServer) {
	if (errorMessageFromServer!=="") {
		alert ("Erreur inattendue lors de l'insertion dans le serveur de la geolocalisation. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}


function editTreeItemLaunch() {
	hideContextMenu();
	var sForm = '[{"name":"content","HTMLType" : "textarea" , "attributes" : { "rows" : "5" , "cols" : "30", "maxLength" : "1700", "value" : "' 
	+ oDOMFocused.content.replace(/<br>/g,'\\n') + '" }, "label" : "Entrée à modifier :"}]';
	superFormModale(sForm, "Editer", editTreeItemInDbb, "array", fCheckFormInsertOnlyTextarea);	
}

function editTreeItemInDbb(aResponseForm) {
	if (aResponseForm!=="") {
		var sNewNote = aResponseForm[0].replace(/\r\n|\r|\n/g,'<br>');
		document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
		ajaxCall('ajax/editTreeItem.php?idTopic=' + idTopic + '&sPathToEdit=' + pathFocused + '&sNewNote=' + sNewNote, editTreeItemFailed, editTreeItemUpdateClient, sNewNote);		
	}
	else {
		resetDataTreeReadyForEvent();	
	}
}

function editTreeItemFailed(errorMessage) {
	alert ("Impossible d'accéder à l'élément sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenu();
	resetDataTreeReadyForEvent();
}

function editTreeItemUpdateClient(errorMessageFromServer, sNewContent) {
	if (errorMessageFromServer==="") {
		oDOMFocused.content = sNewContent.replace(/&lt;br&gt;/gi, "\n");
		oDOMFocused.innerHTML = oDOMFocused.content;
		document.getElementById("greyLayerOnFrameOfTree").style.display = 'none';
		resetDataTreeReadyForEvent();
	}
	else {
		alert ("Erreur inattendue lors de l'insertion dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}

function deleteFolderLaunch() {
	hideContextMenu();
	if (confirm("Êtes-vous sûr de bien vouloir effacer cette catégorie ?") == true) {
		deleteFolderInDbb();		
	}
	else {
		resetColorTreeItem();
		pathFocused = null;
	}
}

function deleteFolderInDbb() {
	var pathParent = pathFocused.slice(0,-3);
	oTreeNotes.moveInSimpleTree(pathParent); // si le folder à effacer est un ancêtre de openedFolder ou openedFolder lui même, on fait un moveInSimpleTree où openedFolder est le père de pathFocused 
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
	ajaxCall('ajax/deleteFolder.php?idTopic=' + idTopic + '&sCategoryToDelete=' + pathFocused, deleteFolderInDbbFailed, deleteFolderUpdateClient);
}

function deleteFolderInDbbFailed(errorMessage) {
	alert ("Impossible d'effacer l'élément sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenu();
	resetDataTreeReadyForEvent();
}

function deleteFolderUpdateClient(errorMessageFromServer) {
	if (errorMessageFromServer==="") {
		aoDOMToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+pathFocused+'a'+'"]');
		for (var i=0 ; i < aoDOMToDelete.length ; i++ ) {
			document.getElementById("frameOfTree").removeChild(aoDOMToDelete[i]);
		}
		
		aoDOMToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+pathFocused+'b'+'"]'); 
		for (var j=0 ; j < aoDOMToDelete.length ; j++ ) {
			document.getElementById("frameOfTree").removeChild(aoDOMToDelete[j]);
		}			
		
		var rankOfFolderDeleted = parseInt(pathFocused.substr(-2,2));
		//alert (rankOfFolderDeleted)
		var pathParent = pathFocused.slice(0,-3);
		//alert (pathParent);
		var oDOMParent = document.getElementById(pathParent);
	
		aoDOMIdToUpdate = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+pathParent+'a'+'"]'); // on renumérote les ids des folders
		//alert(aoDOMIdToUpdate.length)
		var m = 0;
		while (m < aoDOMIdToUpdate.length) {
			idOfElement = aoDOMIdToUpdate[m].id;
			//alert ("idOfElement à updater = "+idOfElement)
			rankInsideElement = parseInt(idOfElement.substr(pathParent.length+1,2));
			if (rankInsideElement > rankOfFolderDeleted) {
				idOfElementNew = pathParent+ "a"+ XX(rankInsideElement-1) + idOfElement.substr(pathParent.length+3);
				aoDOMIdToUpdate[m].id = idOfElementNew; // faire une seule ligne des deux précédentes
				//alert (idOfElement + " devient " + pathParent+ "a"+ XX(rankInsideElement-1) + idOfElement.substr(pathParent.length+3));
			}
			m +=1;
		}
		document.getElementById("frameOfTree").removeChild(oDOMFocused); // on efface le folder en jeu
		oDOMParent.nbOfFolders -=1;
		resetDataTreeReadyForEvent();
	}
	else {
		alert ("Erreur inattendue lors de l'effacement dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}

function deleteNoteLaunch() {
	hideContextMenu();
	if (confirm("Êtes-vous sûr de bien vouloir effacer cette note ?") == true) {
		deleteNoteInDbb();	
	}
	else {
		resetColorTreeItem();
		pathFocused = null;
	}
	
}

function deleteNoteInDbb() {
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
	ajaxCall('ajax/deleteNote.php?idTopic=' + idTopic + '&sCategoryToDelete=' + pathFocused, deleteNoteInDbbFailed, deleteNoteUpdateClient);
}

function deleteNoteInDbbFailed(errorMessage) {
	alert ("Impossible d'effacer l'élément sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenu();
	resetDataTreeReadyForEvent();
}

 function deleteNoteUpdateClient(errorMessageFromServer) {
	if (errorMessageFromServer==="") {
			
		var rankOfNoteDeleted = parseInt(pathFocused.substr(-2,2));
		//alert (rankOfNoteDeleted)
		var pathParent = pathFocused.slice(0,-3);
		//alert (pathParent);
		var oDOMParent = document.getElementById(pathParent);
	
		aoDOMNotesIdToUpdate = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+pathParent+'b'+'"]'); // on renumérote les ids des notes
		//alert(aoDOMIdToUpdate.length)
		
		for (var m = 0 ; m < aoDOMNotesIdToUpdate.length ; m++) {
			idOfElement = aoDOMNotesIdToUpdate[m].id;
			//alert ("idOfElement à updater = "+idOfElement)
			rankOfCurrentNote = parseInt(idOfElement.substr(pathParent.length+1,2));
			if (rankOfCurrentNote > rankOfNoteDeleted) {
				aoDOMNotesIdToUpdate[m].id = pathParent+ "b"+ XX(rankOfCurrentNote-1)
			}
		}
		document.getElementById("frameOfTree").removeChild(oDOMFocused); // on efface la note en jeu
		oDOMParent.nbOfNotes -=1;
		resetDataTreeReadyForEvent();
	}
	else {
		alert ("Erreur inattendue lors de l'effacement dans le serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}
		


document.getElementById("DisplayContentFolder").addEventListener('click', function() {
	hideContextMenu();
	displayTreeInNewWindow(pathFocused);
	alert("Fait !\n\nL'arbre a été exporté dans un autre onglet ou une fenêtre (cela dépend de votre navigateur).");
	resetColorTreeItem();
	pathFocused = null;
}, false);

document.getElementById("moveTreeItem").addEventListener('click', moveTreetItemLaunch, false);

function moveTreetItemLaunch() {
	pathToPaste = pathFocused; // oDOMFocused ??
	resetColorTreeItem();
	hideContextMenu();
	ongoingAction = 'moveTreeItem';
} 

/* document.getElementById("pasteHereTreeItem").addEventListener('click', function() {
	hideContextMenu();
	//alert ("pathFocused =" + pathFocused + "  pathToPaste =" + pathToPaste);
	if (pathFocused === pathToPaste.slice(0,-3)) {
		alert("Vous essayez de coller votre item à l'endroit où il se trouve déjà. Recommencez à un autre endroit.");
		resetColorTreeItem();
	} 
	else if (pathFocused.indexOf(pathToPaste) == 0){
		alert("Vous essayez de coller votre item dans un de ses descendants, ça n'est pas possible !");
		resetColorTreeItem();
	}
	else {
		if (pathToPaste.substr(-3,1)==="a") {
			if (oDOMFocused.nbOfFolders <= 98) {
				pasteHereTreeItemInDbb(pathToPaste, pathFocused);							
			}
			else {
				alert("Pas possible de déplacer la catégorie ici.\n\nVous avez atteint la limite prévue des 99 sous-catégories !\n\nIl serait utile de mieux réorganiser les catégories.")
				resetColorTreeItem();
				pathFocused = null;
			}
		}
		else if (pathToPaste.substr(-3,1)==="b"){
			if (oDOMFocused.nbOfNotes <= 98) {
				pasteHereTreeItemInDbb(pathToPaste, pathFocused);							
			}
			else {
				alert("Pas possible de déplacer la note ici.\n\nVous avez atteint la limite prévue des 99 notes !\n\nIl serait utile de mieux réorganiser les notes.")
				resetColorTreeItem();
				pathFocused = null;
			}
		}
	}
}, false); */

document.getElementById("getOutFromHere").addEventListener('click', function() {
	hideContextMenu();
	resetColorTreeItem();
}, false)

document.getElementById("cancel").addEventListener('click', function () {
	hideContextMenu();
	resetColorTreeItem();
	pathFocused = null;
	pathToPaste = null;
	ongoingAction = null;
}, false);

function resetColorTreeItem() {
	if (oDOMFocused !== undefined) {
		var sOriginalColorOfDivTreeItem;
		if (pathFocused === "01" || pathFocused.substr(-3,1)==="a") {
			sOriginalColorOfDivTreeItem = '#ffff00';
		}
		else {
			sOriginalColorOfDivTreeItem = '#ffffff';
		}
		oDOMFocused.style.backgroundColor = sOriginalColorOfDivTreeItem;
	}
}



function pasteHereTreeItemInDbb(sPathToMove, sPathWhereToPaste) {
	var sNbItemType = sPathToMove.substr(-3,1) === "a" ? "nbOfFolders" : "nbOfNotes"; 
	var rowOfPasteItem = XX(parseInt(ToutesCategories[sPathWhereToPaste][sNbItemType])+1); // ou trouver ce nombre et le XX du cote serveur avec une requete dbb?
	//alert (rowOfPasteItem);
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';	
	ajaxCall('ajax/moveItem.php?idTopic=' + idTopic + '&sPathToMove=' + sPathToMove	+ '&sPathWhereToPaste=' + sPathWhereToPaste 
						+ '&rowOfPasteItem=' + rowOfPasteItem,
						pasteHereTreeItemInDbbFailed, pasteHereTreeItemUpdateClient, 
						sPathToMove, sPathWhereToPaste);
}

/* function pasteHereTreeItemInDbbFailed(errorMessage) {
	alert ("Impossible de déplacer l'élément sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenu();
	resetDataTreeReadyForEvent();
} */


/*
function pasteHereTreeItemUpdateClient(errorMessageFromServer, sPathToMove, sPathWhereToPaste) {
	if (errorMessageFromServer==="") {
		var oDOMToMove = document.getElementById(sPathToMove);
		var oDOMWhereToPaste = document.getElementById(sPathWhereToPaste);
		var nbOfFoldersInPathWhereToPaste = oDOMWhereToPaste.nbOfFolders;
		var nbOfNotesInPathWhereToPaste = oDOMWhereToPaste.nbOfNotes;
		
		var sTreeToMoveJSON = "{";		
		var relativePath = "";
		var aORb = "a";
		var currentRank = 1;
		var oDOMToChange;
		var sPathToChange;
		var sNbOfItems
		
		do { // lister les treeItem par ordre alphabétique de div et fabriquer le json avec
			sNbOfItems = aORb ==="a" ? "nbOfFolders" : "nbOfNotes"; 
			if (document.getElementById(sPathToMove + relativePath) !== undefined) {
				oDOMToChange = document.getElementById(sPathToMove + relativePath);
				sPathToChange = oDOMToChange.id;
				sTreeToMoveJSON += '"'+ sPathToMove + aORb + XX(nbOfTreeItemsInPathWhereToPaste + currentRank) + '":["'
										+ oDOMToChange.content + '","' + oDOMToChange.dateCreation + '","'+ '"],'
				currentRank += 1;				
			}
			else if (aORb ==="a") {
				aORb = "b";
				currentRank = 1;
			}
			else if (aORb === "b") {
				relativePath += "a01"
				aOrb = "a";
				currentRank = 1;
			}
		} while (sPathToChange.indexOf(sPathToMove) === 0);
		sTreeToMoveJSON .= substr(0,-1).'"}';
	 	
	
		// effacer toutes les div des treeItem dans le folder parent de sPathToMove (mais pas le folder parent lui-même)
		sPathParentOfCutPath = sPathToMove.slice(0,-3);
		aoDOMToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sPathParentOfCutPath+'a'+'"]');
		for (var i=0 ; i < aoDOMToDelete.length ; i++ ) {
			document.getElementById("frameOfTree").removeChild(aoDOMToDelete[i]);
		}
		oDOMToMove.nbOfFolders =0;
		
		aoDOMToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sPathParentOfCutPath+'b'+'"]'); 
		for (var j=0 ; j < aoDOMToDelete.length ; j++ ) {
			document.getElementById("frameOfTree").removeChild(aoDOMToDelete[j]);
		}			
		oDOMToMove.nbOfNotes =0;
	 }
	else {
		alert ("Erreur inattendue lors du déplacement au niveau du serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}

 	
		
		// insérer le folder déplacé dans sPathWhereToPaste
		var sInstantiateFolderMoved = '["'+pathFocused+sPathToMove.substr(-3,1)+rowOfPasteItem+'","'+ToutesCategories[sPathToMove].sContent+'"]';
		instancierArborescenceRecuperee ( sInstantiateFolderMoved , pathFocused );
		document.getElementById("fondPageEntrerTexte").style.display = 'none';
		resetColorTreeItem();
		pathFocused = null;
		pathToPaste = null;
		ongoingAction = null;
		//ajouter l'affichage de ce qui a �t� coll�

 */
// document.getElementById("NouvelleNote").addEventListener('click', insertNewNote, false); // insert depuis le menu html, att! pas encore impl�ment�

function displayTreeInNewWindow(sOriginPathTreeToDisplay) {
	window.open('displayTreeInNewWindow/displayTreeInNewWindow?idTopic='+idTopic+'&sOriginPathTreeToDisplay='+sOriginPathTreeToDisplay);
}

function resetDataTreeReadyForEvent() {
	resetColorTreeItem();
	pathFocused = null;
	document.getElementById("greyLayerOnFrameOfTree").style.display = "none";	
}


//document.getElementById("importTreeHere").addEventListener('click', importTreeLaunchfunction, false);

function importTreeLaunch() {
	hideContextMenu();
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
	document.getElementById("frameOfFileLoader").style.display = 'block';
}

document.getElementById("cancelLoadFile").addEventListener('click', function() {
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'none';
	document.getElementById("frameOfFileLoader").style.display = 'none';
	resetColorTreeItem();
	pathFocused = null;
}, false);

/* document.getElementById("loadDataTreeJSON").addEventListener('change', function() {
	var reader = new FileReader();
	reader.onload = function() {
		var sErrorMessage = 'Le contenu du fichier "' + document.querySelector('#loadDataTreeJSON').files[0].name + '" n\'est pas valide : ';  
		var isJSONError = false;
		try {
			JSON.parse(reader.result);
		}
		catch(e) {
			alert (sErrorMessage+'\n\nError '+e.message);
			isJSONError = true;
		}
		finally {
			if (!isJSONError) {			
				var aTreeItems = JSON.parse(reader.result);
				
				if (aTreeItems[0].hasOwnProperty('error')) {
					alert (sErrorMessage + aTreeItems[0].error);		
				} 
				else { //le fichier peut donc être parsé 
					nbOfNotesInPathFocused = oDOMFocused.nbOfNotes;
					nbOfFoldersInPathFocused = oDOMFocused.nbOfFolders;
					ShouldBePathStart = "a01";			
					for (var i=0; i < aTreeItems.length; i++) {
						for (endOfPath in aTreeItems[i]) {
							if (/^[ab][0-9]{2}([ab][0-9]{2}$/.test(endOfPath)
							
							if (/^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(aTreeItems[i][endOfPath][1])) {// vérification du format de dateCreation
								if (aTreeItems[i][endOfPath].susbtr(0,3) === ShouldBePathStart) {
									aTreeItems[i][endOfPath]
									//alert(aTreeItems[i][path][0]); 
								}
							}
							else {
								// export ok écrire mais dates non correctes
							}
						}
					}
				alert ("parsé !");
				//}
			}
		}
	}
	reader.readAsText(document.querySelector('#loadDataTreeJSON').files[0]);
	//document.getElementById("greyLayerOnFrameOfTree").style.display = 'none';
}, false);
 */
document.getElementById("exportTreeFromHere").addEventListener('click', function () {
	hideContextMenu();
	exportTreeFromHere(pathFocused);
	alert("Le fichier à télécharger a été créé.");
	resetColorTreeItem();
	pathFocused = null;
}, false);
	
function exportTreeFromHere(sParentPathOfTreeToExport) {
	window.open('exports/downloadDataTreeJSON.php?idTopic='+idTopic+'&sParentPathOfTreeToExport='+sParentPathOfTreeToExport);	
}