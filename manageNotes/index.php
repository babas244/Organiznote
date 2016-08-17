<?php 
session_start();

include '../log_in_bdd.php';

include '../sessionAuthentication.php';

// il faut vérifier que idTopic est de la bonne forme

echo $_SESSION['id']." connecté sur ".$_GET['idTopic'];

?>


<!DOCTYPE html>
<html>
    <head>
        <title>Organiznote</title>
        <meta charset="utf-8" />
		<link rel="stylesheet" href="style.css" />
    </head>
    <body>
	    <h3>Organiznote</h3>
		<!-- -->
		<div id="frameOfTree">
			<div id="racine">   <!-- changer "racine" par "topic" ?? ou par "root" ??--> 
			</div>
		</div>
		<div id="menu">
		<ul class="Niveau1">
			<li>
				<div>
					Nouveau
				</div>
				<ul class="Niveau2">
						<li>à faire</li>
						<li>catégorie à faire</li>
						<li><div id="NouvelleNote">Référence</div></li>
						<li>catégorie référence</li>
				</ul>
			</li>
			<li>
				<div>
					Recherche
				</div>
				<ul class="Niveau2">
					<li>référence</li>
					<li>catégorie</li>
					<li>référence +catégorie</li>
				</ul>	
			</li>
			<li>
				<div>Affichage</div>
				<ul class="Niveau2">
					<li>tout</li>
					<li>fait</li>
					<li>arborescence</li>
					<li>archives</li>
				</ul>	
			</li>
			<li>
				<div>Naviguer</div>
				<ul class="Niveau2">
					<li>déplacer des blocs</li>
					<li><div id="importerXML">importer xml</div></li>
					<li>exporter en xml</li>
				</ul>	
			</li>
			<li>
				<div>Historique</div>
				<ul class="Niveau2">
					<li>&lt;-</li>
					<li>-></li>
					<li>3 dernières</li>
					<li>10 dernières</li>
					<li>24h</li>
				</ul>	
			</li>
		</ul>
		</div>
		<br/>
		
		<div id="fondPageEntrerTexte">
			<div id="textBox">
				<form id="formulaireEntrerNote">
					<textarea name="zoneFormulaireEntrerNote" id="zoneFormulaireEntrerNote" placeholder="Ecrire ici"></textarea>
				</form>
			</div>
			<div id="enregistrerNouvelleNote">Enregistrer</div>
			<div id="reinitialiserFormulaireEntrerNote">Réinitialiser</div>
			<div id="annulerEntrerNote">Annuler</div>
		</div>
		
		<div id="fondMenuCategorie">
			<div id="insertNewCategory">Nouvelle catégorie fille</div>		
			<div id="insertNewNote">Nouvelle note</div>
			<div id="editNote">Editer</div>	
			<div id="deleteNote">Effacer</div>
			<div id="archiveNote">Archiver(maintenant/date (choisie))</div>
			<div id="archiveToDo">Fait(maintenant/date (choisie))</div>
			<div id="DisplayContentCategory">Afficher contenu de la catégorie"</div>
			<div id="changeCategoryIntoNote">Transformer catégorie en note</div>							
			<div id="changeNoteIntoCategory">Transformer note en catégorie</div>						
			<div id="cancel">Annuler</div>
		</div>
		
		<input id="chargerfichierXML" type="file" />
		
		<script>
			<?php
			echo "var idUser = ".$_SESSION['id'].";"; 
			echo "var idTopic = ". $_GET['idTopic'].";";
			?>
		</script>

		<script src="script.js"></script>	
	</body>
</html> 