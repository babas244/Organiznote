var iRetraitAffichagedUneCategorie= 10;
var pathFocused = null;
var ongoingAction = null;
var pathToPaste = null;
var TreezIndex = -1;
var emailAddressSiteAdmin = "postmaster@";
var pathSendGeolocation;
var oJSONFormTempDataTree = [];
var oJSONTempDataTree = [];

document.getElementById("displayAndHideTree").addEventListener('click', function () {
	TreezIndex = TreezIndex === -1 ? 1 : -1; 
	document.getElementById("containerOfTree").style.zIndex = TreezIndex;
}, false);

start();

function start() {
	ajaxCall('ajax/InstantiateRoot.php?idTopic=' + idTopic, '', instantiateRootFailed, instantiateRoot)
}

function instantiateRoot(topic) {
	//checkResponseAjax(topic,"instantiateRoot");
	document.getElementById("greyLayerOnFrameOfTree").style.display = "block";
	oDOMRoot = document.getElementById("01")
	oDOMRoot.innerHTML = topic;   //textContent? 
	oDOMRoot.style.border = '2px black solid'
	oDOMRoot.className = "unselectable folder";
	oTreeNotes = new SimpleTree("01");					
	oDOMRoot.addEventListener('click', function(e) {
		oTreeNotes.moveInSimpleTree(e.target.id);
	}, false);					
	addContextMenuDataTree(oDOMRoot);
	pathFocused = "01";
	oDOMFocused = document.getElementById("01");
	GetWholeTreeDbCall(displayRoot);
	//ajaxCall('ajax/getCategoryChild.php?idTopic=' + idTopic + '&sPathParent=01' , '', instantiateRootFailed, prepareInstantiateFolder, "01", displayRoot);// il faudra remettre cet appel plutôt que GetWholeTreeDbCall(displayRoot)
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
	console.log("dataTree performance time : " + performance.now());
	//test();
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
	document.getElementById(pathFocused).style.animationName = 'treeItemIsSelected';

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
	
	//alert ('nb de folders '+ document.getElementById(requestedFolder).nbOfFolders)
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
				//console.log('requested = ' + requestedFolder+'a'+XX(j+1))
				document.getElementById(requestedFolder+'a'+XX(j+1)).style.display = 'block';
			}
		
			for (var m = 0 ; m < document.getElementById(requestedFolder).nbOfNotes; m++) { // afficher les notes dans requestedFolder
		//console.log('requestedFolder+b+XX(m+1) = '+requestedFolder+'b'+XX(m+1))
				document.getElementById(requestedFolder+'b'+XX(m+1)).style.display = 'block';
			}
		this.openedFolder = requestedFolder;  
		//alert("en fin de function, this.openedFolder = " + this.openedFolder);
		}	
	document.getElementById("greyLayerOnFrameOfTree").style.display = "none";
	}		
}

