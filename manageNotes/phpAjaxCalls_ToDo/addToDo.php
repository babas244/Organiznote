<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id'])) {
	if (isset($_GET["idTopic"]) && isset($_POST["toDoContent"]) && isset($_GET["dateCreation"]) && isset($_GET["sLabels"])) {
	
		if (preg_match("#^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$#", $_GET["dateCreation"]) && preg_match("#^[0-9]{4}$#", $_GET["sLabels"])) {
			
			require '../../log_in_bdd.php';

			require '../../isIdTopicSafeAndMatchUser.php';

			$toDoContent = htmlspecialchars($_POST["toDoContent"]);
			$sLabels = htmlspecialchars($_GET["sLabels"]); // utile ??
			$idTopic = htmlspecialchars($_GET["idTopic"]);
			$dateCreation = htmlspecialchars($_GET["dateCreation"]);
			
			$aLabels = str_split($sLabels);
			// compter le nombre de toDo avec ce sLabels
			$reqCountToDoHasLabels = $bdd -> prepare("SELECT COUNT(*) AS nbOfToDoHasLabels FROM todolists 
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND dateArchive IS NULL");
				$reqCountToDoHasLabels -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'label0' => $aLabels[0],
				'label1' => $aLabels[1],
				'label2' => $aLabels[2],
				'label3' => $aLabels[3])) or die(print_r($reqCountToDoHasLabels->errorInfo()));
				//echo ('<br>'.$reqCountToDoHasLabels->rowCount().' rangs affectés');
			while ($data = $reqCountToDoHasLabels->fetch()) {
				$nbOfToDoHasLabels = $data['nbOfToDoHasLabels'];
			}
			$reqCountToDoHasLabels -> closeCursor();
					
			//echo $nbOfToDoHasLabels;
			
			// inserer la toDo
			$reqInsertToDo = $bdd -> prepare('INSERT INTO todolists(idUser,idTopic,noteRank,content,dateCreation,label0,label1,label2,label3) 
			VALUES (:idUser,:idTopic,:noteRank,:newNote,:dateCreation,:label0,:label1,:label2,:label3)');
				$reqInsertToDo -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'noteRank' => $nbOfToDoHasLabels,
				'newNote' => $toDoContent,
				'dateCreation' => $dateCreation,
				'label0' => $aLabels[0],
				'label1' => $aLabels[1],
				'label2' => $aLabels[2],
				'label3' => $aLabels[3])) or die(print_r($reqInsertToDo->errorInfo()));
			//echo ('<br>'.$reqInsertToDo->rowCount().' rangs affectés');
			$reqInsertToDo -> closeCursor();	
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