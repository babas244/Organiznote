<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["idInDdb"])) {
	
	include '../../log_in_bdd.php';

	$idInDdb = htmlspecialchars($_GET["idInDdb"]);
	
	// effacer la toDo
	$reqDeleteToDo = $bdd -> prepare('DELETE FROM todolists WHERE idUser=:idUser AND idTopic=:idTopic AND id=:idInDdb');
		$reqDeleteToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idInDdb' => $idInDdb)) or die(print_r($reqDeleteToDo->errorInfo()));
	//echo ('<br>'.$reqInsertNote->rowCount().' rangs affectés');
	$reqDeleteToDo -> closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>