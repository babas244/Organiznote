var iRetraitAffichagedUneCategorie= 15;
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

recupererToutesCategories();

function recupererToutesCategories() { // faire qu'une seule fonction qui réunit les 3 fonctions ??
	requeteXhrRecupererArborescence(instancierArborescenceRecuperee, "racine")
}

function instancierArborescenceRecuperee ( sCategoriesRecuperees , sCategoriePere ) {
	//alert ("sCategoriePere = " + sCategoriePere);
	//alert (sCategoriesRecuperees);
	var CategorieParsee = sCategoriesRecuperees.split('|'); // interdiction d'utiliser ce caractère dans une note (on pourrait mettre une interdiction au moment d'enregistrer une note et au moment de l'importation) 
	var nbdItemsDansCategorieParsee = CategorieParsee.length; 
	
	for (i = 0 ; i < nbdItemsDansCategorieParsee-3; i = i + 4) { // vérifier le -3
		var sIdCategorie = CategorieParsee[i];
		var sContent = CategorieParsee[i+1];
		var nNiveauDeCategorie = CategorieParsee[i+2];
		var nNbDeComposants = CategorieParsee[i+3];
		//var ToutesCategories[sIdCategorie] = new CategorieAbstraite(sIdCategorie, sContent, nNiveauDeCategorie, nNbDeComposants);
		var oCategorieAffichageDOM = document.createElement("div");
		oCategorieAffichageDOM.id = sIdCategorie;
		/* oCategorieAffichageDOM.addEventListener('click', function(e) {
			arborescenceNotes.seDeplacerDanslArborescenceReduite(e.target.id);
		}, false); // false or true??
		 */
		oCategorieAffichageDOM.style.marginLeft = iRetraitAffichagedUneCategorie*(nNiveauDeCategorie) + 'px'; // mettre la marge en fonction du niveau de la catégorie
		oCategorieAffichageDOM.innerHTML = sContent; 
		document.getElementById("frameOfTree").appendChild(oCategorieAffichageDOM);
	}

}


function requeteXhrRecupererArborescence(fCallback, sCategoriePere) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/getTree.php?idTopic=' + idTopic + '&sCategoriePere=' + sCategoriePere );
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


document.getElementById("NouvelleNote").addEventListener('click', function EntrerTexte() {
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
		requeteXhrInsertNewNote(sNewNote);
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
}, false);


function requeteXhrInsertNewNote(fCallback, sNewNote) {
	var xhr = new XMLHttpRequest(); 
	xhr.open ('GET', 'ajax/insertNewNote.php?idTopic=' + idTopic + '&newNote=' + sNewNote );
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			alert ("Nouvelle note insérée"); //fCallback(xhr.responseText, sCategoriePere); rien ici non ??
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

// Instancier la catégorie racine : 
//document.getElementById("catRacine").innerHTML = titreNotes;
//document.getElementById("catRacine").style.display = 'block';
ToutesCategories["catRacine"] = new CategorieAbstraite("catRacine", 0, null);
//ToutesCategories["catRacine"].chargerContenuCategorie();

//arborescenceNotes = new ArborescenceReduiteAffichee("racine");



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


/*
function ArborescenceReduiteAffichee(derniereCategorieDepliee) {
	this.derniereCategorieDepliee = derniereCategorieDepliee;
	this.afficherArborescenceReduite = function () {
		var tableauArborescenceDecoupee = this.derniereCategorieDepliee.split('a'); // et le a de cat....?
		var c = this.tableauArborescenceDecoupee.length;
		var categorieAafficher = ""; 
		for (var i = 0; i < c ; i++) { 
			categorieAafficher += tableauArborescenceDecoupee[i]; //verifier si en fin de boucle existence ok 
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
	this.seDeplacerDanslArborescenceReduite = function (idCategorieaDeplier) {
		if (idCategorieaDeplier !== this.derniereCategorieDepliee) {
			if (idCategorieaDeplier.length > this.derniereCategorieDepliee.length) { // on vient donc de cliquer sur une catégorie fille de derniereCategorieDepliee
				for (var i = 0 ; i < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; i++) { // on replie toutes les filles // Vaut mieux le faire dans l'ordre décroissant puisqu'on déplie, non ?
					document.getElementById(categorieAafficher+(i+1)).style.display = 'none';  
				}
				document.getElementById(idCategorieaDeplier).style.display = 'block'; // on redéplie a catégorie cliquée
				if (ToutesCategories[idCategorieaDeplier].nbDeComposants = null) { // on affiche les catégories filles // faudrait-il considérer le cas undefined aussi ??
					ToutesCategories[idCategorieaDeplier].chargerContenuCategorie();
				} 
				else {
					for (var j = 0 ; j < ToutesCategories[idCategorieaDeplier].nbDeComposants; j++) {
						document.getElementById(idCategorieaDeplier+'a'+(j+1)).style.display = 'block';
					}
				}
			}
			else { // on a donc cliqué sur une categorie antécédente de derniereCategorieDepliee 
				for (var k = 0 ; k < ToutesCategories[this.derniereCategorieDepliee].nbDeComposants; k++) { // d'abord replier les filles de derniereCategorieDepliee // vaudrait-il mieux que les catégories du DOM héritent les unes des autres ??
					document.getElementById(this.derniereCategorieDepliee+'a'+(k+1)).style.display = 'none';
				}
				var tableauArborescenceDecoupeeaEffacer = this.derniereCategorieDepliee.susbtr(0,idCategorieaDeplier.length).split('a'); // replier les catégories au-dessus de idCategorieaDeplier 
				var categoriesDescendantesDeIdCategorieaDeplieraEffacer = idCategorieaDeplier;
				for (var l = 0 ; l < tableauArborescenceDecoupeeaEffacer.length ; l++) {
					categoriesDescendantesDeIdCategorieaDeplieraEffacer += 'a'+tableauArborescenceDecoupeeaEffacer[l];
					document.getElementById(categoriesDescendantesDeIdCategorieaDeplieraEffacer).style.display = 'none';
				} 
				// puis déplier le nouveau derniereCategorieDepliee :
				if (ToutesCategories[idCategorieaDeplier].nbDeComposants = null) { // en principe ce cas ne se présente pas, ces catégories existent déjà
					ToutesCategories[idCategorieaDeplier].chargerContenuCategorie();
				} 
				else {
					for (var m = 0 ; m < ToutesCategories[idCategorieaDeplier].nbDeComposants; m++) {
						document.getElementById(idCategorieaDeplier+'a'+(m+1)).style.display = 'block';
					}
				}
			}
		seDeplacerDanslArborescenceReduite.derniereCategorieDepliee = idCategorieaDeplier; 
		} 
	}
}
}

*/

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