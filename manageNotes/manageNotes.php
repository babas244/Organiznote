<?php 
session_start();

require '../log_in_bdd.php';

require '../sessionAuthentication.php';

if (!isset($_GET["idTopic"])) {
	header("Location: ../logout.php");
}
else if (isset($_SESSION['id'])) {
	require '../isIdTopicSafeAndMatchUser.php';
	$idTopic = htmlspecialchars($_GET['idTopic']);	
	$reqGetTopic = $bdd -> prepare('SELECT topic, colorBackGround FROM topics WHERE idUser=:idUser AND id=:idTopic');
		$reqGetTopic -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic));
		$resultat = $reqGetTopic -> fetch();
		$_SESSION['topic'] = $resultat['topic'];
		$backgroundColorToDo = $resultat['colorBackGround'];
		if ($reqGetTopic->rowCount() == 0) {
			header("Location: ../logout.php");
		}
	$reqGetTopic -> closeCursor();
	$userNameDisplayed = strlen($_SESSION['user']) < 16 ? $_SESSION['user'] : substr($_SESSION['user'], 0,15)."...";
	$topicDisplayed = strlen($_SESSION['topic']) < 16 ? $_SESSION['topic'] : substr($_SESSION['topic'], 0,15)."...";					
?>


<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $topicDisplayed;?></title>
        <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
		<meta name="robots" content="noindex,nofollow">
		<link rel="stylesheet" href="manageNotes.css"/>
		<link rel="stylesheet" href="dataTree.css" />
		<link rel="stylesheet" href="toDoList.css" />
		<link rel="stylesheet" href="superFormModale.css" />
    </head>
    <body>
		<!-- -->
		<div id="header">
			<div id="referencesUser">
				<!--<button id="test">test</button>-->
				<a href="../logout.php" id="disconnectUser">
					<!--feather log-out -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
				</a>
				
				<!--feather wifi -->
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-wifi"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12" y2="20"></line></svg>
				
				<a href="../manageTopics.php" id="linkToTopics">Sujets</a>
				
				<span class="containerHeader">
					<!--feather user -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
					
					<?php echo $userNameDisplayed;?>
				</span>
				
				<span class="containerHeader">
					<!--feather file-text -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
					
					<?php echo $topicDisplayed;?>
				</span>
			</div>
			<div id="frameOfSwitchToTreeForMobile">
				<button id="displayAndHideTree">V
				</button>
			</div>
		</div>
		
		<div id="containerOfToDo">
			<div id="transparentLayerOnContainerOfToDo">
				<p id="ajaxLoadingImageContainerOfToDo">
					<img src="ajaxLoading_box.gif" alt="Loading..." />
				</p>
			</div>
			
			<div id="frameHeaderIcons">
			
				<div id="iconsToDo">
				
					<button id="addToDoButton" title="new">
						<!--feather plus square icon - insert New -->
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>		
					</button>

					<!--feather briefcase icon - archive -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
					
					<button id="searchToDosButton" title="search">
						<!--feather search icon-->
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
					</button>
					
					<button id="exportToDoList">
						<!--feather upload icon-->						
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
					</button>
					
					<button id="displayCompleteToDoList">
						<!--feather external-link icon-->
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>				
					</button>

					<!--feather trash2 icon-->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
				</div>
				
				<div id="addToDoFrame">
				
					<button id="cancelAddToDo" title="cancel">
						<!--feather arrow-left-circle icon-->
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>					
					</button>
					
					<div id="frameTextareaToDoForm">
						<form id="addToDoForm">
							<input type="textarea" name="toDoTextarea" id="toDoTextarea" placeholder="Ecrire ici" maxlength="16383">
						</form>		
					</div>
					
					<button id="resetAddToDoForm" title="reset">
						<!--feather x-square icon-->
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
					</button>

				</div>
				
				
			</div>
			
			<div id="frameOfToDo">
				<div id="divFixHeight">
					<div id="noScroll">
						<div id="greyLayerOnNoScroll">
						</div>
						
						<div id="lastAndInvisible">...</div>
					</div>
					<div id="handScroller">
					</div>
				</div>
			</div>
			
			<div id="frameControlsToDo">
				<div id="frameSelectAllToDoOrOne">
					<div class="labelSwitch">all</div>
					<label class="switch">
					  <input type="checkbox" checked id="selectAllToDoOrOne">
					  <span class="slider round"></span>
					</label>
					<div class="labelSwitch">1</div>
				</div>
				<div id="containerOfLabelsCheckBoxes">
				</div>
			</div>			
			<div id="frameOfContextMenuToDo">
				<button id="cancelContextMenu">
					<!--feather arrow-left-circle icon-->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>									
				</button>	
				<button id="editToDo">
					<!--feather edit -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
				</button>
				<button id="StatedToDoDone">
					<!--feather briefcase icon - archive -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
				</button>
				<button id="deleteToDo">
					<!--feather delete icon-->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-delete"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
				</button>
			</div>
		</div>
		
		<div id="containerOfTree">
			<div id="frameOfTree">
				<div id="greyLayerOnFrameOfTree">
					<p id="ajaxLoadingImageFrameOfTree">
						<img src="ajaxLoadingDataTree_spiral.gif" alt="Loading..." />
					</p>
				</div>
				<div id="01" class="folder">
				</div>   <!--div "racine", à mettre dans dataTree.js ?--> 

				<!--<button id="boutonTest">test</button>-->

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
		<br/>
		
		<script>
			<?php
			echo "var idUser = ".$_SESSION['id'].";"; 
			echo "var idTopic = ". $idTopic.";";
			echo "var backgroundColorToDo = '".$backgroundColorToDo."';";
}
			else {
				header("Location: ../logout.php");
			}
			?>
		</script>
		
		<script src="commonFunctions (dataTree and toDoList).js"></script>
		<script src="superFormModale.js"></script>
		<script src="toDoList.js"></script>
		<script src="dataTree.js"></script>	
	</body>
</html> 