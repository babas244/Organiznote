var iRetraitAffichagedUneCategorie= 10;
ToutesCategories = {};
var pathFocused = null; 
var ongoingAction = null;
var pathToPaste = null;
var TreezIndex = -1;

document.getElementById("displayAndHideTree").addEventListener('click', function () {
	TreezIndex = TreezIndex === -1 ? 1 : -1; 
	document.getElementById("containerOfTree").style.zIndex = TreezIndex;
}, false);

document.getElementById("greyLayerOnFrameOfTree").style.display = "block";
fInstantiateRoot();

function fInstantiateRoot() {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/InstantiateRoot.php?idTopic=' + idTopic);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			//alert (xhr.responseText);
			var response = JSON.parse(xhr.responseText);
			document.getElementById("01").innerHTML = response.topic;
			ToutesCategories["01"] = new CategorieAbstraite("01", null, 0, 0, 0);
			//alert (response.nNbDeComposants);
			arborescenceNotes = new ArborescenceReduiteAffichee("01");					
			queryXhrGetChildren(instancierArborescenceRecuperee, "01");
			document.getElementById("01").style.border = '2px black solid';
			
			document.getElementById("01").addEventListener('click', function(e) {
				arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id);
			}, false);					
			
			document.getElementById("01").addEventListener('contextmenu', function(e) {
				e.preventDefault();
				pathFocused = e.target.id;				
				displayContextMenu("01");
			}, false);
		document.getElementById("greyLayerOnFrameOfTree").style.display = "none";
		}
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
			alert('L\'initialisation de la page n\'a pas eu lieu correctement. Veuillez recharger la page. \n\nCode d\'erreur:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}	


function displayContextMenu(path) {
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
	
function ArborescenceReduiteAffichee(derniereCategorieDepliee) {
	this.derniereCategorieDepliee = derniereCategorieDepliee;

	this.afficherArborescenceReduite = function () { // marche ou pas ? 
		var tableauArborescenceDecoupee = this.derniereCategorieDepliee.split('a');
		var c = tableauArborescenceDecoupee.length;
		var categorieAafficher = ""; 
		for (var i = 0; i < c ; i++) { 
			categorieAafficher += tableauArborescenceDecoupee[i]; //verifier si en fin de boucle existence ok
			alert(categorieAafficher);			
			document.getElementById(categorieAafficher).style.display = 'block';
			categorieAafficher += 'a';
		}
		if (ToutesCategories[this.derniereCategorieDepliee].nbOfFolders = null) {
			ToutesCategories[this.derniereCategorieDepliee].chargerContenuCategorie();
		} else {
			for (var j = 0 ; j < ToutesCategories[this.derniereCategorieDepliee].nbOfFolders; j++) {
				document.getElementById(categorieAafficher+(j+1)).style.display = 'block';
			}
		}
	}	
	
	this.seDeplacerDanslArborescenceReduite = function (idCategorieaDeplier) {
		//alert ("dans seDeplacerDanslArborescenceReduite ! \n\n idCategorieaDeplier = "+idCategorieaDeplier+" et this.derniereCategorieDepliee = "+this.derniereCategorieDepliee);
		if (idCategorieaDeplier !== this.derniereCategorieDepliee) { // on enlève le cas ou rien de nouveau n'est demandé

			if (idCategorieaDeplier.length < this.derniereCategorieDepliee.length) { // si aDeplier est une categorie ancetre de derniereCategorieDepliee

				document.getElementById(this.derniereCategorieDepliee).style.border = '1px black solid';

				for (var i = 0 ; i < ToutesCategories[this.derniereCategorieDepliee].nbOfNotes; i++) { // d'abord replier les Notes filles de derniereCategorieDepliee
					//alert(this.derniereCategorieDepliee+'b'+XX(i+1));
					document.getElementById(this.derniereCategorieDepliee+'b'+XX(i+1)).style.display = 'none';					
				}
				
				for (var k = 0 ; k < ToutesCategories[this.derniereCategorieDepliee].nbOfFolders; k++) { // Replier aussi les folders enfants de derniereCategorieDepliee
					//console.log(this.derniereCategorieDepliee+'a'+XX(k+1));
					document.getElementById(this.derniereCategorieDepliee+'a'+XX(k+1)).style.display = 'none';
				}
				var categorieAeffacer = this.derniereCategorieDepliee;
					
				while (categorieAeffacer !== idCategorieaDeplier) { // puis effacer les intermédaires
					document.getElementById(categorieAeffacer).style.display = 'none';
						categorieAeffacer = categorieAeffacer.slice(0,-3);
				}
				
				document.getElementById(idCategorieaDeplier).style.border = '2px black solid';
					
				var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a01') || document.getElementById(idCategorieaDeplier+'b01'); // puis déplier le nouveau derniereCategorieDepliee
				//console.log("idCategorieaDeplier+'a'+1 = "+idCategorieaDeplier+'a01'+"\n\et alreadyLoadedInDOM = "+alreadyLoadedInDOM);
				if (alreadyLoadedInDOM === null) { // s'ils ne sont pas dans le DOM, i faut aller les chercher en ajax
					queryXhrGetChildren(instancierArborescenceRecuperee, idCategorieaDeplier);;
				}
				else { // sinon on a juste à les afficher
					for (var j = 0 ; j < ToutesCategories[idCategorieaDeplier].nbOfFolders; j++) { // afficher les folders
						//console.log("!! idCategorieaDeplier+'a'+(j+1) = "+idCategorieaDeplier+'a'+XX(j+1));
						document.getElementById(idCategorieaDeplier+'a'+XX(j+1)).style.display = 'block';
					}
				
					for (var m = 0 ; m < ToutesCategories[idCategorieaDeplier].nbOfNotes; m++) { // afficher les notes
						document.getElementById(idCategorieaDeplier+'b'+XX(m+1)).style.display = 'block';
					}
				}			
			}						
			else { // on vient donc de cliquer sur une catégorie descendante de derniereCategorieDepliee
				document.getElementById(this.derniereCategorieDepliee).style.border = '1px black solid';

				for (var m = 0 ; m < ToutesCategories[this.derniereCategorieDepliee].nbOfNotes; m++) { // d'abord replier les Notes filles de derniereCategorieDepliee
					//alert (this.derniereCategorieDepliee+'b'+XX(m+1));
					document.getElementById(this.derniereCategorieDepliee+'b'+XX(m+1)).style.display = 'none';					
				}				
				for (var i = 0 ; i < ToutesCategories[this.derniereCategorieDepliee].nbOfFolders; i++) { // Replier aussi les folders enfants de derniereCategorieDepliee // Vaut mieux le faire dans l'ordre décroissant puisqu'on déplie, non ?
					if (this.derniereCategorieDepliee+'a'+XX(i+1) !== idCategorieaDeplier) {
						document.getElementById(this.derniereCategorieDepliee+'a'+XX(i+1)).style.display = 'none';
					}				  
				}

				document.getElementById(idCategorieaDeplier).style.border = '2px black solid';

				var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a01') || document.getElementById(idCategorieaDeplier+'b01'); // puis déplier les filles de aDeplier
				if (alreadyLoadedInDOM === null) {
					queryXhrGetChildren(instancierArborescenceRecuperee, idCategorieaDeplier);;
				}
				else {
					for (var j = 0 ; j < ToutesCategories[idCategorieaDeplier].nbOfFolders; j++) {  // afficher les folders 
						document.getElementById(idCategorieaDeplier+'a'+XX(j+1)).style.display = 'block';
					}
					for (var k = 0 ; k < ToutesCategories[idCategorieaDeplier].nbOfNotes; k++) { // afficher les notes
						document.getElementById(idCategorieaDeplier+'b'+XX(k+1)).style.display = 'block';
					}
					
				}
			}
		arborescenceNotes.derniereCategorieDepliee = idCategorieaDeplier;  
		//alert("en fin de function, arborescenceNotes.derniereCategorieDepliee = " + arborescenceNotes.derniereCategorieDepliee);
		}	
	}		
}


function instancierArborescenceRecuperee ( sCategoriesRecuperees , sCategoriePere ) { // rajouter un booleen isVisible
	//alert ("sCategoriePere = " + sCategoriePere);
	//alert ("sCategoriesRecuperees =" + sCategoriesRecuperees);
	var aCategorieParsee = sCategoriesRecuperees == "" ? "" : JSON.parse(sCategoriesRecuperees); 
	var nbdItemsDansCategorieParsee = aCategorieParsee.length; 
	
	var nbOfFoldersAddedInPathParent = 0;
	var nbOfNotesAddedInPathParent = 0;
	
	for (i = 0 ; i < nbdItemsDansCategorieParsee-1; i = i + 2) {
		var sIdCategorie = aCategorieParsee[i];
		var sContent = aCategorieParsee[i+1].replace(/&lt;br&gt;/gi, "\n");
		var nNiveauDeCategorie = ((sIdCategorie.length+1)/3)-1; // ou ToutesCategories[sCategoriePere].niveauDeCategorie + 1 ? 
		ToutesCategories[sIdCategorie] = new CategorieAbstraite(sIdCategorie, sContent, nNiveauDeCategorie, 0,0);		
		var oCategorieAffichageDOM = document.createElement("div"); // plutôt un button en fait ??
		oCategorieAffichageDOM.id = sIdCategorie;

		oCategorieAffichageDOM.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			pathFocused = e.target.id;
			displayContextMenu(pathFocused);
		}, false);
		
		oCategorieAffichageDOM.style.marginLeft = iRetraitAffichagedUneCategorie*(nNiveauDeCategorie) + 'px'; // mettre la marge en fonction du niveau de la catégorie
		oCategorieAffichageDOM.innerHTML = sContent; 

		if (sIdCategorie.substr(-3,1)==="a") {// si path contient un "a" à 3 rangs de la fin c'est un folder et pas une note
			nbOfFoldersAddedInPathParent += 1;
			oCategorieAffichageDOM.className = "folder";
			oCategorieAffichageDOM.addEventListener('click', function(e) {
				arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id)
			}, false);
			var noteAlreadyLoadedInDOM = document.getElementById(sCategoriePere+'b01');
			if (noteAlreadyLoadedInDOM === null) {// si il n'y pas une seule note
				document.getElementById("frameOfTree").appendChild(oCategorieAffichageDOM);
			} else { // si il y a au déjà moins une note
				document.getElementById("frameOfTree").insertBefore(oCategorieAffichageDOM , noteAlreadyLoadedInDOM );				
			}
		}	
		else { // sinon c'est une note
			nbOfNotesAddedInPathParent += 1;
			oCategorieAffichageDOM.className = "note";			
			document.getElementById("frameOfTree").appendChild(oCategorieAffichageDOM);
		}
		
		// if (!isVisible) {oCategorieAffichageDOM.style.display = 'none';}
	}
	//alert(nbOfNotesAddedInPathParent);
	//alert("sCategoriePere ="+sCategoriePere);
	//alert("av.ToutesCategories[sCategoriePere].nbOfNotes =" + ToutesCategories[sCategoriePere].nbOfNotes);
	//alert("avant ToutesCategories[sCategoriePere].nbOfFolders = "+ ToutesCategories[sCategoriePere].nbOfFolders) ;	
	ToutesCategories[sCategoriePere].nbOfFolders += nbOfFoldersAddedInPathParent ;	
	ToutesCategories[sCategoriePere].nbOfNotes += nbOfNotesAddedInPathParent;		
	//alert("après ToutesCategories[sCategoriePere].nbOfFolders = "+ ToutesCategories[sCategoriePere].nbOfFolders) ;	
	
	//alert("AP.ToutesCategories[sCategoriePere].nbOfNotes =" + ToutesCategories[sCategoriePere].nbOfNotes);
	//alert(typeof(ToutesCategories[sCategoriePere].nbOfNotes) +" et " + typeof(nbOfNotesAddedInPathParent));	
}

