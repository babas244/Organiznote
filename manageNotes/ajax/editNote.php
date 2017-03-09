<?php

header("Content-Type: text/plain");

session_start();

//echo '$_SESSION["id"] = '.$_SESSION['id'];

if (isset($_SESSION['id'])&& isset($_GET["idTopic"]) && isset($_GET["sIdCategoryToEdit"]) && (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sIdCategoryToEdit"])) && isset($_GET["sNewNote"])) {
	
	include '../../log_in_bdd.php';

	include '../../isIdTopicSafeAndMatchUser.php';
	
	$sNewNote = htmlspecialchars($_GET["sNewNote"]);
	
	$reqUpdateContent = $bdd -> prepare('UPDATE notes SET content=:content WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idNote'); // changer la date aussi ??
		$reqUpdateContent -> execute(array(
		'content' => $sNewNote,
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => $_GET["sIdCategoryToEdit"]));
	$reqUpdateContent -> closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>