<?php
header("Content-Type: text/html");
session_start();
 ?>

<!DOCTYPE html>
<html>
    <head>
        <title>Titre</title>
        <meta charset="utf-8" />
		<link rel="stylesheet" href="style_displayTreeInNewWindow.css" />
    </head>
    <body>


<?php

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sOriginPathTreeToDisplay"])) {

	include '../../log_in_bdd.php';
	
	$reqRetrieveTree = $bdd -> prepare('SELECT idNote, content FROM notes WHERE idUser=:idUser AND idTopic=:idTopic ORDER BY IdNote');
		$reqRetrieveTree -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"]));

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
