<?php

session_start();

if (isset($_SESSION['id']) && isset($_GET["newNote"]) && isset($_GET["idTopic"])) {
	
	include '../../log_in_bdd.php';
	
	$idNote = "1a2a3";
	$nbOfItems = 0;
	$isCategory = "1";
	$levelInTree = 5;
	$rowOfNoteInCategory = 43;
	
	$req = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,NbOfItems,dateCreation,isCategory,levelInTree,rowOfNoteInCategory) VALUES (:idUser,:idTopic,:idNote,:newNote,:nbOfItems, NOW(),:isCategory,:levelInTree,:rowOfNoteInCategory)');

	//$req = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,NbOfItems,dateCreation,isCategory,levelInTree,rowOfNoteInCategory) VALUE(:idUser,:idTopic,:idNote,:newNote,:nbOfItems, CURDATE(),:isCategory,:levelInTree,:rowOfNoteInCategory');
	$req -> execute(array(
	'idUser' => $_SESSION['id'],
	'idTopic' => $_GET["idTopic"], 
	'idNote' => $idNote,
	'content' => $_GET["newNote"],
	'nbOfItems' => $nbOfItems,
	'isCategory' => $isCategory,
	'levelInTree' => $levelInTree,
	'rowOfNoteInCategory' => $rowOfNoteInCategory));

	$req->closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>