<?php

header("Content-Type: text/plain; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sLabels"]) && isset($_GET["oldRank"]) && isset($_GET["targetedRank"])) {
	
	if (preg_match("#^[0-9]{4}$#", $_GET["sLabels"]) && preg_match("#^[0-9]+$#", $_GET["oldRank"]) && preg_match("#^[0-9]+$#", $_GET["targetedRank"])) {
		
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';

		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sLabels = htmlspecialchars($_GET["sLabels"]);
		$aLabels = str_split($sLabels);
		$oldRank = intval(htmlspecialchars($_GET["oldRank"]));		
		$targetedRank = intval(htmlspecialchars($_GET["targetedRank"]));	

		//$position = $oldRank;
		//require 'checkToDoIsTheRightOne.php';
		
		/* 
		var_dump($oldRank);
		var_dump($sLabels);
		var_dump($targetedRank);
		 */
		// mettre à jour les positions
		if ($targetedRank > $oldRank) {
			$upperRank = $targetedRank;
			$lowerRank = $oldRank + 1;
			$increase = - 1;
			$newRank = $targetedRank;
		}
		else {
			$upperRank = $oldRank - 1;
			$lowerRank = $targetedRank + 1;
			$increase = 1;
			$newRank = $targetedRank + 1;
		}

/* 		var_dump($lowerRank);
		var_dump($upperRank);
		var_dump($newRank);
 */		
		// retrouver l'id du toDo à déplacer //         et vérifier avec son content tronqué qu'il n'y a pas de déplacement
		$reqRetrieveIdOldToDo = $bdd -> prepare('SELECT id FROM todolists
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3
		AND noteRank=:oldRank AND dateArchive IS NULL');
			$reqRetrieveIdOldToDo -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'oldRank' => $oldRank)) or die(print_r($reqRetrieveIdOldToDo->errorInfo())); 
			//echo ('<br>'.$reqRetrieveIdOldToDo->rowCount().' rangs affectés dans reqRetrieveIdOldToDo');

			$data = $reqRetrieveIdOldToDo->fetch();
			if (!$data) {
				echo "Le toDo ne peut pas être déplacé au niveau du serveur, car vous devez avoir ouvert et modifié cette page ailleurs.\n\nRecharger la page si vous voulez y arriver.";
				exit;
			}
			else {
				$idOldToDo = $data['id'];
			}
		$reqRetrieveIdOldToDo -> closeCursor();
		
		//echo "<Br>idOldToDo =".$idOldToDo;
		
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
		//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés dans 1');
		$reqUpdateToDo -> closeCursor();

		// updater oldRank en newRank
		$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET noteRank=:newRank
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 
		AND noteRank=:oldRank AND id=:idOldToDo');
			$reqUpdateToDo -> execute(array(
			'newRank' => $newRank,
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'oldRank'=> $oldRank,
			'idOldToDo' => $idOldToDo)) or die(print_r($reqUpdateToDo->errorInfo()));
		//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés dans reqUpdateToDo');
		$reqUpdateToDo -> closeCursor();
	}
}
else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>