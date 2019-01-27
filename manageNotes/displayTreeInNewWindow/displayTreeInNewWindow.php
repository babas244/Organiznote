<?php
header("Content-Type: text/html; charset=UTF-8");
session_start();
require '../../log_in_bdd.php';
require '../../isIdTopicSafeAndMatchUser.php';
$idTopic = htmlspecialchars($_GET["idTopic"]);
 ?>

<!DOCTYPE html>
<html>
    <head>
        <title>
			<?php
				$reqGetTopic = $bdd -> prepare('SELECT topic FROM topics WHERE idUser=:idUser AND id=:idTopic');
					$reqGetTopic -> execute(array(
					'idUser' => $_SESSION['id'],
					'idTopic' => $idTopic));
					$resultat = $reqGetTopic -> fetch();
				echo 'export tree '.$resultat['topic'];
				$reqGetTopic -> closeCursor();	
			?>
		</title>
        <meta charset="utf-8" />
		<link rel="stylesheet" href="style_displayTreeInNewWindow.css" />
    </head>
    <body>


<?php

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sOriginPathTreeToDisplay"])) {
		
	$sOriginPathTreeToDisplay = htmlspecialchars($_GET["sOriginPathTreeToDisplay"]);

	$iLevelinTreeOriginPath = ((strlen($sOriginPathTreeToDisplay)+4)/3)-1;
	
	$reqRetrieveTree = $bdd -> prepare('SELECT idNote, content FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent ORDER BY IdNote');
		$reqRetrieveTree -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic,
		'startWithPathParent' => $sOriginPathTreeToDisplay.'%')) or die(print_r($reqRetrieveTree->errorInfo()));
	
	$levelInTreeItemCurrent = 9999;
	$gapInInPx = 30; // nb de px d'espace entre deux levels consécutifs
	$contentTreeHtml = "";
	
	while ($donnees = $reqRetrieveTree->fetch()) {
			$idNote = $donnees['idNote'];
			$classOfTreeItem = (substr($idNote,-3,1)==="b" ? 'note' : 'folder');
			$levelInTree = (strlen($idNote)+1)/3-1;
			//if ($levelInTree < $levelInTreeItemCurrent) {echo "<Br>";}
			$levelInTreeItemCurrent = $levelInTree;

			$contentTreeHtml .= 	'<div class="containerOfTreeItems"  style="margin-left: '
					.(($levelInTree - $iLevelinTreeOriginPath +1)*$gapInInPx).'px">'
						.'<div onclick="openCloseFolder(this)" class="openCloseFolder"'
						.($classOfTreeItem === 'note' ? ' style="visibility:hidden"' : '').'>-</div>'
						.'<div class="treeItem '.$classOfTreeItem.'" id="'.$idNote.'">'
						.preg_replace('#\\n#', '<Br>',$donnees['content']).'</div></div>';
		}
	$reqRetrieveTree->closeCursor();		
	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
	
?>
		<script>var contentTreeHtml = '<?php echo preg_replace('#\'#',"\'",$contentTreeHtml);?>'</script>
		<script src="script_displayTreeInNewWindow.js"></script> <!--il n'y aura pas de j dans cette page non ? -->
	</body>
</html>
