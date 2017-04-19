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
				echo $resultat['topic'];
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
	
	$reqRetrieveTree = $bdd -> prepare('SELECT idNote, content FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent ORDER BY IdNote');
		$reqRetrieveTree -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic,
		'startWithPathParent' => $sOriginPathTreeToDisplay.'%')) or die(print_r($reqRetrieveTree->errorInfo()));

	while ($donnees = $reqRetrieveTree->fetch()) {
			$classOfTreeItem = (substr($donnees['idNote'],-3,1)==="b" ? 'note' : 'folder');
			$levelInTree = (strlen($donnees['idNote'])+1)/3-1;
			echo ('<div class="level'.$levelInTree.' '.$classOfTreeItem.'">'.$donnees['content'].'</div>');
		}
	$reqRetrieveTree->closeCursor();		
	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
	
?>
		
		<script src="script_displayTreeInNewWindow.js"></script> <!--il n'y aura pas de j dans cette page non ? -->
	</body>
</html>
