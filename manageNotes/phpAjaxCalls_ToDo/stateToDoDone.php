<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["idInDdb"])) {
	
	include '../../log_in_bdd.php';

	include '../../isIdTopicSafeAndMatchUser.php';
	
	$idInDdb = htmlspecialchars($_GET["idInDdb"]);
	
	// mettre dateArchive de la toDo �gale � NOW()
	$reqArchiveToDo = $bdd -> prepare('UPDATE todolists SET dateArchive=NOW() WHERE idUser=:idUser AND idTopic=:idTopic AND id=:idInDdb');
		$reqArchiveToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idInDdb' => $idInDdb)) or die(print_r($reqArchiveToDo->errorInfo()));
	//echo ('<br>'.$reqInsertNote->rowCount().' rangs affect�s');
	$reqArchiveToDo -> closeCursor();	
}

else {
	echo 'Une des variables n\'est pas d�finie ou la session n\'est pas ouverte !!!';	
}
?>