function instantiateRetrievedTree ( sTreeItems , fCallback, path ) {
	//console.log ("In instantiateRetrievedTree with fCallback = " + (fCallback !== undefined ? fCallback.name : "-") + ", and sTreeItems =" + sTreeItems);
	var aTreeItems = sTreeItems == "" ? "" : JSON.parse(sTreeItems);
	var i,j,k;
	var nbOfFoldersAddedInPathParent;
	var nbOfNotesAddedInPathParent;
	for (var i = 0 ; i < aTreeItems.length; i++) {
	
		for (pathParent in aTreeItems[i]) { // il n'y a qu'1 seul pathParent, mais on ne connait pas sa valeur
			
			oDOMParent = document.getElementById(pathParent);
			var oDOMNextPathParent = undefined; // valeur par défaut, avant les tests
			var isParentHasNote = false;
			var isParentHasFolder = false;
			
			// si parent a une note au moins 
		//console.log ('nbOfNotesParent avant instanciation = '+ oDOMParent.nbOfNotes);		
			if (oDOMParent.nbOfNotes !== undefined) { 
				if (oDOMParent.nbOfNotes > 0) {
					// si la dernière note de parent a un nextElementSibling, parent n'est donc pas la dernière div
					if (document.getElementById(pathParent + "b" + XX(oDOMParent.nbOfNotes)).nextElementSibling!==null) {
						// on insérera donc les note et les folders avant la div suivant la dernière note
						oDOMNextPathParent = document.getElementById(pathParent + "b" + XX(oDOMParent.nbOfNotes)).nextElementSibling;
					}
					isParentHasNote = true;
				}
			}
			
			// si parent n'a pas de notes mais un folder au moins
		//console.log ('nbOfFoldersParent avant instanciation = '+ oDOMParent.nbOfFolders);	
		//console.log ('isParentHasNote = ' + isParentHasNote)	
			if (oDOMParent.nbOfFolders !== undefined && !isParentHasNote) {
				if (oDOMParent.nbOfFolders > 0) {
					// si le dernier folder de parent a un nextElementSibling, parent n'est pas la dernière div
					if (document.getElementById(pathParent + "a" + XX(oDOMParent.nbOfFolders)).nextElementSibling!==null) {
						// on insérera donc les notes et les folders avant la div suivant le dernier folder
						oDOMNextPathParent = document.getElementById(pathParent + "a" + XX(oDOMParent.nbOfFolders)).nextElementSibling;		
			//alert ('pathParent = ' + oDOMNextPathParent.id)
					}
					isParentHasFolder = true;
				}
			}
			
			// si parent est vide
			if (!isParentHasFolder && !isParentHasNote) { 
		//console.log('parent est vide')
				// si parent a une div le suivant, on insérera les notes et les folders avant cette div
				if (oDOMParent.nextElementSibling) {
		//console.log('nextSiblingParent = ' + oDOMParent.nextElementSibling.id)
					oDOMNextPathParent = oDOMParent.nextElementSibling
				}
			}
			
/* 			if (oDOMParent.nbOfNotes !== undefined && oDOMParent.nbOfNotes = 0) {//|| (oDOMParent.nbOfFoldfers !== undefined && oDOMParent.nbOfNotes = 0)) {
				if (oDOMParent.nextElementSibling) {
		//console.log('nextSiblingParent = ' + oDOMParent.nextElementSibling.id)
					oDOMNextPathParent = oDOMParent.nextElementSibling
				}
				
			}
 */		//console.log('pathParent = ' +pathParent)
		//console.log('nextPathParent = ' + (oDOMNextPathParent !== undefined ? oDOMNextPathParent.id : 'undefined'))
		
			 
			oDOMParent.nbOfFolders = oDOMParent.nbOfFolders===undefined ? 0 : oDOMParent.nbOfFolders;
			oDOMParent.nbOfNotes = oDOMParent.nbOfNotes===undefined ? 0 : oDOMParent.nbOfNotes;
			nbOfFoldersAddedToParent = aTreeItems[i][pathParent].a == undefined ? 0 : aTreeItems[i][pathParent].a.length;
			nbOfNotesAddedToParent = aTreeItems[i][pathParent].b == undefined ? 0 : aTreeItems[i][pathParent].b.length;
			
			if (nbOfNotesAddedToParent > 0) {
				// on insère d'abord les notes
				for (k = 0 ; k < nbOfNotesAddedToParent ; k++) {
					var oDOMNote = document.createElement("div");
					oDOMNote.id  = pathParent + "b" + XX(oDOMParent.nbOfNotes+k+1);
					oDOMNote.content = aTreeItems[i][pathParent].b[k][0];
					oDOMNote.innerHTML = oDOMNote.content;
					oDOMNote.style.display = 'none';
					oDOMNote.className = "note unselectable";
					addContextMenuDataTree(oDOMNote);		
					var iLevelinTree = ((pathParent.length+4)/3)-1;
					oDOMNote.style.marginLeft = iRetraitAffichagedUneCategorie*(iLevelinTree) + 'px'; // mettre la marge en fonction du niveau de la catꨯrie
					if (oDOMNextPathParent) {
						document.getElementById("frameOfTree").insertBefore(oDOMNote, oDOMNextPathParent)
					}
					else {
						document.getElementById("frameOfTree").appendChild(oDOMNote);
					}
				}
				oDOMParent.nbOfNotes += nbOfNotesAddedToParent;
			}
			
			if (nbOfFoldersAddedToParent > 0) {
				var oDOMInsertFolderBefore;		
				
				// s'il n'y a pas de notes dans parent
			//alert (oDOMParent.nbOfNotes)
				if (oDOMParent.nbOfNotes === 0) {
					// et si parent n'est pas le dernier parent; 
					if (oDOMNextPathParent !== undefined) {
						// on devra insérer les folders avant oDOMNextPathParent
						oDOMInsertFolderBefore = oDOMNextPathParent;
					}
					else { // donc si 
						oDOMInsertFolderBefore = undefined;
					}
				}
				// sinon il faudra insérer les folders avant la première note de parent
				else {
					oDOMInsertFolderBefore = document.getElementById(pathParent + "b01");
			//alert ('document.getElementById(pathParent + "b01") = '+ document.getElementById(pathParent + "b01").id)
				}
			//console.log('insertFolderBefore = ' + (oDOMInsertFolderBefore!==undefined ? oDOMInsertFolderBefore.id : 'undefined'));
				
				for (j = 0 ; j < nbOfFoldersAddedToParent ; j++) {
					var oDOMFolder = document.createElement("div");
					oDOMFolder.id  = pathParent + "a" + XX(oDOMParent.nbOfFolders+j+1);
					//alert ("i = " + i + "pathParent =" +pathParent +  "aTreeItems[i][pathParent].a[j][0] =" + aTreeItems[i][pathParent].a[j][0])
					oDOMFolder.content = aTreeItems[i][pathParent].a[j][0];
					oDOMFolder.innerHTML = oDOMFolder.content;
					oDOMFolder.style.display = 'none';
					oDOMFolder.className = "folder unselectable";
					addContextMenuDataTree(oDOMFolder);
					oDOMFolder.addEventListener('click', function(e) {
						moveInSimpleTreeLaunch(e.target.id);
					}, false);				
					var iLevelinTree = ((pathParent.length+4)/3)-1;
					oDOMFolder.style.marginLeft = iRetraitAffichagedUneCategorie*(iLevelinTree) + 'px'; // mettre la marge en fonction du niveau de la cat�gorie
					if (oDOMInsertFolderBefore) {
						document.getElementById("frameOfTree").insertBefore(oDOMFolder, oDOMInsertFolderBefore)
					}
					else {
						document.getElementById("frameOfTree").appendChild(oDOMFolder);
					}				
				}
				oDOMParent.nbOfFolders += nbOfFoldersAddedToParent;
			}			
		}	
	}
	if (fCallback !==undefined) {fCallback(path);}
}

