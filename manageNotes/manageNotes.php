<?php 
session_start();

require '../log_in_bdd.php';

require '../sessionAuthentication.php';

if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {
	require '../isIdTopicSafeAndMatchUser.php';
	$idTopic = htmlspecialchars($_GET['idTopic']);	
?>


<!DOCTYPE html>
<html>
    <head>
        <title>Organiznote</title>
        <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
		<meta name="robots" content="noindex,nofollow">
		<link rel="stylesheet" href="dataTree.css" />
		<link rel="stylesheet" href="toDoList.css" />
		<link rel="stylesheet" href="superFormModale.css" />
    </head>
    <body>
		<!-- -->
		<div id="header">
			<div id="referencesUser">
				<a href="../logout.php" id="disconnectUser">Déconnexion</a>
				<?php
					$reqGetTopic = $bdd -> prepare('SELECT topic FROM topics WHERE idUser=:idUser AND id=:idTopic');
						$reqGetTopic -> execute(array(
						'idUser' => $_SESSION['id'],
						'idTopic' => $idTopic));
						$resultat = $reqGetTopic -> fetch();
						$_SESSION['topic'] = $resultat['topic'];
						if ($reqGetTopic->rowCount() == 0) {
							header("Location: ../logout.php");
						}
					$reqGetTopic -> closeCursor();
					$userNameDisplayed = strlen($_SESSION['user']) < 16 ? $_SESSION['user'] : substr($_SESSION['user'], 0,15)."...";
					$topicDisplayed = strlen($_SESSION['topic']) < 16 ? $_SESSION['topic'] : substr($_SESSION['topic'], 0,15)."...";					
					echo "Bonjour <strong>".$userNameDisplayed."</strong>, vous êtes connecté sur le topic <strong>".$topicDisplayed."</strong>. ";
				?>
			</div>
			<div id="frameOfSwitchToTreeForMobile">
				<button id="displayAndHideTree">V
				</button>
			</div>
		</div>
		
		<div id="containerOfToDo">
		<div id="transparentLayerOnContainerOfToDo"><p id="ajaxLoadingImageContainerOfToDo"><img src="ajaxLoading_box.gif" alt="Loading..." /></p></div>
			<div id="frameOfToDo">
				<div id="noScroll">
					<div id="greyLayerOnNoScroll">
					</div>
					<button id="addToDoButton">+</button>			
						<div id="addToDoFrame">
							<button id="cancelAddToDo"><-</button>
							<div id="frameTextareaToDoForm">
								<form id="addToDoForm">
									<input type="textarea" name="toDoTextarea" id="toDoTextarea" placeholder="Ecrire ici" maxlength="1700">
								</form>		
							</div>
							<button id="resetAddToDoForm">x</button>	
						</div>
					<div id="lastAndInvisible">...</div>
				</div>
			</div>
			<div id="frameOfContextMenuToDo">
				<button id="cancelContextMenu">&lt;-</button>	
				<button id="deleteToDo">X</button>
				<button id="StatedToDoDone">7</button>
				<button id="editToDo">Edit</button>
			</div>
		</div>
		
		<div id="containerOfTree">
			<div id="frameOfTree">
				<div id="greyLayerOnFrameOfTree"><p id="ajaxLoadingImageFrameOfTree"><img src="ajaxLoadingDataTree_spiral.gif" alt="Loading..." /></p></div>
				<div id="01" class="folder">   <!--div "racine", à mettre dans dataTree.js ?--> 
				</div>
				<div id="menu">
					<ul class="Niveau1">
						<li>
							<button>Affichage</button>
							<ul class="Niveau2">
								<li><button>arborescence</button></li>
								<li><button>archives</button></li>
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
			</div>
			<div id="fondMenuCategorie">
				<div id="frameContextMenuTree">
					<button id="insertNewFolder" class="contextMenu isRoot isFolder">Nouvelle catégorie fille</button>		
					<button id="insertNewNote" class="contextMenu isRoot isFolder">Nouvelle note</button>
					<button id="editTreeItem" class="contextMenu isFolder isNote">Editer</button>	
					<button id="deleteFolder" class="contextMenu isFolder">Effacer catégorie</button>
					<button id="deleteNote" class="contextMenu isNote">Effacer note</button>
					<button id="archiveNote" class="contextMenu isFolder isNote">Archiver(maintenant/date (choisie))</button>
					<button id="moveTreeItem" class="contextMenu isFolder isNote">Déplacer</button>
					<button id="pasteHereTreeItem" class="contextMenu isPastingHere">Coller ici</button>
					<button id="DisplayContentFolder" class="contextMenu isRoot isFolder">Afficher l'arbre contenu dedans</button>
					<button id="changeCategoryIntoNote" class="contextMenu isFolder">Transformer catégorie en note</button>							
					<button id="changeNoteIntoCategory" class="contextMenu isNote">Transformer note en catégorie</button>
					<button id="importTreeHere" class="contextMenu isRoot isFolder">Importer ici une branche en JSON</button>
					<button id="exportTreeFromHere" class="contextMenu isRoot isFolder">exporter d'ici en JSON</button>
					<button id="getOutFromHere" class="contextMenu isPastingHere isCancel">Sortir d'ici</button>
					<button id="cancel" class="contextMenu isRoot isFolder isNote isPastingHere isCancel">Annuler</button>
				</div>	
			</div>
			<div id="frameOfFileLoader">
				Charger le fichier (ou glisser-déposer) :<Br><Br>
				<input id="loadDataTreeJSON" type="file" /><Br><Br>
				<button id="cancelLoadFile">annuler</button>
			</div>	
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
		
		
		<script>
			<?php
			echo "var idUser = ".$_SESSION['id'].";"; 
			echo "var idTopic = ". $idTopic.";";
}			
			?>
		</script>
		
		<script src="commonFunctions (dataTree and toDoList).js"></script>
		<script src="superFormModale.js"></script>
		<script src="toDoList.js"></script>
		<script src="dataTree.js"></script>	
	</body>
</html> 