document.getElementById("insertNewNote").addEventListener('click', function() {
	hideContextMenu();
	if ((ToutesCategories[pathFocused].nbOfNotes) <= 98) {
		ongoingAction = 'insertNewNote';
		initializeFormEnterNote();		
	}
	else {
		alert("Pas possible d'insÃ©rer une nouvelle note dans cette catÃ©gorie.\n\nVous avez atteint la limite prÃ©vue des 99 notes !\n\nIl serait utile de mieux rÃ©organiser les catÃ©gories.")
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
		alert("Pas possible d'insÃ©rer une nouvelle catÃ©gorie.\n\nVous avez atteint la limite prÃ©vue des 99 sous-catÃ©gories !\n\nIl serait utile de mieux rÃ©organiser les catÃ©gories.")
		resetColorTreeItem();
		pathFocused = null;
	}
}, false);

document.getElementById("deleteFolder").addEventListener('click', function() {
	hideContextMenu();
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir effacer cette catÃ©gorie ?") == true) {
		queryXhrDeleteFolder(pathFocused);		
	}
	else {
		resetColorTreeItem();
		pathFocused = null;
	}
}, false);

document.getElementById("deleteNote").addEventListener('click', function() {
	hideContextMenu();
	if (confirm("ÃŠtes-vous sÃ»r de bien vouloir effacer cette note ?") == true) {
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
	alert("Fait !\n\nL'arbre a Ã©tÃ© exportÃ© dans un autre onglet ou une fenÃªtre (cela dÃ©pend de votre navigateur).");
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
		alert("Vous essayez de coller votre item Ã  l'endroit oÃ¹ il se trouve dÃ©jÃ . Recommencez Ã  un autre endroit.");
		resetColorTreeItem();
	} 
	else if (pathFocused.indexOf(pathToPaste) == 0){
		alert("Vous essayez de coller votre item dans un de ses descendants, Ã§a n'est pas possible !");
		resetColorTreeItem();
	}
	else {
		if (pathToPaste.substr(-3,1)==="a") {
			if (ToutesCategories[pathFocused].nbOfFolders <= 98) {
				queryXHRMoveItem(pathToPaste, pathFocused);							
			}
			else {
				alert("Pas possible de dÃ©placer la catÃ©gorie ici.\n\nVous avez atteint la limite prÃ©vue des 99 sous-catÃ©gories !\n\nIl serait utile de mieux rÃ©organiser les catÃ©gories.")
				resetColorTreeItem();
				pathFocused = null;
			}
		}
		else if (pathToPaste.substr(-3,1)==="b"){
			if (ToutesCategories[pathFocused].nbOfNotes <= 98) {
				queryXHRMoveItem(pathToPaste, pathFocused);							
			}
			else {
				alert("Pas possible de dÃ©placer la catÃ©gorie ici.\n\nVous avez atteint la limite prÃ©vue des 99 notes !\n\nIl serait utile de mieux rÃ©organiser les notes.")
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
 	/* document.getElementById("zoneFormulaireEntrerNote").addEventListener('keyup', function(e) { // à faire en snippet
		if (e.keycode == 13) {ecrireNoteDsBdd()};
		if (e.keycode == 27) {AnnulerEntrerNote()};
		// mettre ici le test pour savoir si le caractère pipe est utilisé
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
			sNewNote = sNewNote.replace(/"/g, '\\"'); // Ã  fusionner avec l'autre replace 5 lignes plus haut ?
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
		//document.getElementById(sIdCategoryToEdit).style.backgroundColor = "#ffff00"; // ça sert à quoi, à dégriser ?? Mais pb ça semble écraser le comportement du hover
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
	var sCategoryOfDad = sCategoryToDelete.slice(0,-3);// on détermine la catégorie père
	
	var nRankDeleted = parseInt(sCategoryToDelete.substr(-2,2)); // on extrait le numéro de la note
	
	eDOMNoteToDelete = document.getElementById(sCategoryToDelete);
	
	eDOMNoteToDelete.style.backgroundColor = '#cccccc'; // on grise la Note a effacer
	
	// ici on doit griser l'ensemble de l'arborescence 

	var xhr = new XMLHttpRequest();
	xhr.open ('GET', 'ajax/deleteNote.php?idTopic=' + idTopic + '&sCategoryToDelete=' + sCategoryToDelete);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("frameOfTree").removeChild(eDOMNoteToDelete); // on supprime  la note		
			
			ePathsNotes = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sCategoryOfDad+'b'+'"]'); // on soustrait 1 au rang des notes supérieures
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
	var sCategoryOfDad = sCategoryToDelete.slice(0,-3);// on détermine la catégorie père
	//alert("Etes vous sûr de vouloir effacer " + sCategoryToDelete +"?\n\navec CategoryOfDad = " + sCategoryOfDad);

	document.getElementById(sCategoryToDelete).style.backgroundColor = '#cccccc'; // on grise la categorie a effacer

	arborescenceNotes.seDeplacerDanslArborescenceReduite(sCategoryOfDad); // l'arborescente réduite s'affiche avec categorie pere est derniereCategorieDepliee

	for (var k = 0 ; k < ToutesCategories[sCategoryOfDad].nbOfFolders ; k++ ) {	// on efface les folders enfants du père
		document.getElementById(sCategoryOfDad+'a'+XX(k+1)).style.display = 'none';		
	}
	for (var i = 0 ; i < ToutesCategories[sCategoryOfDad].nbOfNotes ; i++ ) {	// on efface les Notes enfants du père
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
			// ici on doit dégriser l'ensemble de l'arborescence
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
		
		// effacer toutes les div des treeItem dans le folder parent de CutPath (mais pas le folder parent lui-mÃªme)
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
		
		// insÃ©rer le folder dÃ©placÃ© dans sPathWhereToPaste
		var sInstantiateFolderMoved = '["'+pathFocused+sCutPath.substr(-3,1)+rowOfPasteItem+'","'+ToutesCategories[sCutPath].sContent+'"]';
		instancierArborescenceRecuperee ( sInstantiateFolderMoved , pathFocused );
		document.getElementById("fondPageEntrerTexte").style.display = 'none';
		resetColorTreeItem();
		pathFocused = null;
		pathToPaste = null;
		ongoingAction = null;
		//ajouter l'affichage de ce qui a été collé
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

// document.getElementById("NouvelleNote").addEventListener('click', insertNewNote, false); // insert depuis le menu html, att! pas encore implémenté

document.getElementById("displayAllTree").addEventListener('click', function () {
	displayTreeInNewWindow("01");
}, false);

function displayTreeInNewWindow(sOriginPathTreeToDisplay) {
	window.open('displayTreeInNewWindow/displayTreeInNewWindow?idTopic='+idTopic+'&sOriginPathTreeToDisplay='+sOriginPathTreeToDisplay);
}


document.getElementById("importerXML").addEventListener('click', function importerXML() {
	document.getElementById("fondPageEntrerTexte").style.display = 'block';
	document.getElementById("chargerfichierXML").style.display= 'block';
	document.querySelector('#chargerfichierXML').onchange = function() {
		var reader = new FileReader();
		reader.onload = function() {
			alert('Le contenu du fichier "' + document.querySelector('#chargerfichierXML').files[0].name + '" est :\n\n' + reader.result);
		};
	reader.readAsText(document.querySelector('#chargerfichierXML').files[0]);
	// ajouter un bouton de submit ?? du type : <input type="button" name="ajoutFichier" value="Ajouter" alt="Ajouter fichier" onclick="javascript:document.f_message.action.value='ajouterPj';document.f_message.submit();return false;">
	document.getElementById("fondPageEntrerTexte").style.display = 'none';
	document.getElementById("chargerfichierXML").style.display= 'none';
	};
}, false);


function XX(integer) {
	return integer>9 ? ""+integer : "0"+integer;
}