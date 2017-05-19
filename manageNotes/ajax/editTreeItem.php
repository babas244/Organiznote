<?php

header("Content-Type: text/plain; charset=UTF-8");

session_start();

if (isset($_SESSION['id'])&& isset($_GET["idTopic"]) && isset($_GET["sPathToEdit"]) && isset($_GET["sNewNote"])) {
	
	if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPathToEdit"])) {

		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sPathToEdit =  htmlspecialchars($_GET["sPathToEdit"]);
		$sNewNote = htmlspecialchars($_GET["sNewNote"]);
		
		$reqUpdateContent = $bdd -> prepare('UPDATE notes SET content=:content WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idNote'); // changer la date aussi ??
			$reqUpdateContent -> execute(array(
			'content' => $sNewNote,
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'idNote' => $sPathToEdit));
			$nbOfRowsAffected = $reqUpdateContent->rowCount(); 
			if ($nbOfRowsAffected!==1) {
				echo "error : ". $nbOfRowsAffected. " rows affected, while there should be only 1.";
			}
		$reqUpdateContent -> closeCursor();	
	}
}
else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>