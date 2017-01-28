<?php

header("Content-Type: text/plain");

session_start();

//echo '$_SESSION["id"] = '.$_SESSION['id'];

if (isset($_SESSION['id']) && isset($_GET["newNote"]) && isset($_GET["idTopic"]) && isset($_GET["sPathTreeItemToInsert"])) {
	
	//echo "coucou dans insertNewNote ! ";
	
	//echo '$_GET["idTopic"]= '.$_GET["idTopic"];
	
	include '../../log_in_bdd.php';

	$newNote = htmlspecialchars($_GET["newNote"]);
	
	// inserer la note
	$reqInsertNote = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,dateCreation) VALUES (:idUser,:idTopic,:idNote,:newNote,NOW())');
		$reqInsertNote -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => $_GET["sPathTreeItemToInsert"],
		'newNote' => $newNote)) or die(print_r($reqInsertNote->errorInfo()));
	//echo ('<br>'.$reqInsertNote->rowCount().' rangs affectés');
	$reqInsertNote -> closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>