<?php

header("Content-Type: text/plain; charset=UTF-8");

session_start();

if (isset($_SESSION['id'])) {
	if (isset($_GET["idTopic"]) && isset($_GET["sPath"]) && isset($_POST["sNewNote"]) && isset($_GET["dateCreation"])) {
	
		if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPath"]) && preg_match("#^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$#", $_GET["dateCreation"])) {

			require '../../log_in_bdd.php';

			require '../../isIdTopicSafeAndMatchUser.php';
			
			$idTopic = htmlspecialchars($_GET["idTopic"]);
			$sPath =  htmlspecialchars($_GET["sPath"]);
			$sNewNote = htmlspecialchars($_POST["sNewNote"]);
			$dateCreation = htmlspecialchars($_GET["dateCreation"]);
			
			require 'checkTreeItemIsTheRightOne.php';
			
			$reqUpdateContent = $bdd -> prepare('UPDATE notes SET content=:content, dateCreation=:dateCreation WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idNote'); // changer la date aussi ??
				$reqUpdateContent -> execute(array(
				'content' => $sNewNote,
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic, 
				'idNote' => $sPath,
				'dateCreation' => $dateCreation));
				$nbOfRowsAffected = $reqUpdateContent->rowCount(); 
				if ($nbOfRowsAffected!==1) {
					echo "error : ". $nbOfRowsAffected. " rows affected, while there should be only 1.";
				}
			$reqUpdateContent -> closeCursor();	
		}
	}
	else {
		echo "Une des variables n'est pas définie.";
	}
}
else {
	echo 'disconnected';	
}
?>