<?php
header("Content-Type: text/html");
session_start();
require '../../log_in_bdd.php';
require '../../isIdTopicSafeAndMatchUser.php';
$idTopic = htmlspecialchars($_GET["idTopic"]);
 ?>

<!DOCTYPE html>
<html>
    <head>
        <title>
		</title>
        <meta charset="utf-8" />
		<link rel="stylesheet" href="style_displayTreeInNewWindow.css" />
    </head>
    <body>


<?php

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sParentPathOfTreeToExport"])) {
	
	$sParentPathOfTreeToExport = htmlspecialchars($_GET["sParentPathOfTreeToExport"]);
	
	$reqRetrieveTree = $bdd -> prepare('SELECT idNote, content, dateCreation  FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND NOT LIKE :pathParent ORDER BY IdNote');
		$reqRetrieveTree -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic,
		'startWithPathParent' => $sParentPathOfTreeToExport.'%',
		'pathParent' => $sParentPathOfTreeToExport)) or die(print_r($reqRetrieveTree->errorInfo()));

		while ($donnees = $reqRetrieveTree->fetch()) {
			echo ('{"'.$donnees['idNote'].'":["'.$donnees['content'].'","'.$donnees['dateCreation'].'"]}');
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
