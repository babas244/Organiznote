var iRetraitAffichagedUneCategorie= 10;
ToutesCategories = {};

//alert ("idUser est " + idUser + "  et idTopic est "+ idTopic);

// fixer largeur des categories mais pas hauteur

// cat : ref, et a faire : afa ?? Et...Changer de séparateur ?? (quels caractères sont acceptés pour les div??)

/* au formulaire des a faire, ajouter des boutons : urgent et important, décochés par défaut. qui permettront de faire figurer sur l'écran de démarrage. 
ceux-ci peuvent être enregistrés comme des tags. On peut rajouter aussi une date (ou un temps) limite, et une d'expiration, vides par défaut. 
on affichera le temps qu'il reste en premier dans l'affichage, ou expiré si expiré
 */  
 
// affichage des afa : une div avec un scroll qui permet de descendre vers les moins urgents et important, et permet quand même de voir le menu en bas
// et il faut les colorer en dégradé pour pour pouvoir les distinguer (double dégradé des 2 extrémités ??)
 
// faire deux menus selon que afa ou ref ?  

// import arborescences en json

// espace membre et page d'accueil, avec mes TitreNote et la possbilité d'en commencer un nouveau

// les option d'une catégoeire : editer, afficher contenu(nouvelle fenetre), archiver/fait (maintenant/->date (choisie)), transformer en catégorie, effacer

// donner un code couleur : afa et ref

// tout objet du DOM devrait changer de couleur au clic (on peut voir qu'on a cliqué comme ça)

// fabriquer une sorte de code d'erreur en comparant le nb de catégories écrit dans la bdd et le nb de catégories instanciées part js ??
	
 
ToutesCategories["racine"] = new CategorieAbstraite("racine", null, 0, 2); // 2 est a recalculer  !!
recupererToutesCategories();

arborescenceNotes = new ArborescenceReduiteAffichee("racine");

//alert (arborescenceNotes.derniereCategorieDepliee);
//arborescenceNotes.seDeplacerDanslArborescenceReduite("1");

//arborescenceNotes.seDeplacerDanslArborescenceReduite("1a2");



