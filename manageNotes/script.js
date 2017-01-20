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
	//alert (path);
	openContextMenu = document.getElementById("fondMenuCategorie");
	openContextMenu.style.display = 'block';
	switch (path) {
		case "01":
			aElementsToDisplay = openContextMenu.getElementsByClassName("root"); // plutot queryselectorall pour plusieurs classes
		break;
		//case ... 
		default :
			aElementsToDisplay = openContextMenu.getElementsByClassName("folder");
	}
	for (var i = 0 ; i < aElementsToDisplay.length ; i++ ) {
		aElementsToDisplay[i].style.display = 'block';
	}
}

function hideContextMenu() {
	openContextMenu = document.getElementById("fondMenuCategorie");
	openContextMenu.style.display = 'none';
	aElementsToHide = openContextMenu.children;
	for (var i = 0 ; i < aElementsToHide.length ; i++ ) {
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
				for (var i = 0 ; i < ToutesCategories[this.derniereCategorieDepliee].nbOfNotes; i++) { // d'abord replier les Notes filles de derniereCategorieDepliee
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
					
				var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a01'); // puis déplier le nouveau derniereCategorieDepliee
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
				for (var m = 0 ; m < ToutesCategories[this.derniereCategorieDepliee].nbOfNotes; m++) { // d'abord replier les Notes filles de derniereCategorieDepliee
					document.getElementById(this.derniereCategorieDepliee+'b'+XX(m+1)).style.display = 'none';					
				}				
				for (var i = 0 ; i < ToutesCategories[this.derniereCategorieDepliee].nbOfFolders; i++) { // Replier aussi les folders enfants de derniereCategorieDepliee // Vaut mieux le faire dans l'ordre décroissant puisqu'on déplie, non ?
					if (this.derniereCategorieDepliee+'a'+XX(i+1) !== idCategorieaDeplier) {
						document.getElementById(this.derniereCategorieDepliee+'a'+XX(i+1)).style.display = 'none';
					}				  
				}

				var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a01'); // puis déplier les filles de aDeplier
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
	
	this.reDisplayDerniereCategorieDepliee = function () { // affiche les enfants de derniereCategorieDepliee qui doivent avoir préalablement avoir été effacés
		var alreadyLoadedInDOM = document.getElementById(this.derniereCategorieDepliee+'a01'); 
		if (alreadyLoadedInDOM === null) {
			requeteXhrRecupererArborescence(instancierArborescenceRecuperee, this.derniereCategorieDepliee);
		}
		else {
			for (var j = 0 ; j < ToutesCategories[this.derniereCategorieDepliee].nbOfFolders; j++) { 
				document.getElementById(this.derniereCategorieDepliee+'a'+XX(j+1)).style.display = 'block';
			}
		}		
	}
}


function instancierArborescenceRecuperee ( sCategoriesRecuperees , sCategoriePere ) { // rajouter un booleen isVisible
	//alert ("sCategoriePere = " + sCategoriePere);
	//alert ("sCategoriesRecuperees =" + sCategoriesRecuperees);
	var CategorieParsee = sCategoriesRecuperees.split('|'); // interdiction d'utiliser ce caractère dans une note (on pourrait mettre une interdiction au moment d'enregistrer une note et au moment de l'importation) 
	var nbdItemsDansCategorieParsee = CategorieParsee.length; 
	
	var nbOfFoldersInPathParent = 0;
	var nbOfNotesInPathParent = 0;
	
	for (i = 0 ; i < nbdItemsDansCategorieParsee-3; i = i + 4) { // vérifier le -3
		var sIdCategorie = CategorieParsee[i];
		var sContent = CategorieParsee[i+1];
		var nNiveauDeCategorie = ((sIdCategorie.length+1)/3)-1; // ou ToutesCategories[sCategoriePere].niveauDeCategorie + 1 ? 
		var nNbDeComposants = CategorieParsee[i+3]; // a enlever
		ToutesCategories[sIdCategorie] = new CategorieAbstraite(sIdCategorie, sContent, nNiveauDeCategorie, 0,0);		
		var oCategorieAffichageDOM = document.createElement("div"); // plutôt un button en fait ??
		oCategorieAffichageDOM.id = sIdCategorie;

		if (sIdCategorie.substr(-3,1)==="a") {// si path contient un "a" à 3 rangs de la fin c'est un folder et pas une note
			nbOfFoldersInPathParent += 1;
			oCategorieAffichageDOM.className = "folder";
			oCategorieAffichageDOM.addEventListener('click', function(e) {
				arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id)
			}, false);					
		}
		else { // sinon c'est une note
			nbOfNotesInPathParent += 1;
			oCategorieAffichageDOM.className = "note";			
		}
		
		oCategorieAffichageDOM.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			pathFocused = e.target.id;
			displayContextMenu(pathFocused);
		}, false);
		
		oCategorieAffichageDOM.style.marginLeft = iRetraitAffichagedUneCategorie*(nNiveauDeCategorie) + 'px'; // mettre la marge en fonction du niveau de la catégorie
		oCategorieAffichageDOM.innerHTML = sContent; 
		// if (!isVisible) {oCategorieAffichageDOM.style.display = 'none';}
		document.getElementById("frameOfTree").appendChild(oCategorieAffichageDOM);
	}
	ToutesCategories[sCategoriePere].nbOfFolders += nbOfFoldersInPathParent ;	
	ToutesCategories[sCategoriePere].nbOfNotes += nbOfNotesInPathParent;		
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

