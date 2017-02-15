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
			$reqGetTopic = $bdd -> prepare('SELECT topic FROM topics WHERE idUser=:idUser AND id=:idTopic');
				$reqGetTopic -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $_GET['idTopic']));
				$resultat = $reqGetTopic -> fetch();
			$topic = $resultat['topic'];
		$reqGetTopic -> closeCursor();

			echo "Bonjour <strong>".$_SESSION['user']."</strong>, vous êtes connecté sur le topic : ".$topic;
		?>
		<a href="../logout.php">(se déconnecter)</a>.
		<div id="frameOfToDo">
			<div id="noscroll">
			<button id="addToDo">+</button>
			<?php
				// afficher la todolist
				$reqDisplayToDoList = $bdd -> prepare('SELECT content, dateCreation, dateExpired FROM todolists WHERE idUser=:idUser AND idTopic=:idTopic ORDER BY dateCreation DESC');
					$reqDisplayToDoList -> execute(array(
					'idUser' => $_SESSION['id'],
					'idTopic' => $_GET["idTopic"])) or die(print_r($reqDisplayToDoList->errorInfo()));
					//echo ('<br>'.$reqDisplayToDoList->rowCount().' rangs affectés');
					
					$rankToDoNote= 0;
					while ($donnees = $reqDisplayToDoList->fetch()) {
						echo "<div class='toDo' id='toDo".$rankToDoNote."'>".$donnees['content']."</div>";
						$rankToDoNote +=1;
					}
				$reqDisplayToDoList -> closeCursor();	
			?>
			</div>
		</div>
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
			<div id="insertNewFolder" class="isRoot isFolder">Nouvelle catégorie fille</div>		
			<div id="insertNewNote" class="isRoot isFolder">Nouvelle note</div>
			<div id="editNote" class="isFolder isNote">Editer</div>	
			<div id="deleteFolder" class="isFolder">Effacer catégorie</div>
			<div id="deleteNote" class="isNote">Effacer note</div>
			<div id="archiveNote" class="isFolder isNote">Archiver(maintenant/date (choisie))</div>
			<div id="archiveToDo" class="isFolder isNote">Fait(maintenant/date (choisie))</div>
			<div id="DisplayContentFolder" class="isRoot isFolder">Afficher l'arbre contenu dedans</div>
			<div id="changeCategoryIntoNote" class="isFolder">Transformer catégorie en note</div>							
			<div id="changeNoteIntoCategory" class="isNote">Transformer note en catégorie</div>						
			<div id="cancel" class="isRoot isFolder isNote">Annuler</div>
		</div>
		
		<input id="chargerfichierXML" type="file" />
		
		<script>
			<?php
			echo "var idUser = ".$_SESSION['id'].";"; 
			echo "var idTopic = ". $_GET['idTopic'].";";
			?>
		</script>

		<script src="toDoList.js"></script>
		<script src="dataTree.js"></script>	
	</body>
</html> 