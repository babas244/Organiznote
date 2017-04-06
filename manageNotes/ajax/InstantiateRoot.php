<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {

	require '../../log_in_bdd.php';

	require '../../isIdTopicSafeAndMatchUser.php';
	
	$idTopic = htmlspecialchars($_GET["idTopic"]);
	
	$reqGetTopic = $bdd -> prepare('SELECT topic FROM topics WHERE idUser=:idUser AND id=:idTopic');
		$reqGetTopic -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic));
		
		$resultat = $reqGetTopic -> fetch();
		echo '{"topic":"'.$resultat['topic'].'"}';
	$reqGetTopic -> closeCursor();
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';
}
?> 