document.getElementById("deleteNote").addEventListener('click', function() {
	hideContextMenu();
	queryXhrDeleteNote(pathFocused);
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
				if (bIsNote = true) {
					sPathTreeItemToInsert += "b" + XX(parseInt(ToutesCategories[idCategoriePere].nbOfNotes)+1); // ParseInt nécessaire ?? 
				}
				else {
					sPathTreeItemToInsert += "a" + XX(parseInt(ToutesCategories[idCategoriePere].nbOfFolders)+1);
				}
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
			instancierArborescenceRecuperee ( sInstanciationCategorieInseree , sPathTreeItemToInsert )
			arborescenceNotes.seDeplacerDanslArborescenceReduite(sPathTreeItemToInsert.slice(0,-3));
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

function queryXhrDeleteNote(sCategoryToDelete) {
	sCategoryOfDad = sCategoryToDelete.slice(0,-3);// on détermine la catégorie père
	//alert("Etes vous sûr de vouloir effacer " + sCategoryToDelete +"?\n\navec CategoryOfDad = " + sCategoryOfDad);

	document.getElementById(sCategoryToDelete).style.backgroundColor = '#cccccc'; // on grise la categorie a effacer

	arborescenceNotes.seDeplacerDanslArborescenceReduite(sCategoryOfDad); // l'arborescente réduite s'affiche avec categorie pere est derniereCategorieDepliee

	for (var k = 0 ; k < ToutesCategories[sCategoryOfDad].nNbDeComposants ; k++ ) {	// on efface les enfants du père
		document.getElementById(sCategoryOfDad+'a'+XX(k+1)).style.display = 'none';		
	}
	
	// ici on doit griser l'ensemble de l'arborescence 

	var xhr = new XMLHttpRequest();
	xhr.open ('GET', 'ajax/deleteNote.php?idTopic=' + idTopic + '&sCategoryToDelete=' + sCategoryToDelete +'&sCategoryOfDad=' + sCategoryOfDad);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			ePathsToDelete = document.getElementById("frameOfTree").querySelectorAll('div[id^="'+sCategoryOfDad+'a'+'"]');
			for (var i=0 ; i < ePathsToDelete.length ; i++ ) {
				document.getElementById("frameOfTree").removeChild(ePathsToDelete[i]);
			}
			ToutesCategories[sCategoryOfDad].nbOfFolders -=1;
			arborescenceNotes.reDisplayDerniereCategorieDepliee();
		// ici on doit dégriser l'ensemble de l'arborescence
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans requeteXhrRecupererArborescence !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
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