function ArborescenceReduiteAffichee(derniereCategorieDepliee) {
	this.derniereCategorieDepliee = derniereCategorieDepliee;
	this.afficherArborescenceReduite = function () {
		var tableauArborescenceDecoupee = this.derniereCategorieDepliee.split('a');
		var c = tableauArborescenceDecoupee.length;
		var categorieAafficher = ""; 
		for (var i = 0; i < c ; i++) { 
			categorieAafficher += tableauArborescenceDecoupee[i]; //verifier si en fin de boucle existence ok
			//alert(categorieAafficher);			
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
			
			if (idCategorieaDeplier === "racine") { // && this.derniereCategorieDepliee.includes('a') ?
				for (var k = 0 ; k < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; k++) { // d'abord replier les filles de derniereCategorieDepliee
					//alert("this.derniereCategorieDepliee+'a'+(k+1) = "+(this.derniereCategorieDepliee+'a'+(k+1)));
					document.getElementById(this.derniereCategorieDepliee+'a'+(k+1)).style.display = 'none';
				}
				var categorieAeffacer = this.derniereCategorieDepliee;
				
				while (categorieAeffacer.includes("a")) {
					document.getElementById(categorieAeffacer).style.display = 'none';
					categorieAeffacer = categorieAeffacer.replace(/a[1-9]+$/, "");
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
			
			if (idCategorieaDeplier.length < this.derniereCategorieDepliee.length && this.derniereCategorieDepliee!=="racine") { // on a donc cliqué sur une categorie antécédente de derniereCategorieDepliee

				for (var k = 0 ; k < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; k++) { // d'abord replier les filles de derniereCategorieDepliee // vaudrait-il mieux que les catégories du DOM héritent les unes des autres ??
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
				//alert(idCategorieaDeplier+'a'+1);
				//alert(alreadyLoadedInDOM)
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
			else {  // on vient donc de cliquer sur une catégorie fille de racine
				if (this.derniereCategorieDepliee === "racine") {
					for (var p = 0 ; p < ToutesCategories.racine.nbDeComposants; p++) {
						if ((p+1) !== parseInt(idCategorieaDeplier)) {
							document.getElementById(p+1).style.display = 'none';
						}
					}
					// déplier les catégories filles de idCategorieaDeplier
					//console.log(ToutesCategories[idCategorieaDeplier]);
					var alreadyLoadedInDOM = document.getElementById((ToutesCategories[idCategorieaDeplier])+'a'+1);
					//console.log(alreadyLoadedInDOM);
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
				
				else { // on vient donc de cliquer sur une catégorie fille de derniereCategorieDepliee et qui n'est pas racine
					if (idCategorieaDeplier !== "racine") {
						
						for (var i = 0 ; i < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; i++) { // on replie toutes les filles // Vaut mieux le faire dans l'ordre décroissant puisqu'on déplie, non ?
							//console.log("else, "+idCategorieaDeplier+(i+1));
							if (this.derniereCategorieDepliee+'a'+(i+1) !== idCategorieaDeplier) {
								document.getElementById(this.derniereCategorieDepliee+'a'+(i+1)).style.display = 'none';
							}
							  
						}
						var alreadyLoadedInDOM = document.getElementById(idCategorieaDeplier+'a'+1);
						//alert(idCategorieaDeplier+'a'+1);
						//alert(alreadyLoadedInDOM)
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
		arborescenceNotes.derniereCategorieDepliee = idCategorieaDeplier;  
		//alert("en fin de function, arborescenceNotes.derniereCategorieDepliee = " + arborescenceNotes.derniereCategorieDepliee);
	}
}

function recupererToutesCategories() { // faire qu'une seule fonction qui réunit les 3 fonctions ??
	requeteXhrRecupererArborescence(instancierArborescenceRecuperee, "racine");
	document.getElementById("racine").addEventListener('click', function(e) {
			arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id);//;
		}, false);
}

function instancierArborescenceRecuperee ( sCategoriesRecuperees , sCategoriePere ) {
	//alert ("sCategoriePere = " + sCategoriePere);
	//alert ("sCategoriesRecuperees =" + sCategoriesRecuperees);
	var CategorieParsee = sCategoriesRecuperees.split('|'); // interdiction d'utiliser ce caractère dans une note (on pourrait mettre une interdiction au moment d'enregistrer une note et au moment de l'importation) 
	var nbdItemsDansCategorieParsee = CategorieParsee.length; 
	
	for (i = 0 ; i < nbdItemsDansCategorieParsee-3; i = i + 4) { // vérifier le -3
		var sIdCategorie = CategorieParsee[i];
		var sContent = CategorieParsee[i+1];
		var nNiveauDeCategorie = CategorieParsee[i+2];
		var nNbDeComposants = CategorieParsee[i+3];
		ToutesCategories[sIdCategorie] = new CategorieAbstraite(sIdCategorie, sContent, nNiveauDeCategorie, nNbDeComposants);
		var oCategorieAffichageDOM = document.createElement("div");
		oCategorieAffichageDOM.id = sIdCategorie;
		oCategorieAffichageDOM.addEventListener('click', function(e) {
			//console.log("e.target.id  = " + e.target.id);
			arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id);//;
		}, false);
		oCategorieAffichageDOM.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			//document.getElementById("fondMenuCategorie").style.display = 'block';
			insertNewNote(e.target.id);
		}, false);
		oCategorieAffichageDOM.style.marginLeft = iRetraitAffichagedUneCategorie*(nNiveauDeCategorie) + 'px'; // mettre la marge en fonction du niveau de la catégorie
		oCategorieAffichageDOM.innerHTML = sContent; 
		document.getElementById("frameOfTree").appendChild(oCategorieAffichageDOM);
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


document.getElementById("NouvelleNote").addEventListener('click', insertNewNote, false);

/* document.getElementById("insertNewNote").addEventListener('click', function(e) {
	insertNewNote(e.target.id);
}, false);
 */

function insertNewNote(idCategoriePere) {
	//alert("idCategoriePere = "+idCategoriePere);
	document.getElementById("fondPageEntrerTexte").style.display = 'block';
	document.getElementById("textBox").style.display = 'block';
	document.getElementById("enregistrerNouvelleNote").style.display = 'block';
	document.getElementById("annulerEntrerNote").style.display = 'block';
	document.getElementById("reinitialiserFormulaireEntrerNote").style.display = 'block';
	document.getElementById("enregistrerNouvelleNote").innerHTML = "Enregistrer";
	document.getElementById("reinitialiserFormulaireEntrerNote").innerHTML = "Réinitaliser";
	document.getElementById("annulerEntrerNote").innerHTML = "Annuler";
	document.getElementById("zoneFormulaireEntrerNote").focus();
	document.getElementById("enregistrerNouvelleNote").addEventListener('click', function ecrireNoteDsBdd() {
		// griser la catégorie mère
		sNewNote = document.getElementById("zoneFormulaireEntrerNote").value;
		//alert(document.getElementById("zoneFormulaireEntrerNote").value);
		if (idCategoriePere) {
			requeteXhrInsertNewNote(sNewNote, idCategoriePere);
		}
		else { // marche pas.. // if (typeof v !== 'undefined' && v !== null) 
			alert("note pas encore placée");
		}
		//dégriser la catégorie mère
	}, false);

	document.getElementById("reinitialiserFormulaireEntrerNote").addEventListener('click', function reinitialiserFormulaireEntrerNote() {
		document.getElementById("formulaireEntrerNote").reset();
		document.getElementById("zoneFormulaireEntrerNote").focus();
	}, false);

	document.getElementById("annulerEntrerNote").addEventListener('click', function AnnulerEntrerNote() {
		document.getElementById("fondPageEntrerTexte").style.display = 'none';
		document.getElementById("textBox").style.display = 'none';
		document.getElementById("enregistrerNouvelleNote").style.display = 'none';
		document.getElementById("reinitialiserFormulaireEntrerNote").style.display = 'none';
		document.getElementById("annulerEntrerNote").style.display = 'none';
		document.getElementById("formulaireEntrerNote").reset();
	}, false);
}


function requeteXhrInsertNewNote(sNewNote, idCategoriePere) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/insertNewNote.php?idTopic=' + idTopic + '&newNote=' + sNewNote + '&idCategoriePere=' + idCategoriePere);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			//alert('idCategoriePere = '+idCategoriePere);
			ToutesCategories[idCategoriePere].nbDeComposants +=1;
			//alert ("Nouvelle note insérée : "+xhr.responseText); 
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dans requeteXhrRecupererArborescence !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}



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


/*
function requeteXhrRecupererCategories(fCallback, sIdNumeroCategorieDepliee) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/reponse.php?sIdNumeroCategorieDepliee=' + sIdNumeroCategorieDepliee); // il faut envoyer aussi la titreNotes
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			fCallback(xhr.responseText, sIdNumeroCategorieDepliee); 
		} 
		else if (xhr.readyState == 4 && xhr.status != 200) { // !== ??
				alert('Une erreur est survenue dansrequeteXhrRecupererCategories !\n\nCode:' + xhr.status + '\nTexte: ' + xhr.statusText);
		}
	}
}


function fInstancierCategories( sCategoriesRecuperees , sIdNumeroCategorieDepliee ) { // récupérer les catégories et les caractériser pour tout ce qui concerne la création des objets
	var CategorieParsee = sCategoriesRecuperees.split('|'); // interdiction d'utiliser ce caractère dans une note (on pourrait mettre une interdiction au moment d'enregistrer une note et au moment de l'importation) 
	var nbdItemsDansCategorieDepliee = CategorieParsee.length; 
	ToutesCategories[sIdNumeroCategorieDepliee].nbDeComposants = nbdItemsDansCategorieDepliee; //ecrire le nb d'item dans la catégorie en train de se déplier
	if (sIdNumeroCategorieDepliee == "catRacine") {
		sIdNumeroCategorieDepliee = ""; 
		var niveauDeCategorie = 0;
	} 
	else {
		var tableauCategories = sIdNumeroCategorieDepliee.substring(2).split('a'); //en supposant que a est le séparateur
		var niveauDeCategorie = tableauCategories.length;
	}
	for (var i = 0 ; i < nbdItemsDansCategorieDepliee ; i++ ) {
		var j = i+1;
		if (niveauDeCategorie == 0) { // === ?
			var idCategorie = 'cat' + j;
		} 
		else {
			var idCategorie = sIdNumeroCategorieDepliee + 'a' + j;		
		}
		ToutesCategories[idCategorie] = new CategorieAbstraite(idCategorie, CategorieParsee[i], niveauDeCategorie + 1, null);
		var oCategorieAffichageDOM = document.createElement("div");
		oCategorieAffichageDOM.id=idCategorie;
		oCategorieAffichageDOM.addEventListener('click', function(e) {
			//alert(e.target.id);
			arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id);
		}, false); // false or true??
		oCategorieAffichageDOM.style.marginLeft = iRetraitAffichagedUneCategorie*(niveauDeCategorie) + 'px'; // mettre la marge en fonction du niveau de la catégorie
		oCategorieAffichageDOM.innerHTML = CategorieParsee[i]; 
		document.body.appendChild(oCategorieAffichageDOM);
	}
}

*/

function CategorieAbstraite(id, sContent, niveauDeCategorie, nbDeComposants) {
	this.id = id;
	this.sContent = sContent; 
	this.niveauDeCategorie = niveauDeCategorie;
	this.nbDeComposants = nbDeComposants;
	this.chargerContenuCategorie = function (){
		requeteXhrRecupererCategories(fInstancierCategories, this.id);
	}
}





/* function ArborescenceAffichee(aListeCategoriesAffichees) { // aListeCategoriesAffichees est la liste des catégories à afficher à un instant donné 
	this.listeCategoriesAffichees = aListeCategoriesAffichees;
	this.afficherArborescence = function () { // affiche l'arborescence des catégories déjà instanciées
		var c = this.listeCategoriesAffichees.length;
		for (var i = 0; i < c ; i++) {
			document.getElementById(this.listeCategoriesAffichees[i]).style.display = 'block';
		}
	}
	
	this.seDeplacerDanslArborescence = function (idCategorieaDeplier) {
		//if (idCategorieaDeplier
	}
	
	
	this.effacerCategoriesDescendants = function (idPere) {
		var i = 0; 
		while (aListeCategoriesAffichees[i]!=idPere) { // utiliser plutôt indexOf pour trouver i ??
			i+=1;
		}
		var j = i + 1; 
		var longueurChaineIdPere = idPere.length; 
			while (aListeCategoriesAffichees[j].substring(0,longueurChaineIdPere) == idPere) {
			document.getElementById(aListeCategoriesAffichees[j]).style.display = 'none'; 
			j+=1;
		}
		aListeCategoriesAffichees.splice(i,j);
	}
} */