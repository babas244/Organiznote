<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["toDoContent"])  && isset($_GET["sLabelsAndPositionToDoFocused"]) && isset($_GET["sNewLabels"])) {
	
	if (preg_match("#^[0-9]{5}$#", $_GET["sLabelsAndPositionToDoFocused"]) && preg_match("#^[0-9]{4}$#", $_GET["sNewLabels"])) {
		
		include '../../log_in_bdd.php';

		include '../../isIdTopicSafeAndMatchUser.php';

		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$toDoContent = htmlspecialchars($_GET["toDoContent"]);
		$sLabelsAndPositionToDoFocused = htmlspecialchars($_GET["sLabelsAndPositionToDoFocused"]);
		$sNewLabels = htmlspecialchars($_GET["sNewLabels"]); // utile ??
		
		$aLabelsAndPositionToDoFocused = str_split($sLabelsAndPositionToDoFocused);
		$positionToDoFocused = $aLabelsAndPositionToDoFocused[4];
		
		//$aNewLabels = array(); //nécessaire ??
		$aNewLabels = str_split($sNewLabels);
		if ($aLabelsAndPositionToDoFocused[0] == $aNewLabels[0] && $aLabelsAndPositionToDoFocused[1] == $aNewLabels[1] && $aLabelsAndPositionToDoFocused[2] == $aNewLabels[2] && $aLabelsAndPositionToDoFocused[3] == $aNewLabels[3]) {
			
			// on n'a donc pas changé de sLabels, on udpate que le content		
			$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET content=:newNote
			WHERE Iduser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND noteRank=:NoteRank');
				$reqUpdateToDo -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'newNote' => $toDoContent,
				'label0' => $aLabelsAndPositionToDoFocused[0],
				'label1' => $aLabelsAndPositionToDoFocused[1],
				'label2' => $aLabelsAndPositionToDoFocused[2],
				'label3' => $aLabelsAndPositionToDoFocused[3],
				'NoteRank'=> $positionToDoFocused)) or die(print_r($reqUpdateToDo->errorInfo()));
			//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés');
			$reqUpdateToDo -> closeCursor();	
		} 
		else { // on a changé de sLabels 
			// Il faut préparer la MAJ des positions : d'abord compter le nombre de toDo avec du nouveau sLabels
			$reqCountToDoNewLabels = $bdd -> prepare("SELECT COUNT(*) AS nbOfToDoNewLabels FROM todolists 
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND dateArchive IS NULL");
				$reqCountToDoNewLabels -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'label0' => $aNewLabels[0],
				'label1' => $aNewLabels[1],
				'label2' => $aNewLabels[2],
				'label3' => $aNewLabels[3])) or die(print_r($reqCountToDoNewLabels->errorInfo()));
				//echo ('<br>'.$reqCountToDoNewLabels->rowCount().' rangs affectés');
			while ($data = $reqCountToDoNewLabels->fetch()) {
				$nbOfToDoNewLabels = $data['nbOfToDoNewLabels'];
			}
			$reqCountToDoNewLabels -> closeCursor();
					
			//echo $nbOfToDoNewLabels;
			
			// updater les contenus, avec la nouvelle position
			$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET noteRank=:noteRank,content=:newNote,label0=:newLabel0,label1=:newLabel1,label2=:newLabel2,label3=:newLabel3
			WHERE Iduser=:idUser AND idTopic=:idTopic AND label0=:oldLabel0 AND label1=:oldLabel1 AND label2=:oldLabel2 AND label3=:oldLabel3 AND noteRank=:oldNoteRank');
				$reqUpdateToDo -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'noteRank' => $nbOfToDoNewLabels,
				'newNote' => $toDoContent,
				'newLabel0' => $aNewLabels[0],
				'newLabel1' => $aNewLabels[1],
				'newLabel2' => $aNewLabels[2],
				'newLabel3' => $aNewLabels[3],
				'oldLabel0' => $aLabelsAndPositionToDoFocused[0],
				'oldLabel1' => $aLabelsAndPositionToDoFocused[1],
				'oldLabel2' => $aLabelsAndPositionToDoFocused[2],
				'oldLabel3' => $aLabelsAndPositionToDoFocused[3],
				'oldNoteRank'=> $positionToDoFocused)) or die(print_r($reqUpdateToDo->errorInfo()));
			//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés');
			$reqUpdateToDo -> closeCursor();
			
			// mettre à jour les positions
			$reqUpdateToDo = $bdd -> prepare('UPDATE todolists SET noteRank = noteRank - 1
			WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND noteRank > :oldNoteRank');
				$reqUpdateToDo -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'label0' => $aLabelsAndPositionToDoFocused[0],
				'label1' => $aLabelsAndPositionToDoFocused[1],
				'label2' => $aLabelsAndPositionToDoFocused[2],
				'label3' => $aLabelsAndPositionToDoFocused[3],
				'oldNoteRank'=> $positionToDoFocused)) or die(print_r($reqUpdateToDo->errorInfo()));
			//echo ('<br>'.$reqUpdateToDo->rowCount().' rangs affectés');
			$reqUpdateToDo -> closeCursor();
			
		}
	}
}
else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>