<?php 
session_start();

include '../log_in_bdd.php';

include '../sessionAuthentication.php';

// il faut vérifier que idTopic est de la bonne forme
?>


<!DOCTYPE html>
<html>
    <head>
        <title>Organiznote</title>
        <meta charset="utf-8" />
		<link rel="stylesheet" href="style.css" />
    </head>
    <body>
		<!-- -->
		<?php 
			echo "L'utilisateur <strong>".$_SESSION['user']."</strong>, d'identifiant ".$_SESSION['id']." est connecté sur ".$_GET['idTopic'];
		?>
		<a href="../logout.php">(se déconnecter)</a>;
		<div id="frameOfTree">
			<div id="01" class="folder">   <!--div "racine"--> 
			</div>
		</div>
		<div id="menu">
		<ul class="Niveau1">
			<li>
				<button>Nouveau</button>
				<ul class="Niveau2">
						<li><button>à faire</button></li>
						<li><button>catégorie à faire</button></li>
						<li><button id="NouvelleNote">Référence</button></li>
						<li><button>catégorie référence</button></li>
				</ul>
			</li>
			<li>
				<button>Recherche</button>
				<ul class="Niveau2">
					<li><button>référence</button></li>
					<li><button>catégorie</button></li>
					<li><button>référence +catégorie</button></li>
				</ul>	
			</li>
			<li>
				<button>Affichage</button>
				<ul class="Niveau2">
					<li><button id="displayAllTree">tout</button></li>
					<li><button>fait</button></li>
					<li><button>arborescence</button></li>
					<li><button>archives</button></li>
				</ul>	
			</li>
			<li>
				<button>Naviguer</button>
				<ul class="Niveau2">
					<li><button>déplacer des blocs</button></li>
					<li><button id="importerXML">importer xml</button></li>
					<li><button>exporter en xml</button></li>
				</ul>	
			</li>
			<li>
				<button>Historique</button>
				<ul class="Niveau2">
					<li><button>&lt;-</button></li>
					<li><button>-></button></li>
					<li><button>3 dernières</button></li>
					<li><button>10 dernières</button></li>
					<li><button>24h</button></li>
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
			<button id="enregistrerNouvelleNote">Enregistrer</button>
			<button id="reinitialiserFormulaireEntrerNote">Réinitialiser</button>
			<button id="annulerEntrerNote">Annuler</button>
		</div>
		
		<div id="fondMenuCategorie">
			<div id="insertNewCategory" class="root folder note">Nouvelle catégorie fille</div>		
			<div id="insertNewNote" class="root folder note">Nouvelle note</div>
			<div id="editNote" class="folder note">Editer</div>	
			<div id="deleteNote" class="folder note">Effacer</div>
			<div id="archiveNote" class="folder note">Archiver(maintenant/date (choisie))</div>
			<div id="archiveToDo" class="folder note">Fait(maintenant/date (choisie))</div>
			<div id="DisplayContentCategory" class="root folder">Afficher l'arbre contenu dedans</div>
			<div id="changeCategoryIntoNote" class="folder">Transformer catégorie en note</div>							
			<div id="changeNoteIntoCategory" class="note">Transformer note en catégorie</div>						
			<div id="cancel" class="root folder note">Annuler</div>
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