function GetWholeTreeDbCall(fCallback) {
	ajaxCall('ajax/getWholeBranchOfTree.php?idTopic=' + idTopic + '&originPath=01', '',
				GetWholeTreeDbCallFailed, InstantiateWholeTreeClient, fCallback);
}

function GetWholeTreeDbCallFailed(errorMessageFromServer) {
	alert ("La récupération de l'arbre n'a pas fonctionnée. \n\nMessage d'erreur : " + errorMessageFromServer);
}

function InstantiateWholeTreeClient(sTreeItems, fCallback) {
	
	var pathParent, i, iLevelinTree 
	var oDOMParent, oDOMTreeElement
	var aTreeItems = sTreeItems == "" ? "" : JSON.parse(sTreeItems);
	
	for (i = 1 ; i < aTreeItems.length ; i++) {
		oDOMTreeElement = document.createElement("div");
		oDOMTreeElement.id  = aTreeItems[i][0];
		oDOMTreeElement.content = aTreeItems[i][1];
		oDOMTreeElement.innerHTML = oDOMTreeElement.content;
		oDOMTreeElement.style.display = 'none';
		pathParent = oDOMTreeElement.id.slice(0,-3)
		oDOMParent = document.getElementById(pathParent)
		if (oDOMTreeElement.id.substr(-3,1) === 'a') { // si treeItem est un folder
			oDOMTreeElement.className = 'folder unselectable';
			oDOMParent.nbOfFolders === undefined ? oDOMParent.nbOfFolders = 1 : oDOMParent.nbOfFolders+=1; 
			oDOMTreeElement.addEventListener('click', function(e) {
				moveInSimpleTreeLaunch(e.target.id);
			}, false);				
		}
		else { // treeItem est une note
			oDOMTreeElement.className = 'note unselectable';
			oDOMParent.nbOfNotes === undefined ? oDOMParent.nbOfNotes = 1 : oDOMParent.nbOfNotes+=1; 			
		}
		addContextMenuDataTree(oDOMTreeElement);		
		iLevelinTree = ((oDOMTreeElement.id.length+1)/3)-1;
		oDOMTreeElement.style.marginLeft = iRetraitAffichagedUneCategorie*(iLevelinTree) + 'px';
		document.getElementById("frameOfTree").appendChild(oDOMTreeElement);
		
	}
	// on doit reparcourir l'arbre pour repérer les folders sans folders enfants et ou sans notes qui n'ont donc pas encore été marqués comme ayant 0 folders et 0  notes
	for (i = 0 ; i < aTreeItems.length ; i++) {
		document.getElementById(aTreeItems[i][0]).nbOfFolders = document.getElementById(aTreeItems[i][0]).nbOfFolders === undefined ? 0 : document.getElementById(aTreeItems[i][0]).nbOfFolders;
		document.getElementById(aTreeItems[i][0]).nbOfNotes = document.getElementById(aTreeItems[i][0]).nbOfNotes === undefined ? 0 : document.getElementById(aTreeItems[i][0]).nbOfNotes;
	}
	if (fCallback !==undefined) {fCallback();}
}

