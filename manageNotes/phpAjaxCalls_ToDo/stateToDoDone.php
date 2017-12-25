<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["dateArchive"])&& isset($_GET["dateCreation"]) && isset($_GET["sLabels"]) && isset($_GET["position"])) {
	
	if (preg_match("#^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:00$#", $_GET["dateArchive"]) && preg_match("#^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$#", $_GET["dateCreation"]) && preg_match("#^[0-9]{4}$#", $_GET["sLabels"]) && preg_match("#^[0-9]+$#", $_GET["position"])) {

		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$dateArchive = htmlspecialchars($_GET["dateArchive"]);
		$dateCreation = htmlspecialchars($_GET["dateCreation"]);		
		$sLabels = htmlspecialchars($_GET["sLabels"]); 
		$aLabels = str_split($sLabels);
		$position = htmlspecialchars($_GET["position"]);

		require 'checkToDoIsTheRightOne.php';
		
		// mettre dateArchive de la toDo égale à NOW()
		$reqArchiveToDo = $bdd -> prepare('UPDATE todolists SET dateArchive=:dateArchive, dateCreation=:dateCreation WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND dateArchive IS NULL AND noteRank=:NoteRank');
			$reqArchiveToDo -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'dateArchive' => $dateArchive,
			'dateCreation' => $dateCreation,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'NoteRank'=> $position)) or die(print_r($reqArchiveToDo->errorInfo()));
		//echo ('<br>'.$reqArchiveToDo->rowCount().' rangs affectés');
		$reqArchiveToDo -> closeCursor();	

		// mettre à jour les positions
		$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET noteRank = noteRank - 1
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND dateArchive IS NULL AND noteRank > :oldNoteRank');
			$reqUpdateToDo -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'oldNoteRank'=> $position)) or die(print_r($reqUpdateToDo->errorInfo()));
		//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés');
		$reqUpdateToDo -> closeCursor();
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>