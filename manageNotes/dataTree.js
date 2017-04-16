var iRetraitAffichagedUneCategorie= 10;
ToutesCategories = {}; // à effacer
var pathFocused = null; // inutile de mettre à null
var ongoingAction = null;
var pathToPaste = null;
var TreezIndex = -1;
var emailAddressSiteAdmin = "postmaster@";

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
		pathFocused = e.target.id;
		oDOMFocused = document.getElementById(pathFocused);
		if (oDOMFocused.nbOfFolders===undefined) { // impossible en fait, car on l'a déjà chargée à l'ouverture de la page
			ajaxCall('ajax/getCategoryChild.php?idTopic=' + idTopic + '&sPathParent=' + pathFocused, prepareInstantiateFolderFailed, prepareInstantiateFolder, moveInTree, pathFocused);			
		}
		else {
			oTreeNotes.moveInSimpleTree(pathFocused);
		}
	}, false);					
	addContextMenuDataTree(oDOMRoot);
	pathFocused = "01";
	ajaxCall('ajax/getCategoryChild.php?idTopic=' + idTopic + '&sPathParent=01' , instantiateRootFailed, prepareInstantiateFolder, displayRoot);
}

function instantiateRootFailed(errorMessage) {
	alert ("Le chargement de l'aborescence n'a pas fonctionné, veuillez recharger la page (touche F5)." + errorMessage);
}

function prepareInstantiateFolderFailed(errorMessage) {
	alert("La catégorie ne peut pas être chargée depuis le serveur, vérifiez votre connexion Internet et recommencez." + errorMessage);
	resetDataTreeReadyForEvent();
}

function moveInTree(requestedFolder) {
	oTreeNotes.moveInSimpleTree(requestedFolder);
}

function prepareInstantiateFolder(sTreeItemsWithoutPathParent, fCallback, path) {
	//checkResponseAjax(sTreeItemsWithoutPathParent,"prepareInstantiateFolder");
	if (sTreeItemsWithoutPathParent !=="") {
		instantiateRetrievedTree('[{"' + pathFocused + '":' + sTreeItemsWithoutPathParent + '}]', fCallback, path);
	}
	else {
		oDOMFocused.nbOfFolders = 0;
		oDOMFocused.nbOfNotes = 0;
		fCallback(path);
	}
}

function displayRoot() {
	oTreeNotes.displaySimpleTree("01");
	pathFocused = null;
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
	console.log ("In instantiateRetrievedTree with fCallback = " + fCallback.name + ", and sTreeItems =" + sTreeItems);
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
				//alert (aTreeItems[i][pathParent].a[j][0])
				oDOMFolder.content = aTreeItems[i][pathParent].a[j][0].replace(/&lt;br&gt;/gi, "\n");
				oDOMFolder.innerHTML = oDOMFolder.content;
				oDOMFolder.style.display = 'none';
				oDOMFolder.className = "folder";
				addContextMenuDataTree(oDOMFolder);
				oDOMFolder.addEventListener('click', function(e) {
					document.getElementById("greyLayerOnFrameOfTree").style.display = "block";
					pathFocused = e.target.id;
					oDOMFocused = document.getElementById(pathFocused);
					if (oDOMFocused.nbOfFolders===undefined) {
						ajaxCall('ajax/getCategoryChild.php?idTopic=' + idTopic + '&sPathParent=' + pathFocused, prepareInstantiateFolderFailed, prepareInstantiateFolder, moveInTree, pathFocused);			
					}
					else {
						oTreeNotes.moveInSimpleTree(pathFocused);
					}
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
	fCallback(path);
	}
}

function addContextMenuDataTree(oDOMTreeItem) {
	oDOMTreeItem.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		pathFocused = e.target.id;
		displayContextMenuDataTree(pathFocused);
	}, false);
}


document.getElementById("insertNewNote").addEventListener('click', function() {
	hideContextMenu();
	if ((ToutesCategories[pathFocused].nbOfNotes) <= 98) {
		ongoingAction = 'insertNewNote';
		initializeFormEnterNote();		
	}
	else {
		alert("Pas possible d'insérer une nouvelle note dans cette catégorie.\n\nVous avez atteint la limite prévue des 99 notes !\n\nIl serait utile de mieux réorganiser les catégories.")
		resetColorTreeItem();
		pathFocused = null;
	}
	
}, false);