function moveInSimpleTreeLaunch(pathRequested) {
	oDOMRequested = document.getElementById(pathRequested);
	if (oDOMRequested.nbOfFolders===undefined) {
		document.getElementById("greyLayerOnFrameOfTree").style.display = "block"; 
		ajaxCall('ajax/getCategoryChild.php?idTopic=' + idTopic + '&sPathParent=' + pathRequested, '', prepareInstantiateFolderFailed, prepareInstantiateFolder, pathRequested, moveInTree, pathRequested);			
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
			oJSONFormTempDataTree[0]={};
			oJSONFormTempDataTree[0].name = "content";
			oJSONFormTempDataTree[0].HTMLType="textarea";
			oJSONFormTempDataTree[0].attributes={};
			oJSONFormTempDataTree[0].attributes.cols="30"
			oJSONFormTempDataTree[0].attributes.maxLength="1700"
			oJSONFormTempDataTree[0].attributes.rows="5";
			oJSONFormTempDataTree[0].label="Entrez le nom de la nouvelle note.";
			var sForm = JSON.stringify(oJSONFormTempDataTree);
			oJSONFormTempDataTree = [];
			superFormModale(sForm, "Nouvelle catégorie", insertNewNoteInDbb, fCheckFormInsertOnlyTextarea);	
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
			oJSONFormTempDataTree[0]={};
			oJSONFormTempDataTree[0].name = "content";
			oJSONFormTempDataTree[0].HTMLType="textarea";
			oJSONFormTempDataTree[0].attributes={};
			oJSONFormTempDataTree[0].attributes.cols="30"
			oJSONFormTempDataTree[0].attributes.maxLength="1700"
			oJSONFormTempDataTree[0].attributes.rows="5";
			oJSONFormTempDataTree[0].label="Entrez le nom de la nouvelle catégorie.";
			var sForm = JSON.stringify(oJSONFormTempDataTree);
			oJSONFormTempDataTree = [];
			superFormModale(sForm, "Nouvelle catégorie", insertNewFolderInDbb, fCheckFormInsertOnlyTextarea);	
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

function fCheckFormInsertOnlyTextarea(aResponseFormArray){
	if (aResponseFormArray[0] ==="") {
		alert('La note est vide, il faut la remplir.')
		return 'content';
	}
	else {
		return "ok";
	}
}

function insertNewNoteInDbb(aResponseForm) {
	if (aResponseForm!=="") {
		var sNewNote = hackReplaceAll(aResponseForm[0]);
		var sPathTreeItemToInsert = pathFocused + "b" + XX(parseInt(oDOMFocused.nbOfNotes)+1);
		document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
		ajaxCall('ajax/insertNewTreeItem.php?idTopic=' + idTopic
		+ '&sPathTreeItemToInsert=' + sPathTreeItemToInsert, '&newNote=' + encodeURIComponent(sNewNote), insertNewTreeItemInDbbFailed, insertNewTreeItemUpdateClient, sNewNote, "b");
	}
	else {
		resetDataTreeReadyForEvent();	
	}
}

function insertNewFolderInDbb(aResponseForm) {
	if (aResponseForm!=="") {
		var sNewNote = hackReplaceAll(aResponseForm[0]);
		var sPathTreeItemToInsert = pathFocused + "a" + XX(parseInt(oDOMFocused.nbOfFolders)+1);
		document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
		ajaxCall('ajax/insertNewTreeItem.php?idTopic=' + idTopic
				+ '&sPathTreeItemToInsert=' + sPathTreeItemToInsert, '&newNote=' + encodeURIComponent(sNewNote),insertNewTreeItemInDbbFailed, insertNewTreeItemUpdateClient, sNewNote, "a");
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
		oJSONTempDataTree[0] = {};
		oJSONTempDataTree[0][pathFocused] = {};
		oJSONTempDataTree[0][pathFocused][aORb] = [];
		oJSONTempDataTree[0][pathFocused][aORb][0] = [];
		oJSONTempDataTree[0][pathFocused][aORb][0][0] = sNewNote;		
		var sTreeItems = JSON.stringify(oJSONTempDataTree);
		oJSONTempDataTree = [];
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
																	+ "&accuracyPosition=" + oPosition.coords.accuracy, '',
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
	oJSONFormTempDataTree[0]={};
	oJSONFormTempDataTree[0].name = "content";
	oJSONFormTempDataTree[0].HTMLType="textarea";
	oJSONFormTempDataTree[0].attributes={};
	oJSONFormTempDataTree[0].attributes.cols="30"
	oJSONFormTempDataTree[0].attributes.maxLength="1700"
	oJSONFormTempDataTree[0].attributes.rows="5";
	oJSONFormTempDataTree[0].attributes.value= oDOMFocused.content;
	oJSONFormTempDataTree[0].label="Entrée à modifier :";
	var sForm = JSON.stringify(oJSONFormTempDataTree);
	oJSONFormTempDataTree = [];
	superFormModale(sForm, "Editer", editTreeItemInDbb, fCheckFormInsertOnlyTextarea);	
}

function editTreeItemInDbb(aResponseForm) {
	if (aResponseForm!=="") {
		var sNewNote = hackReplaceAll(aResponseForm[0]);
		document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
		ajaxCall('ajax/editTreeItem.php?idTopic=' + idTopic +'&sPath=' + pathFocused,'sNewNote=' + encodeURIComponent(sNewNote) +'&sContentStart='+oDOMFocused.content, editTreeItemFailed, editTreeItemUpdateClient, sNewNote);		
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
		oDOMFocused.content = sNewContent;
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
	ajaxCall('ajax/deleteFolder.php?idTopic=' + idTopic + '&sPath=' + pathFocused, 'sContentStart=' + oDOMFocused.content, deleteFolderInDbbFailed, deleteFolderUpdateClient);
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
	ajaxCall('ajax/deleteNote.php?idTopic=' + idTopic + '&sPath=' + pathFocused, 'sContentStart=' + oDOMFocused.content, deleteNoteInDbbFailed, deleteNoteUpdateClient);
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

document.getElementById("pasteHereTreeItem").addEventListener('click', function() {
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
}, false);

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
		oDOMFocused.style.animationName = 'none';
	}
}

/* document.getElementById("boutonTest").addEventListener('click', function () {
	
},false); */ 

function pasteHereTreeItemInDbb(sPathToMove, sPathWhereToPaste) {
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';	
	ajaxCall('ajax/moveItem.php?idTopic=' + idTopic + '&sCutPath=' + sPathToMove	+ '&sPathWhereToPaste=' + sPathWhereToPaste, '',
						pasteHereTreeItemInDbbFailed, pasteHereTreeItemUpdateClient, sPathToMove, sPathWhereToPaste);
}

function pasteHereTreeItemInDbbFailed(errorMessage) {
	alert ("Impossible de déplacer l'élément sur le serveur car celui-ci est inaccessible. Vérifiez votre connexion Internet et recommencez." + errorMessage); 
	hideContextMenu();
	resetDataTreeReadyForEvent();
}

/*
document.getElementById("test").addEventListener('click', test)

function test() {
	//document.getElementById('01a03').click();
	var sPathToMove = '01b01'
	var sPathWhereToPaste = '01a02'
	console.log('sPathToMove = '+ sPathToMove)
	console.log('sPathWhereToPaste = ' + sPathWhereToPaste)
	oTreeNotes.moveInSimpleTree(sPathWhereToPaste);
	pasteHereTreeItemUpdateClient('', sPathToMove, sPathWhereToPaste)
	//alert();
}
*/ 

function pasteHereTreeItemUpdateClient(errorMessageFromServer, sPathToMove, sPathWhereToPaste) {
	if (errorMessageFromServer==="") {		
		
		var oDOMPathToMove = document.getElementById(sPathToMove);
		var pathToMoveLength = oDOMPathToMove.id.length;
		var oDOMPathToInsertNoteBefore = null;
		var oDOMPathToInsertEveryElementBefore = null;
		var oDOMPathWhereToPaste = document.getElementById(sPathWhereToPaste);
		console.log('\n\nMove       ' + sPathToMove + '         (:' + oDOMPathToMove.content + ')             vers  '+ sPathWhereToPaste)
		
		// Si c'est une note
		if (sPathToMove.substr(-3,1)==="b"){
			
			var oDOMNoteSiblingToDecrease = null;
			
			// si NoteToMove a une note sibling après elle, on la dé&termine avant de déplacer la note
			if (oDOMPathToMove.nextElementSibling!==null) {
				oDOMNoteSiblingToDecrease = oDOMPathToMove.nextElementSibling.id.length === pathToMoveLength
									? oDOMPathToMove.nextElementSibling
									: null; // note suivant la note déplacée(null si rien) 
			}
		//console.log('premiere NoteToDecrease '+oDOMNoteSiblingToDecrease.id)
		//alert (oDOMNoteSiblingToDecrease.id)
			//on cherche le nombre de notes dans sPathWhereToPaste
			var nbOfNotesInPathWhereToPaste = parseInt(oDOMPathWhereToPaste.nbOfNotes);

			// On cherche l'élément du DOM suivant la dernière note (null si le note était la derniere de frameOfTree)
			if (nbOfNotesInPathWhereToPaste!==0) {
				if (document.getElementById(sPathWhereToPaste + 'b' + XX(nbOfNotesInPathWhereToPaste)).nextElementSibling!==null) {
					oDOMPathToInsertNoteBefore =  document.getElementById(sPathWhereToPaste + 'b' + XX(nbOfNotesInPathWhereToPaste)).nextElementSibling;			
				}
			}
			else {
				if (oDOMPathWhereToPaste.nextElementSibling!==null) {
					oDOMPathToInsertEveryElementBefore = oDOMPathWhereToPaste.nextElementSibling;					
				}				
			}

			// on incrémente le nombre de notes de sPathWhereToPaste
			oDOMPathWhereToPaste.nbOfNotes += 1;
			
			// On déplace alors la note dans le DOM
			if (oDOMPathToInsertNoteBefore === null) {
				document.getElementById('frameOfTree').appendChild(oDOMPathToMove);
			}
			else {
				document.getElementById('frameOfTree').insertBefore(oDOMPathToMove,oDOMPathToInsertNoteBefore);
			}

			// on déduit du nb de notes le nouvel id de la note déplacée
			oDOMPathToMove.id = sPathWhereToPaste + 'b' + XX(nbOfNotesInPathWhereToPaste+1);
			
			// on change sa margin-left et on la rend visible
			oDOMPathToMove.style.marginLeft = iRetraitAffichagedUneCategorie*(((sPathWhereToPaste.length+4)/3)-1) + 'px'
			oDOMPathToMove.style.display = 'block';
			
			// on désincrémente les id des notes suivant la note déplacée en loopant dans les notes suivantes tant que la longueur du path est égale à celle de la note déplacée
			if (oDOMNoteSiblingToDecrease!==null) {
				while (oDOMNoteSiblingToDecrease.id.length === pathToMoveLength) {
		console.log('avant decrease = ' + oDOMNoteSiblingToDecrease.id)
					oDOMNoteSiblingToDecrease.id = oDOMNoteSiblingToDecrease.id.slice(0,-2)+XX(parseInt(oDOMNoteSiblingToDecrease.id.substr(-2,2))-1)
		console.log('après decrease = ' + oDOMNoteSiblingToDecrease.id)
		
					if (oDOMNoteSiblingToDecrease.nextElementSibling!==null) {
						oDOMNoteSiblingToDecrease = oDOMNoteSiblingToDecrease.nextElementSibling;
					}
					else {break;}
				}
			}
			// on désincrémente le nombre de notes de parentPathToMove
			document.getElementById(sPathToMove.slice(0,-3)).nbOfNotes -= 1;

			
		}
		else { // si donc c'est un folder que l'on déplace

			var oDOMTreeItemToMove
			
			// si FolderToMove a un descendant, ce dernier sera oDOMTreeItemToMove
			if (oDOMPathToMove.nextElementSibling!==null) {
				oDOMTreeItemToMove = oDOMPathToMove.nextElementSibling.id.length > pathToMoveLength
									? oDOMPathToMove.nextElementSibling
									: null; // premier descendant du folder à déplacer (null si rien) 
			}
			
			//on cherche le nombre de folders dans sPathWhereToPaste
			var nbOfFoldersInPathWhereToPaste = parseInt(oDOMPathWhereToPaste.nbOfFolders);

			// On cherche l'élément du DOM suivant le dernier folder dans sPathWhereToPaste(null si le folder était la derniere div de frameOfTree)
		//console.log('Après dernier derrière WtPaste '+  sPathWhereToPaste + 'a' + XX(nbOfFoldersInPathWhereToPaste))
			if (nbOfFoldersInPathWhereToPaste!==0) {
				if (document.getElementById(sPathWhereToPaste + 'a' + XX(nbOfFoldersInPathWhereToPaste)).nextElementSibling!==null) {
					oDOMPathToInsertEveryElementBefore = document.getElementById(sPathWhereToPaste + 'a' + XX(nbOfFoldersInPathWhereToPaste)).nextElementSibling;					
				}
			}
			else {
				if (oDOMPathWhereToPaste.nextElementSibling!==null) {
					oDOMPathToInsertEveryElementBefore = oDOMPathWhereToPaste.nextElementSibling;					
				}				
			}
			
			// on incrémente le nb de Folders de sPathWhereToPaste
			oDOMPathWhereToPaste.nbOfFolders += 1;
			var newRankNewFolder = oDOMPathWhereToPaste.nbOfFolders; // ?
			
		//console.log('oDOMPathToMove = ' +pathToMoveLength)	
			
			// s'il y au moins un descendant 
			if (oDOMTreeItemToMove!==null) {
				// on déplace un par un les descendants du folderToMove
				while (oDOMTreeItemToMove.id.length > pathToMoveLength) {
					// On déplace alors le treeItem dans le DOM
					if (oDOMPathToInsertEveryElementBefore === null) {
						document.getElementById('frameOfTree').appendChild(oDOMTreeItemToMove);
					}
					else {
						document.getElementById('frameOfTree').insertBefore(oDOMTreeItemToMove,oDOMPathToInsertEveryElementBefore);
					}
					// on déduit du nb de notes le nouvel id du treeItem déplacé
		//console.log("avant " + oDOMTreeItemToMove.id);
		//console.log('fin nouveau chemin= ' + oDOMTreeItemToMove.id.substring(sPathToMove.length))
					oDOMTreeItemToMove.id = sPathWhereToPaste + 'a' + XX(newRankNewFolder) + oDOMTreeItemToMove.id.substring(sPathToMove.length);
		//console.log("après " + oDOMTreeItemToMove.id)
					
					// on change sa margin-left // et on la rend visible
					oDOMTreeItemToMove.style.marginLeft = iRetraitAffichagedUneCategorie*(((oDOMTreeItemToMove.id.length+1)/3)-1) + 'px'
					oDOMTreeItemToMove.style.display = 'none';
										
					// on cherche le nouveau suivant de FolderToMove
		//console.log('oDOMPathToMove.id = ' + oDOMPathToMove.id)
					if (oDOMPathToMove.nextElementSibling!==null) {
						oDOMTreeItemToMove = oDOMPathToMove.nextElementSibling
		//alert('Dans le if, nouveau treeItem à déplacer = '+oDOMPathToMove.nextElementSibling.id)
					}
					else {break;}
				}
				
			}
			// il reste à déplacer le folder lui-même et le rendre visible
		//console.log('nbOfFoldersInPathWhereToPaste'+nbOfFoldersInPathWhereToPaste)
			if (nbOfFoldersInPathWhereToPaste === 0) {
				if (oDOMPathWhereToPaste.nextElementSibling!==null) {
					document.getElementById('frameOfTree').insertBefore(oDOMPathToMove,oDOMPathWhereToPaste.nextElementSibling);					
				}
				else {
					document.getElementById('frameOfTree').appendChild(oDOMPathToMove);
				}
			}
			else {
				if (document.getElementById(sPathWhereToPaste + 'a' + XX(newRankNewFolder -1)).nextElementSibling!==null) {
					document.getElementById('frameOfTree').insertBefore(oDOMPathToMove,document.getElementById(sPathWhereToPaste + 'a' + XX(newRankNewFolder -1)).nextElementSibling)					
				}
				else {
					document.getElementById('frameOfTree').appendChild(oDOMPathToMove);
				}
			}
			
			//on décrémente le nb de folders du parent de oDOMPathToMove
			document.getElementById(sPathToMove.slice(0,-3)).nbOfFolders -= 1;
			
			// on transforme son id
		//console.log("Folder avant " + oDOMPathToMove.id);
			oDOMPathToMove.id = sPathWhereToPaste + 'a' + XX(newRankNewFolder);
		//console.log("Folder après " + oDOMPathToMove.id)
			
			// on change sa margin-left et on le rend visible
			oDOMPathToMove.style.marginLeft = iRetraitAffichagedUneCategorie*(((oDOMPathToMove.id.length+1)/3)-1) + 'px'
			oDOMPathToMove.style.display = 'block'; // nécessaire ? 

			// on renomme les id de tous les treeItems (s'il y en a) affectés par le décalage créé car oDOMPathToMove n'existe plus
			
			var oDOMTreeItemToUpdate = null;
			
			// on détermine s'il existe un folder sibling après sPathToMove 
		//console.log (sPathToMove)
			//alert(sPathToMove.slice(0,-2) + XX(parseInt(sPathToMove.substr(-2))+1))
			if (document.getElementById(sPathToMove.slice(0,-2) + XX(parseInt(sPathToMove.substr(-2))+1))!==null) {
				oDOMTreeItemToUpdate = document.getElementById(sPathToMove.slice(0,-2) + XX(parseInt(sPathToMove.substr(-2))+1))
		//console.log('oDOMTreeItemToUpdate.id = '+ oDOMTreeItemToUpdate.id)
			}

			
			if (oDOMTreeItemToUpdate!==null) {
				// On loope dans les folders siblings suivant de oDOMPathToMove, c'est à dire jusqu'à ce qu'on rencontre un id plus court que LengthpathToMove ou bien une note d'id de même longueur
				// le premier item est forcément un folder d'après le test fait au-dessus
				while (oDOMTreeItemToUpdate.id.length > pathToMoveLength || (oDOMTreeItemToUpdate.id.length === pathToMoveLength && oDOMTreeItemToUpdate.id.substr(-3,1) === 'a')) {
			console.log('AVANT décalage = ' +oDOMTreeItemToUpdate.id)
					// on update l'id en décrémentant de 1 la partie qui correspondait au folder enlevé
					oDOMTreeItemToUpdate.id = oDOMTreeItemToUpdate.id.substr(0,pathToMoveLength - 2) + XX(parseInt(oDOMTreeItemToUpdate.id.substr(pathToMoveLength-2,2))-1) + oDOMTreeItemToUpdate.id.substr(pathToMoveLength)
			console.log('Après décalage = ' +oDOMTreeItemToUpdate.id + '\n\n')
					if (oDOMTreeItemToUpdate.nextElementSibling!==null) {
						oDOMTreeItemToUpdate = oDOMTreeItemToUpdate.nextElementSibling;
			//console.log('Next oDOMTreeItemToUpdate = ' + oDOMTreeItemToUpdate.id)
					}
					else {break;}
				}
			}
		}
		oTreeNotes.openedFolder = oDOMPathWhereToPaste.id
		ongoingAction = undefined;
		resetDataTreeReadyForEvent();
		
	}
	else {
		alert ("Erreur inattendue lors du déplacement au niveau du serveur. Contactez l'administrateur. Le message est :\n" + errorMessageFromServer);		
	}
}

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