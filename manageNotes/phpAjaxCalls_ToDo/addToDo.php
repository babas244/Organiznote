<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["toDoContent"])) {
	
	include '../../log_in_bdd.php';

	$toDoContent = htmlspecialchars($_GET["toDoContent"]);
	
	// inserer la toDo
	$reqInsertToDo = $bdd -> prepare('INSERT INTO todolists(idUser,idTopic,idNote,content,dateCreation) VALUES (:idUser,:idTopic,:idNote,:newNote,NOW())');
		$reqInsertToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => "1000",
		'newNote' => $toDoContent)) or die(print_r($reqInsertToDo->errorInfo()));
	//echo ('<br>'.$reqInsertNote->rowCount().' rangs affectés');
	$reqInsertToDo -> closeCursor();	
	
	//renvoyer l'id et les composantes du nouveau toDo
	$reqFetchNewToDo = $bdd -> prepare('SELECT id, content, dateCreation, dateExpired FROM todolists WHERE idUser=:idUser AND idTopic=:idTopic AND content=:content');
		$reqFetchNewToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"],
		'content' => $toDoContent)) or die(print_r($reqFetchNewToDo->errorInfo()));
		//echo ('<br>'.$reqFetchNewToDo->rowCount().' rangs affectés');
		
		$toDoFetched = "{";
		
		while ($data = $reqFetchNewToDo->fetch()) {
		$toDoFetched .= '"'.$data['id'].'":["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'"],';
		}
	$reqFetchNewToDo -> closeCursor();	
		
	echo $toDoFetched == "{" ? "" : substr($toDoFetched, 0, -1)."}"; //il faut enlever le dernier ","
	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>