document.getElementById("insertNewFolder").addEventListener('click', function() {
	hideContextMenu();
	if ((ToutesCategories[pathFocused].nbOfFolders) <= 98) {
		ongoingAction = 'insertNewFolder';
		initializeFormEnterNote();		
	}
	else {
		alert("Pas possible d'insérer une nouvelle catégorie.\n\nVous avez atteint la limite prévue des 99 sous-catégories !\n\nIl serait utile de mieux réorganiser les catégories.")
		resetColorTreeItem();
		pathFocused = null;
	}
}, false);

document.getElementById("deleteFolder").addEventListener('click', function() {
	hideContextMenu();
	if (confirm("Êtes-vous sûr de bien vouloir effacer cette catégorie ?") == true) {
		queryXhrDeleteFolder(pathFocused);		
	}
	else {
		resetColorTreeItem();
		pathFocused = null;
	}
}, false);

document.getElementById("deleteNote").addEventListener('click', function() {
	hideContextMenu();
	if (confirm("Êtes-vous sûr de bien vouloir effacer cette note ?") == true) {
		queryXhrDeleteNote(pathFocused);	
	}
	else {
		resetColorTreeItem();
		pathFocused = null;
	}
	
}, false);

document.getElementById("editNote").addEventListener('click', function() {
	hideContextMenu();
	ongoingAction = 'editNote';
	initializeFormEnterNote();
	document.getElementById("zoneFormulaireEntrerNote").value = ToutesCategories[pathFocused].sContent.replace(/<br>/g,'\\n');
}, false);

document.getElementById("DisplayContentFolder").addEventListener('click', function() {
	hideContextMenu();
	displayTreeInNewWindow(pathFocused);
	alert("Fait !\n\nL'arbre a été exporté dans un autre onglet ou une fenêtre (cela dépend de votre navigateur).");
	resetColorTreeItem();
	pathFocused = null;
}, false);

