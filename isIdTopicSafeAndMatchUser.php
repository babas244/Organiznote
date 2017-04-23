<?php 
if (preg_match("#^[0-9]+$#", $_GET["idTopic"])) {
	//echo("coucou");
	$reqIsTopicMatching = $bdd -> prepare('SELECT topic FROM topics WHERE idUser=:idUser AND id=:idTopic');
		$reqIsTopicMatching -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET['idTopic']));
		$resultat = $reqIsTopicMatching -> fetch();
	if ($reqIsTopicMatching->rowCount() == 0) {
		header("Location: ../../logout.php");
	}
	$reqIsTopicMatching -> closeCursor();
}
else {
	require_once 'define CONSTANT domain.php';
	header('Location: '. DOMAIN .'/Organiznotes/logout.php');
}
?>