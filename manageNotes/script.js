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
			document.getElementById("racine").innerHTML = response.topic;
			ToutesCategories["racine"] = new CategorieAbstraite("racine", null, 0, parseInt(response.nNbDeComposants));
			//alert (response.nNbDeComposants);
			arborescenceNotes = new ArborescenceReduiteAffichee("racine");					
			requeteXhrRecupererArborescence(instancierArborescenceRecuperee, "racine");

			document.getElementById("racine").addEventListener('click', function(e) {
				arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id);
			}, false);					
			
			document.getElementById("racine").addEventListener('contextmenu', function(e) {
				e.preventDefault();
				pathFocused = e.target.id;				
				displayContextMenu("racine");
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
		case "racine":
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
		if (ToutesCategories[this.derniereCategorieDepliee].nbDeComposants = null) {
			ToutesCategories[this.derniereCategorieDepliee].chargerContenuCategorie();
		} else {
			for (var j = 0 ; j < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; j++) {
				document.getElementById(categorieAafficher+(j+1)).style.display = 'block';
			}
		}
	}	
	
	this.seDeplacerDanslArborescenceReduite = function (idCategorieaDeplier) {
		//alert ("dans seDeplacerDanslArborescenceReduite ! \n\n idCategorieaDeplier = "+idCategorieaDeplier+" et this.derniereCategorieDepliee = "+this.derniereCategorieDepliee);
		if (idCategorieaDeplier !== this.derniereCategorieDepliee) { // on enlève le cas ou rien de nouveau n'est demandé
			
			if (idCategorieaDeplier === "racine") { // si on déplie racine :
				for (var k = 0 ; k < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; k++) { // d'abord replier les filles de derniereCategorieDepliee
					//alert("this.derniereCategorieDepliee+'a'+(k+1) = "+(this.derniereCategorieDepliee+'a'+(k+1)));
					document.getElementById(this.derniereCategorieDepliee+'a'+(k+1)).style.display = 'none';
				}
				var categorieAeffacer = this.derniereCategorieDepliee;
				
				while (categorieAeffacer.includes("a")) {
					document.getElementById(categorieAeffacer).style.display = 'none';
					categorieAeffacer = categorieAeffacer.replace(/a[1-9]+$/, ""); // et la cas 10 ?? hihi
				}				
				for (var j = 0 ; j < ToutesCategories.racine.nbDeComposants; j++) { 
					//alert("j + 1 = "+(j+1));
					//alert(typeof(toString(j+1)));
					//alert("toString(j+1) = "+toString((j+1)));
					if ((j+1) !== parseInt(categorieAeffacer)) {
						document.getElementById(j+1).style.display = 'block';
					}
				}
			}

			else { // sinon, si derniere=racine :
				if (this.derniereCategorieDepliee === "racine") { // on ne peut donc avoir cliqué que sur 1,2,3,...
					for (var p = 0 ; p < ToutesCategories.racine.nbDeComposants; p++) { // on efface les 1,2,3.., sauf celle à déplier
						if ((p+1) !== parseInt(idCategorieaDeplier)) {
							document.getElementById(p+1).style.display = 'none';
						}
					}
					// A partir de là, on déplie les catégories filles de idCategorieaDeplier
					//console.log(ToutesCategories[idCategorieaDeplier]);
					var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a'+1);
					//console.log("On ne déplie pas racine et le dernier déplié n'est pas racine \n et ToutesCategories[idCategorieaDeplier])+'a'+1 ="
					//+((ToutesCategories[idCategorieaDeplier].id)+'a'+1) + "\net alreadyLoadedInDOM = "+alreadyLoadedInDOM);
					console.log("idCategorieaDeplier+'a'+1 = "+idCategorieaDeplier+'a'+1+"\n\et alreadyLoadedInDOM = "+alreadyLoadedInDOM);					
					if (alreadyLoadedInDOM === null) {
						requeteXhrRecupererArborescence(instancierArborescenceRecuperee, idCategorieaDeplier);;
					}
					else {
						for (var j = 0 ; j < ToutesCategories[idCategorieaDeplier].nbDeComposants; j++) { 
							//console.log(idCategorieaDeplier+'a'+(j+1));
							document.getElementById(idCategorieaDeplier+'a'+(j+1)).style.display = 'block';
						}
					}
				}
				else {	
					if (idCategorieaDeplier.length < this.derniereCategorieDepliee.length) { // dernier!=racine et on a cliqué sur une categorie antécédente de derniereCategorieDepliee

						for (var k = 0 ; k < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; k++) { // d'abord replier les filles de derniereCategorieDepliee
							console.log(this.derniereCategorieDepliee+'a'+(k+1));
							document.getElementById(this.derniereCategorieDepliee+'a'+(k+1)).style.display = 'none';
						}
						//alert(typeof(this.derniereCategorieDepliee));
						var categorieAeffacer = this.derniereCategorieDepliee;
						
						while (categorieAeffacer !== idCategorieaDeplier) {
							document.getElementById(categorieAeffacer).style.display = 'none';
							categorieAeffacer = categorieAeffacer.replace(/a[1-9]+$/, "");
						}
						// puis déplier le nouveau derniereCategorieDepliee :	
						var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a'+1);
						console.log("idCategorieaDeplier+'a'+1 = "+idCategorieaDeplier+'a'+1+"\n\et alreadyLoadedInDOM = "+alreadyLoadedInDOM);
						if (alreadyLoadedInDOM === null) {
							requeteXhrRecupererArborescence(instancierArborescenceRecuperee, idCategorieaDeplier);;
						}
						else {
							for (var j = 0 ; j < ToutesCategories[idCategorieaDeplier].nbDeComposants; j++) { 
								//console.log("!! idCategorieaDeplier+'a'+(j+1) = "+idCategorieaDeplier+'a'+(j+1));
								document.getElementById(idCategorieaDeplier+'a'+(j+1)).style.display = 'block';
							}
						}			
					}						
					else { // on vient donc de cliquer sur une catégorie fille de derniereCategorieDepliee et qui n'est pas racine
						if (idCategorieaDeplier !== "racine") { // a enlever car evident
							
							for (var i = 0 ; i < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; i++) { // on replie toutes les filles // Vaut mieux le faire dans l'ordre décroissant puisqu'on déplie, non ?
								//console.log("else, "+idCategorieaDeplier+(i+1));
								if (this.derniereCategorieDepliee+'a'+(i+1) !== idCategorieaDeplier) {
									document.getElementById(this.derniereCategorieDepliee+'a'+(i+1)).style.display = 'none';
								}
								  
							}
							var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a'+1);
							console.log("idCategorieaDeplier+'a'+1 = "+idCategorieaDeplier+'a'+1+"\n\et alreadyLoadedInDOM = "+alreadyLoadedInDOM);
							if (alreadyLoadedInDOM === null) {
								requeteXhrRecupererArborescence(instancierArborescenceRecuperee, idCategorieaDeplier);;
							}
							else {
								for (var j = 0 ; j < ToutesCategories[idCategorieaDeplier].nbDeComposants; j++) { 
									//console.log("!! idCategorieaDeplier+'a'+(j+1) = "+idCategorieaDeplier+'a'+(j+1));
									document.getElementById(idCategorieaDeplier+'a'+(j+1)).style.display = 'block';
								}
							}
						}
					}	
				}
			}
		}
		arborescenceNotes.derniereCategorieDepliee = idCategorieaDeplier;  
		//alert("en fin de function, arborescenceNotes.derniereCategorieDepliee = " + arborescenceNotes.derniereCategorieDepliee);
	}
 }