document.getElementById("moveTreeItem").addEventListener('click', function() {
	pathToPaste = pathFocused;
	resetColorTreeItem();
	hideContextMenu();
	ongoingAction = 'moveTreeItem';
}, false); 

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
			if (ToutesCategories[pathFocused].nbOfFolders <= 98) {
				queryXHRMoveItem(pathToPaste, pathFocused);							
			}
			else {
				alert("Pas possible de déplacer la catégorie ici.\n\nVous avez atteint la limite prévue des 99 sous-catégories !\n\nIl serait utile de mieux réorganiser les catégories.")
				resetColorTreeItem();
				pathFocused = null;
			}
		}
		else if (pathToPaste.substr(-3,1)==="b"){
			if (ToutesCategories[pathFocused].nbOfNotes <= 98) {
				queryXHRMoveItem(pathToPaste, pathFocused);							
			}
			else {
				alert("Pas possible de déplacer la catégorie ici.\n\nVous avez atteint la limite prévue des 99 notes !\n\nIl serait utile de mieux réorganiser les notes.")
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
		
document.getElementById("reinitialiserFormulaireEntrerNote").addEventListener('click', function reinitialiserFormulaireEntrerNote() {
	document.getElementById("formulaireEntrerNote").reset();
	document.getElementById("zoneFormulaireEntrerNote").focus();
}, false);

document.getElementById("annulerEntrerNote").addEventListener('click', function() {
	actionWithForm("");
}, false);

document.getElementById("enregistrerNouvelleNote").addEventListener('click', function() {
	actionWithForm(returnFormContent());
}, false);

function returnFormContent(){
	return document.getElementById("zoneFormulaireEntrerNote").value; 
}

function initializeFormEnterNote() {
	document.getElementById("fondPageEntrerTexte").style.display = 'block';
	document.getElementById("formulaireEntrerNote").reset();
	document.getElementById("zoneFormulaireEntrerNote").focus();	
 	/* document.getElementById("zoneFormulaireEntrerNote").addEventListener('keyup', function(e) { // � faire en snippet
		if (e.keycode == 13) {ecrireNoteDsBdd()};
		if (e.keycode == 27) {AnnulerEntrerNote()};
		// mettre ici le test pour savoir si le caract�re pipe est utilis�
	}, false);
  */
}

function actionWithForm(inputUserInForm) {
	if (ongoingAction === 'insertNewNote') {
		if (inputUserInForm !=="") {
			queryXhrInsertNewNote(inputUserInForm, pathFocused + "b" + XX(parseInt(ToutesCategories[pathFocused].nbOfNotes)+1));				
		}
	} 
	if (ongoingAction === 'insertNewFolder') {
		if (inputUserInForm !=="") {
			queryXhrInsertNewNote(inputUserInForm, pathFocused + "a" + XX(parseInt(ToutesCategories[pathFocused].nbOfFolders)+1));					
		}
	} 
	if (ongoingAction === 'editNote') {
		if (inputUserInForm !=="") {
			queryXhrEditTreeItem(inputUserInForm, pathFocused);
		}
	}
	
	document.getElementById("fondPageEntrerTexte").style.display = 'none';
	resetColorTreeItem();
	pathFocused = null;
	ongoingAction = null;
}

function resetColorTreeItem() {
	var sOriginalColorOfDivTreeItem;
	if (pathFocused === "01" || pathFocused.substr(-3,1)==="a") {
		sOriginalColorOfDivTreeItem = '#ffff00';
	}
	else {
		sOriginalColorOfDivTreeItem = '#ffffff';
	}
	document.getElementById(pathFocused).style.backgroundColor = sOriginalColorOfDivTreeItem;
}

function queryXhrInsertNewNote(sNewNote, sPathTreeItemToInsert) {
	//alert (typeof(sNewNote));
	sNewNote = sNewNote.replace(/\r\n|\r|\n/g,'<br>');
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/insertNewNote.php?idTopic=' + idTopic + '&newNote=' + sNewNote + '&sPathTreeItemToInsert=' + sPathTreeItemToInsert);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			sNewNote = sNewNote.replace(/"/g, '\\"'); // à fusionner avec l'autre replace 5 lignes plus haut ?
			var sInstanciationCategorieInseree = '["'+sPathTreeItemToInsert+'","'+sNewNote+'"]';
			var pathParent = sPathTreeItemToInsert.slice(0,-3);
			instancierArborescenceRecuperee ( sInstanciationCategorieInseree , pathParent )
			arborescenceNotes.seDeplacerDanslArborescenceReduite(pathParent);
			document.getElementById("fondPageEntrerTexte").style.display = 'none';
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans queryXhrInsertNewNote !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function queryXhrEditTreeItem(sNewNote, sIdCategoryToEdit) {
	sNewNoteToSendToDbb = sNewNote.replace(/\r\n|\r|\n/g,'<br>');
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/editNote.php?idTopic=' + idTopic + '&sIdCategoryToEdit=' + sIdCategoryToEdit + '&sNewNote=' + sNewNoteToSendToDbb);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {	
		//alert("Dans queryXhrEditTreeItem, sIdCategoryToEdit = "+sIdCategoryToEdit);
		ToutesCategories[sIdCategoryToEdit].sContent = sNewNote;
		document.getElementById(sIdCategoryToEdit).innerHTML = sNewNote;
		document.getElementById("fondPageEntrerTexte").style.display = 'none';
		//document.getElementById(sIdCategoryToEdit).style.backgroundColor = "#ffff00"; // �a sert � quoi, � d�griser ?? Mais pb �a semble �craser le comportement du hover
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans queryXhrEditTreeItem !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function queryXhrGetChildren(fCallback, sCategoriePere) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/getCategoryChild.php?idTopic=' + idTopic + '&sCategoriePere=' + sCategoriePere );
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallback(xhr.responseText, sCategoriePere);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans queryXhrGetChildren !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function queryXhrDeleteNote(sCategoryToDelete) {
	var sCategoryOfDad = sCategoryToDelete.slice(0,-3);// on d�termine la cat�gorie p�re
	
	var nRankDeleted = parseInt(sCategoryToDelete.substr(-2,2)); // on extrait le num�ro de la note
	
	eDOMNoteToDelete = document.getElementById(sCategoryToDelete);
	
	eDOMNoteToDelete.style.backgroundColor = '#cccccc'; // on grise la Note a effacer
	
	// ici on doit griser l'ensemble de l'arborescence 

	var xhr = new XMLHttpRequest();
	xhr.open ('GET', 'ajax/deleteNote.php?idTopic=' + idTopic + '&sCategoryToDelete=' + sCategoryToDelete);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("frameOfTree").removeChild(eDOMNoteToDelete); // on supprime  la note		
			
			ePathsNotes = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sCategoryOfDad+'b'+'"]'); // on soustrait 1 au rang des notes sup�rieures
			var nRankOfNote;	
			for (var i = 0; i < ePathsNotes.length ; i++ ) {
				nRankOfNote = parseInt(ePathsNotes[i].id.substr(-2,2));
				if (nRankOfNote > nRankDeleted) {
					ePathsNotes[i].id = sCategoryOfDad + 'b' + XX(nRankOfNote - 1);
				}
			}
		ToutesCategories[sCategoryOfDad].nbOfNotes -= 1 ;
		}
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
			alert('Une erreur est survenue dans queryXhrDeleteNote !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	} 
}

function queryXhrDeleteFolder(sCategoryToDelete) {
	var sCategoryOfDad = sCategoryToDelete.slice(0,-3);// on d�termine la cat�gorie p�re
	//alert("Etes vous s�r de vouloir effacer " + sCategoryToDelete +"?\n\navec CategoryOfDad = " + sCategoryOfDad);

	document.getElementById(sCategoryToDelete).style.backgroundColor = '#cccccc'; // on grise la categorie a effacer

	arborescenceNotes.seDeplacerDanslArborescenceReduite(sCategoryOfDad); // l'arborescente r�duite s'affiche avec categorie pere est openedFolder

	for (var k = 0 ; k < ToutesCategories[sCategoryOfDad].nbOfFolders ; k++ ) {	// on efface les folders enfants du p�re
		document.getElementById(sCategoryOfDad+'a'+XX(k+1)).style.display = 'none';		
	}
	for (var i = 0 ; i < ToutesCategories[sCategoryOfDad].nbOfNotes ; i++ ) {	// on efface les Notes enfants du p�re
		document.getElementById(sCategoryOfDad+'b'+XX(i+1)).style.display = 'none';		
	}	
	
	// ici on doit griser l'ensemble de l'arborescence 

	var xhr = new XMLHttpRequest();
	xhr.open ('GET', 'ajax/deleteFolder.php?idTopic=' + idTopic + '&sCategoryToDelete=' + sCategoryToDelete);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			ePathsToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sCategoryOfDad+'a'+'"]');
			for (var i=0 ; i < ePathsToDelete.length ; i++ ) {
				document.getElementById("frameOfTree").removeChild(ePathsToDelete[i]);
			}
			ToutesCategories[sCategoryOfDad].nbOfFolders =0;
			
			ePathsToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sCategoryOfDad+'b'+'"]'); 
			for (var j=0 ; j < ePathsToDelete.length ; j++ ) {
				document.getElementById("frameOfTree").removeChild(ePathsToDelete[j]);
			}			
			ToutesCategories[sCategoryOfDad].nbOfNotes =0;
			
			queryXhrGetChildren(instancierArborescenceRecuperee, sCategoryOfDad);
			// ici on doit d�griser l'ensemble de l'arborescence
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans queryXhrDeleteFolder !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function queryXHRMoveItem(sCutPath, sPathWhereToPaste) {
	var sNbItemType = sCutPath.substr(-3,1) === "a" ? "nbOfFolders" : "nbOfNotes"; 
	var rowOfPasteItem = XX(parseInt(ToutesCategories[sPathWhereToPaste][sNbItemType])+1); // ou trouver ce nombre et le XX du cote serveur avec une requete dbb?
	//alert (rowOfPasteItem);
	arborescenceNotes.seDeplacerDanslArborescenceReduite(pathFocused);
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/moveItem.php?idTopic=' + idTopic + '&sCutPath=' + sCutPath + '&sPathWhereToPaste=' + sPathWhereToPaste + '&sPathWhereToPaste=' + sPathWhereToPaste + '&rowOfPasteItem=' + rowOfPasteItem);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {	
		//alert("Dans queryXHRMoveFolder, sIdCategoryToEdit = "+sIdCategoryToEdit);
		
		// effacer toutes les div des treeItem dans le folder parent de CutPath (mais pas le folder parent lui-même)
		sPathParentOfCutPath = sCutPath.slice(0,-3);
		ePathsToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sPathParentOfCutPath+'a'+'"]');
		for (var i=0 ; i < ePathsToDelete.length ; i++ ) {
			document.getElementById("frameOfTree").removeChild(ePathsToDelete[i]);
		}
		ToutesCategories[sPathParentOfCutPath].nbOfFolders =0;
		
		ePathsToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sPathParentOfCutPath+'b'+'"]'); 
		for (var j=0 ; j < ePathsToDelete.length ; j++ ) {
			document.getElementById("frameOfTree").removeChild(ePathsToDelete[j]);
		}			
		ToutesCategories[sPathParentOfCutPath].nbOfNotes =0;
		
		// insérer le folder déplacé dans sPathWhereToPaste
		var sInstantiateFolderMoved = '["'+pathFocused+sCutPath.substr(-3,1)+rowOfPasteItem+'","'+ToutesCategories[sCutPath].sContent+'"]';
		instancierArborescenceRecuperee ( sInstantiateFolderMoved , pathFocused );
		document.getElementById("fondPageEntrerTexte").style.display = 'none';
		resetColorTreeItem();
		pathFocused = null;
		pathToPaste = null;
		ongoingAction = null;
		//ajouter l'affichage de ce qui a �t� coll�
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans queryXHRMoveItem !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function CategorieAbstraite(id, sContent, niveauDeCategorie, nbOfFolders, nbOfNotes) {
	this.id = id;
	this.sContent = sContent; 
	this.niveauDeCategorie = niveauDeCategorie;
	this.nbOfFolders = nbOfFolders;
	this.nbOfNotes = nbOfNotes;
}

// document.getElementById("NouvelleNote").addEventListener('click', insertNewNote, false); // insert depuis le menu html, att! pas encore impl�ment�

function displayTreeInNewWindow(sOriginPathTreeToDisplay) {
	window.open('displayTreeInNewWindow/displayTreeInNewWindow?idTopic='+idTopic+'&sOriginPathTreeToDisplay='+sOriginPathTreeToDisplay);
}

function resetDataTreeReadyForEvent() {
	resetColorTreeItem();
	pathFocused = null;
	document.getElementById("greyLayerOnFrameOfTree").style.display = "none";	
}


document.getElementById("importTreeHere").addEventListener('click', function() {
	hideContextMenu();
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'block';
	document.getElementById("frameOfFileLoader").style.display = 'block';
}, false);

document.getElementById("cancelLoadFile").addEventListener('click', function() {
	document.getElementById("greyLayerOnFrameOfTree").style.display = 'none';
	document.getElementById("frameOfFileLoader").style.display = 'none';
	resetColorTreeItem();
	pathFocused = null;
}, false);

document.getElementById("loadDataTreeJSON").addEventListener('change', function() {
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
				
				//if (aTreeItems[0].error == undefined) {
				//	alert (sErrorMessage + aTreeItems[0].error);		
				//} 
				
				//else { //le fichier peut donc être parsé 
					nbOfNotesInPathFocused = ToutesCategories[pathFocused].nbOfNotes;
					nbOfFoldersInPathFocused = ToutesCategories[pathFocused].nbOfFolders;
					ShouldBePathStart = "a01";
					for (var i=0; i < aTreeItems.length; i++) {
						for (path in aTreeItems[i]) {
							if (/^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(aTreeItems[i][path][1])) {// vérification du format de dateCreation
								if (aTreeItems[i][path].susbtr(0,3) === ShouldBePathStart) {
									aTreeItems[i][path]
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

document.getElementById("exportTreeFromHere").addEventListener('click', function () {
	hideContextMenu();
	exportTreeFromHere(pathFocused);
	alert("Le fichier à télécharger a été créé.");
	resetColorTreeItem();
	pathFocused = null;
}, false);
	
function exportTreeFromHere(sParentPathOfTreeToExport) {
	window.open('exports/downloadDataTreeJSON?idTopic='+idTopic+'&sParentPathOfTreeToExport='+sParentPathOfTreeToExport);	
}