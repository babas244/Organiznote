<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["toDoContent"])) {
	
	include '../../log_in_bdd.php';

	$toDoContent = htmlspecialchars($_GET["toDoContent"]);
	
	// inserer la note
	$reqInsertToDo = $bdd -> prepare('INSERT INTO todolists(idUser,idTopic,idNote,content,dateCreation) VALUES (:idUser,:idTopic,:idNote,:newNote,NOW())');
		$reqInsertToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => "1000",
		'newNote' => $toDoContent)) or die(print_r($reqInsertToDo->errorInfo()));
	//echo ('<br>'.$reqInsertNote->rowCount().' rangs affectés');
	$reqInsertToDo -> closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>