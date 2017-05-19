<?php

header("Content-Type: text/plain; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sLabels"]) && isset($_GET["position"])) {
	
	if (preg_match("#^[0-9]{4}$#", $_GET["sLabels"]) && preg_match("#^[0-9]+$#", $_GET["position"])) {
				
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sLabels = htmlspecialchars($_GET["sLabels"]); 
		$aLabels = str_split($sLabels);
		$position = htmlspecialchars($_GET["position"]);
		//echo $sLabels."   ".$position;
	
		// effacer la toDo
		$reqDeleteToDo = $bdd -> prepare('DELETE FROM todolists 
			WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND noteRank=:NoteRank');
			$reqDeleteToDo -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'NoteRank'=> $position)) or die(print_r($reqDeleteToDo->errorInfo()));
		//echo ('<br>'.$reqDeleteToDo->rowCount().' rangs affectés');
		$reqDeleteToDo -> closeCursor();	

		// mettre à jour les positions
		$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET noteRank = noteRank - 1
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND noteRank > :oldNoteRank');
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
	echo 'error inattendue dans deleteToDo.php : Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>