function instancierArborescenceRecuperee ( sCategoriesRecuperees , sCategoriePere ) { // rajouter un booleen isVisible
	//alert ("sCategoriePere = " + sCategoriePere);
	//alert ("sCategoriesRecuperees =" + sCategoriesRecuperees);
	var CategorieParsee = sCategoriesRecuperees.split('|'); // interdiction d'utiliser ce caractère dans une note (on pourrait mettre une interdiction au moment d'enregistrer une note et au moment de l'importation) 
	var nbdItemsDansCategorieParsee = CategorieParsee.length; 
	
	for (i = 0 ; i < nbdItemsDansCategorieParsee-3; i = i + 4) { // vérifier le -3
		var sIdCategorie = CategorieParsee[i];
		var sContent = CategorieParsee[i+1];
		var nNiveauDeCategorie = CategorieParsee[i+2];
		var nNbDeComposants = CategorieParsee[i+3];
		ToutesCategories[sIdCategorie] = new CategorieAbstraite(sIdCategorie, sContent, parseInt(nNiveauDeCategorie), parseInt(nNbDeComposants));
		var oCategorieAffichageDOM = document.createElement("div");
		oCategorieAffichageDOM.id = sIdCategorie;
		oCategorieAffichageDOM.addEventListener('click', function(e) {
			arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id)
		}, false);					
		
		oCategorieAffichageDOM.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			pathFocused = e.target.id;
			displayContextMenu(pathFocused);
		}, false);
		
		oCategorieAffichageDOM.style.marginLeft = iRetraitAffichagedUneCategorie*(nNiveauDeCategorie) + 'px'; // mettre la marge en fonction du niveau de la catégorie
		oCategorieAffichageDOM.innerHTML = sContent; 
		document.getElementById("frameOfTree").appendChild(oCategorieAffichageDOM);
		// if (!isVisible) {oCategorieAffichageDOM.style.display = 'none';}
	}
}

