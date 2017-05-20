<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sLabels"]) && isset($_GET["oldRank"]) && isset($_GET["targetedRank"])) {
	
	if (preg_match("#^[0-9]{4}$#", $_GET["sLabels"]) && preg_match("#^[0-9]+$#", $_GET["oldRank"]) && preg_match("#^[0-9]+$#", $_GET["targetedRank"])) {
		
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';

		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sLabels = htmlspecialchars($_GET["sLabels"]);
		$aLabels = str_split($sLabels);
		$oldRank = htmlspecialchars($_GET["oldRank"]);		
		$targetedRank = htmlspecialchars($_GET["targetedRank"]);		

		// mettre à jour les positions
		if ($targetedRank > $oldRank) {
			$upperRank = $targetedRank - 1;
			$lowerRank = $oldRank;
			$increase = 1;
			$newRank = $targetedRank;
		}
		else {
			$upperRank = $oldRank;
			$lowerRank = $targetedRank + 1;
			$increase = -1;
			$newRank = $targetedRank + 1;
		}
		
		$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET noteRank = noteRank + :increase 
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3
		AND noteRank BETWEEN :lowerRank AND :upperRank');
			$reqUpdateToDo -> execute(array(
			'increase' => $increase,
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'lowerRank' => $lowerRank, 
			'upperRank' => $upperRank)) or die(print_r($reqUpdateToDo->errorInfo())); 
		//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés');
		$reqUpdateToDo -> closeCursor();

		// updater oldRank en newRank
		$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET noteRank=:newRank
		WHERE Iduser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 
		AND noteRank=:oldRank');
			$reqUpdateToDo -> execute(array(
			'newRank' => $newRank,
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'noteRank' => $targetedRank,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'oldRank'=> $oldRank)) or die(print_r($reqUpdateToDo->errorInfo()));
		//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés');
		$reqUpdateToDo -> closeCursor();
	}
}
else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>