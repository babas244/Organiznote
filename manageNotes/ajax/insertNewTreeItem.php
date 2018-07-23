<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_POST["newNote"])&& isset($_GET["sPathTreeItemToInsert"])) {
	
	if ((preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPathTreeItemToInsert"]))) {
		
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$newNote = htmlspecialchars($_POST["newNote"]);
		$sPathTreeItemToInsert = htmlspecialchars($_GET["sPathTreeItemToInsert"]);
		
		// inserer la note
		$reqInsertNote = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,dateCreation) VALUES (:idUser,:idTopic,:idNote,:newNote,NOW())');
			$reqInsertNote -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'idNote' => $sPathTreeItemToInsert,
			'newNote' => $newNote)) or die(print_r($reqInsertNote->errorInfo()));
		//echo ('<br>'.$reqInsertNote->rowCount().' rangs affectés');
		$reqInsertNote -> closeCursor();	
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>