document.getElementById("insertNewNote").addEventListener('click', function() {
	hideContextMenu();
	insertNewNote(pathFocused);
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
			
function insertNewNote(idCategoriePere) {
	//alert("Dans InsertNote, idCategoriePere = "+idCategoriePere);
	initializeFormEnterNote();
	document.getElementById("enregistrerNouvelleNote").addEventListener('click', ecrireNoteDsBdd, false);
	function ecrireNoteDsBdd() { // à mettre en dehors de la function insertNewNote ?
		// griser la catégorie mère??
		document.getElementById("enregistrerNouvelleNote").removeEventListener('click', ecrireNoteDsBdd, false);
		sNewNote = document.getElementById("zoneFormulaireEntrerNote").value;
		//alert(document.getElementById("zoneFormulaireEntrerNote").value);
		if (sNewNote !== "") {
			if (idCategoriePere) {
				requeteXhrInsertNewNote(sNewNote, idCategoriePere);
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
		document.getElementById("enregistrerNouvelleNote").removeEventListener('click', editNoteInDbb, false);
		if (sIdCategoryToEdit !== "") {
			sNewNote = document.getElementById("zoneFormulaireEntrerNote").value;
			document.getElementById("fondPageEntrerTexte").style.display = 'none'; // à inclure dans queryEditNote ??
			queryXhrEditNote(sNewNote, sIdCategoryToEdit);
			//dégriser la catégorie mère		
		}
		else {
			alert("La note est vide, recommencez.")
		}
	}
}

function requeteXhrInsertNewNote(sNewNote, idCategoriePere) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/insertNewNote.php?idTopic=' + idTopic + '&newNote=' + sNewNote + '&idCategoriePere=' + idCategoriePere);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			//alert(ToutesCategories[idCategoriePere].nbDeComposants)
			//alert((idCategoriePere ==="racine" ? "" : idCategoriePere+"a"));
			var sIdCategorieInseree = (idCategoriePere ==="racine" ? "" : idCategoriePere+"a")+parseInt((ToutesCategories[idCategoriePere].nbDeComposants)+1); 
			var sInstanciationCategorieInseree = sIdCategorieInseree+"|"+sNewNote+"|"+(ToutesCategories[idCategoriePere].niveauDeCategorie+1)+"|0";
			//alert (sInstanciationCategorieInseree);
			arborescenceNotes.seDeplacerDanslArborescenceReduite(idCategoriePere); // j'ai changé l'ordre et ajouté cette ligne // ca marche pas..
			ToutesCategories[idCategoriePere].nbDeComposants +=1;
			instancierArborescenceRecuperee ( sInstanciationCategorieInseree , sIdCategorieInseree )
			//alert('idCategoriePere = '+idCategoriePere+" et ToutesCategories[idCategoriePere].nbDeComposants = "+ToutesCategories[idCategoriePere].nbDeComposants  );
			//alert ("Nouvelle note insérée : "+xhr.responseText);
			//if (idCategoriePere === )
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
	sCategoryOfDad = sCategoryToDelete.replace(/a[1-9]+$/, "");// on détermine la catégorie père //il faut envisager le cas racine aussi
	alert("Etes vous sûr de vouloir effacer " + sCategoryToDelete +"?\n\navec CategoryOfDad = " + sCategoryOfDad);
	document.getElementById(sCategoryToDelete).style.backgroundColor = '#cccccc'; // on grise la categorie a effacer
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/deleteNote.php?idTopic=' + idTopic + '&sCategoryToDelete=' + sCategoryToDelete +'&sCategoryOfDad=' + sCategoryOfDad);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			document.getElementById("frameOfTree").removeChild(document.getElementById(sCategoryToDelete)); //il faudrait aussi effacer toutes les div de categories fille
			ToutesCategories[sCategoryOfDad].nbDeComposants -=1;
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans requeteXhrRecupererArborescence !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}

function CategorieAbstraite(id, sContent, niveauDeCategorie, nbDeComposants) {
	this.id = id;
	this.sContent = sContent; 
	this.niveauDeCategorie = niveauDeCategorie;
	this.nbDeComposants = nbDeComposants;
	
}

document.getElementById("NouvelleNote").addEventListener('click', insertNewNote, false); // insert depuis le menu html, att! pas encore implémenté

/*
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
*/

