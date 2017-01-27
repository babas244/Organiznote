var iRetraitAffichagedUneCategorie= 10;
ToutesCategories = {};
var pathFocused = null; 

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
			requeteXhrRecupererArborescence(instancierArborescenceRecuperee, "01");
			document.getElementById("01").style.border = '2px black solid';
			
			document.getElementById("01").addEventListener('click', function(e) {
				arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id);
			}, false);					
			
			document.getElementById("01").addEventListener('contextmenu', function(e) {
				e.preventDefault();
				pathFocused = e.target.id;				
				displayContextMenu("01");
			}, false);
		} 	
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
			alert('Une erreur est survenue dans requeteXhrRecupererArborescence !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
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
	if (path === "01") {
		aElementsToDisplay = openContextMenu.getElementsByClassName("isRoot");
	}
	else if (path.substr(-3,1)==="b") {
		aElementsToDisplay = openContextMenu.getElementsByClassName("isNote");			
	}
	else {
		aElementsToDisplay = openContextMenu.getElementsByClassName("isFolder");		
	}
	for (var i = 0 ; i < aElementsToDisplay.length ; i++ ) { // plutot queryselectorall si plusieurs classes ?
		aElementsToDisplay[i].style.display = 'block';
	}
}

function hideContextMenu() {
	openContextMenu = document.getElementById("fondMenuCategorie");
	openContextMenu.style.display = 'none';
	aElementsToHide = openContextMenu.children;
	for (var i = 0 ; i < aElementsToHide.length ; i++ ) { // plutot mettre chaque groupes d'item d'un menu selon sa classe cmme enfants dans une div?
		//alert (aElementsToHide[i]);
		aElementsToHide[i].style.display = 'none';
	}
	var sOriginalColorOfDivTreeItem;
	if (pathFocused === "01" || pathFocused.substr(-3,1)==="a") {
		sOriginalColorOfDivTreeItem = '#ffff00';
	}
	else {
		sOriginalColorOfDivTreeItem = '#ffffff';		
	}
	document.getElementById(pathFocused).style.backgroundColor = sOriginalColorOfDivTreeItem;
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
					requeteXhrRecupererArborescence(instancierArborescenceRecuperee, idCategorieaDeplier);;
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
					requeteXhrRecupererArborescence(instancierArborescenceRecuperee, idCategorieaDeplier);;
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
	var CategorieParsee = sCategoriesRecuperees.split('|'); // interdiction d'utiliser ce caractère dans une note (on pourrait mettre une interdiction au moment d'enregistrer une note et au moment de l'importation) 
	var nbdItemsDansCategorieParsee = CategorieParsee.length; 
	
	var nbOfFoldersAddedInPathParent = 0;
	var nbOfNotesAddedInPathParent = 0;
	
	for (i = 0 ; i < nbdItemsDansCategorieParsee-3; i = i + 4) { // vérifier le -3
		var sIdCategorie = CategorieParsee[i];
		var sContent = CategorieParsee[i+1];
		var nNiveauDeCategorie = ((sIdCategorie.length+1)/3)-1; // ou ToutesCategories[sCategoriePere].niveauDeCategorie + 1 ? 
		var nNbDeComposants = CategorieParsee[i+3]; // a enlever
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

document.getElementById("insertNewFolder").addEventListener('click', function() {
	hideContextMenu();
	insertNewNote(false,pathFocused);
	// ajouter que pathFocused = null à nouveau ??
}, false);

document.getElementById("insertNewNote").addEventListener('click', function() {
	hideContextMenu();
	insertNewNote(true,pathFocused);
	// ajouter que pathFocused = null à nouveau ??
}, false);

document.getElementById("deleteFolder").addEventListener('click', function() {
	hideContextMenu();
	queryXhrDeleteFolder(pathFocused);
}, false);

document.getElementById("editNote").addEventListener('click', function() {
	hideContextMenu();
	editNote(pathFocused);
}, false);

document.getElementById("cancel").addEventListener('click', function () {
	hideContextMenu();
	pathFocused = null;
}, false);
		
document.getElementById("reinitialiserFormulaireEntrerNote").addEventListener('click', function reinitialiserFormulaireEntrerNote() {
	document.getElementById("formulaireEntrerNote").reset();
	document.getElementById("zoneFormulaireEntrerNote").focus();
}, false);

document.getElementById("annulerEntrerNote").addEventListener('click', AnnulerEntrerNote, false);
function AnnulerEntrerNote() {
	document.getElementById("fondPageEntrerTexte").style.display = 'none';
	document.getElementById("formulaireEntrerNote").reset();
	// faut-il ici remove handler ? : document.getElementById("enregistrerNouvelleNote").removeEventListener('click', ecrireNoteDsBdd, false); 
	// a priori oui car dès que le form est ouvert, le handler est lancé
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
			
function insertNewNote(bIsNote, idCategoriePere) {
	//alert("Dans InsertNote, idCategoriePere = "+idCategoriePere);
	initializeFormEnterNote();
	document.getElementById("enregistrerNouvelleNote").addEventListener('click', ecrireNoteDsBdd, false);
	function ecrireNoteDsBdd() { // à mettre en dehors de la function insertNewNote : hmmm..elle a besoin de idCategoriePere.. Et en fait on la réutilose pas, il vaudrait mieux une anonyme : non on n'a besoin qu'elle ait un nom pour enlever le listener plus tard. oui mais c'est pas une raison, on peut l'enlever indépendemment ! 
		// griser la catégorie mère??
		sNewNote = document.getElementById("zoneFormulaireEntrerNote").value;
		//alert(document.getElementById("zoneFormulaireEntrerNote").value);
		if (sNewNote !== "") {
			document.getElementById("enregistrerNouvelleNote").removeEventListener('click', ecrireNoteDsBdd, false);
			
			if (idCategoriePere) {
				var sPathTreeItemToInsert = idCategoriePere;
				if (bIsNote === true) {
					sPathTreeItemToInsert += "b" + XX(parseInt(ToutesCategories[idCategoriePere].nbOfNotes)+1); // ParseInt nécessaire ?? 
				}
				else {
					sPathTreeItemToInsert += "a" + XX(parseInt(ToutesCategories[idCategoriePere].nbOfFolders)+1);
				}
				//alert(sPathTreeItemToInsert);
				requeteXhrInsertNewNote(sNewNote, sPathTreeItemToInsert);
				//alert('coucou dans ecrireNoteDsBdd');
			}
			else { // marche pas.. // if (typeof v !== 'undefined' && v !== null) 
				alert("note pas encore placée");
			}
			document.getElementById("fondPageEntrerTexte").style.display = 'none';
			//dégriser la catégorie mère		
		}
		else {
			alert("La note est vide, recommencez.") // pourquoi ça met à jour le contenu de la div avec une chaine vide quand même ??
		}
	}
}

function editNote(sIdCategoryToEdit) {
	//alert("Dans editNote, sIdCategoryToEdit = "+sIdCategoryToEdit);
	initializeFormEnterNote();
	document.getElementById("zoneFormulaireEntrerNote").value = ToutesCategories[sIdCategoryToEdit].sContent;
	document.getElementById("enregistrerNouvelleNote").addEventListener('click', editNoteInDbb, false);
	
	
	function editNoteInDbb() {
		sNewNote = document.getElementById("zoneFormulaireEntrerNote").value;
		if (sNewNote !== "") {
			document.getElementById("enregistrerNouvelleNote").removeEventListener('click', editNoteInDbb, false);
			document.getElementById("fondPageEntrerTexte").style.display = 'none'; // à inclure dans queryEditNote ??
			queryXhrEditNote(sNewNote, sIdCategoryToEdit);
			//dégriser la catégorie mère		
		}
		else {
			alert("La note est vide, recommencez.")
		}
	}
}

function requeteXhrInsertNewNote(sNewNote, sPathTreeItemToInsert) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/insertNewNote.php?idTopic=' + idTopic + '&newNote=' + sNewNote + '&sPathTreeItemToInsert=' + sPathTreeItemToInsert);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var sInstanciationCategorieInseree = sPathTreeItemToInsert+"|"+sNewNote+"|"+((sPathTreeItemToInsert.length+1)/3-1)+"|0|0";
			var pathParent = sPathTreeItemToInsert.slice(0,-3);
			instancierArborescenceRecuperee ( sInstanciationCategorieInseree , pathParent )
			arborescenceNotes.seDeplacerDanslArborescenceReduite(pathParent);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans requeteXhrRecupererArborescence !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function queryXhrEditNote(sNewNote, sIdCategoryToEdit) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/editNote.php?idTopic=' + idTopic + '&sIdCategoryToEdit=' + sIdCategoryToEdit + '&sNewNote=' + sNewNote);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {	
		//alert("Dans queryXhrEditNote, sIdCategoryToEdit = "+sIdCategoryToEdit);
		ToutesCategories[sIdCategoryToEdit].sContent = sNewNote;
		document.getElementById(sIdCategoryToEdit).innerHTML = sNewNote;
		//document.getElementById(sIdCategoryToEdit).style.backgroundColor = "#ffff00"; // ça sert à quoi, à dégriser ?? Mais pb ça semble écraser le comportement du hover
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans requeteXhrRecupererArborescence !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function requeteXhrRecupererArborescence(fCallback, sCategoriePere) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/getCategoryChild.php?idTopic=' + idTopic + '&sCategoriePere=' + sCategoriePere );
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallback(xhr.responseText, sCategoriePere);
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans requeteXhrRecupererArborescence !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function queryXhrDeleteFolder(sCategoryToDelete) {
	sCategoryOfDad = sCategoryToDelete.slice(0,-3);// on détermine la catégorie père
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
			
			requeteXhrRecupererArborescence(instancierArborescenceRecuperee, sCategoryOfDad);
			// ici on doit dégriser l'ensemble de l'arborescence
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans queryXhrDeleteFolder !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
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
	window.open('displayTreeInNewWindow/displayTreeInNewWindow?idTopic='+idTopic+'&sOriginPathTreeToDisplay='+sOriginPathTreeToDisplay+'.php');
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