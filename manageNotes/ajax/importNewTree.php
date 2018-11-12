<?php

header("Content-Type: text/html;charset=UTF-8");

session_start();

if (isset($_SESSION['id'])) {
	if (isset($_GET["idTopic"]) && isset($_POST["sTreeItems"])) {
				
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$idUser = $_SESSION['id'];
		
		$aJSON = json_decode($_POST["sTreeItems"]);
		
		$aValuesPurified = array();
		$rank = 0;
		$valuesQuestionsMarks = '';
		$isIdNoteOk = true;
		$isDateOk = true;
		$isLatitudeOk = true;
		$isLongitudeOk = true;
		$isAccuracyPositionOk = true; 
				
		for ($i = 0 ; $i < count($aJSON) ; $i++) {
			$valuesQuestionsMarks .= '(?,?,?,?,?,?,?,?),';

			$aValuesPurified[$rank] = $idUser;
			$aValuesPurified[$rank+1] = $idTopic;
			
			$idNote = htmlspecialchars($aJSON[$i][0]);
			if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $idNote)) {
				$aValuesPurified[$rank+2] = $idNote;
			}
			else {
				$isIdNoteOk = false;
			}
			
			$aValuesPurified[$rank+3] = htmlspecialchars($aJSON[$i][1]); // content
			
			$dateCreation = htmlspecialchars($aJSON[$i][2]);
			if (preg_match("#^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$#", $dateCreation)) {
				$aValuesPurified[$rank+4] = $dateCreation;
			}
			else {
				$isDateOk = false;
			}
			
			$latitude = htmlspecialchars($aJSON[$i][3]);
			if ($latitude ==='') {
				$aValuesPurified[$rank+5] = null;					
			}
			else if (preg_match("#^-?[0-9]{1,2}\.[0-9]{8}$#", $latitude) && floatval($latitude) <= 90 && floatval($latitude) >=-90) {
				$aValuesPurified[$rank+5] = $latitude;
			}
			else {
				$isLatitudeOk = false;
			}
					
			$longitude = htmlspecialchars($aJSON[$i][4]);
			if ($longitude ==='') {
				$aValuesPurified[$rank+6] = null;					
			}
			else if (preg_match("#^-?[0-9]{1,3}\.[0-9]{8}$#", $longitude) && floatval($longitude) <= 180 && floatval($longitude) >=-180) {
				$aValuesPurified[$rank+6] = $longitude;
			}
			else {
				$isLongitudeOk = false;
			}
			
			$accuracyPosition = htmlspecialchars($aJSON[$i][5]);
			if ($accuracyPosition ==='') {
				$aValuesPurified[$rank+7] = null;					
			}
			else if (preg_match("#^[0-9]*$#", $accuracyPosition)) {
				$aValuesPurified[$rank+7] = $accuracyPosition;
			}
			else {
				$isAccuracyPositionOk = false;
			}
			
			$rank += 8;
		}
		$valuesQuestionsMarks = substr($valuesQuestionsMarks, 0 , -1);
		
		if (!$isIdNoteOk || !$isDateOk || !$isLatitudeOk || !$isLongitudeOk || !$isAccuracyPositionOk) {
			echo "Fichier corrompu : "
			.(!$isIdNoteOk ? " un idNote au moins n'est pas correct\n" : "")
			.(!$isDateOk ? " une date au moins n'est pas correcte\n" : "")
			.(!$isLatitudeOk ? " une latitude au moins n'est pas correcte\n" : "")
			.(!$isLongitudeOk ? " une longitude au moins n'est pas correcte\n" : "")
			.(!$isAccuracyPositionOk ? " une précision de position au moins n'est pas correcte\n" : "");				
		}
		else {
			// inserer la nouvelle branche du tree
			$reqImportTree = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,dateCreation,latitude,longitude,accuracyPosition) VALUES '.$valuesQuestionsMarks);
				$reqImportTree -> execute($aValuesPurified) or die(print_r($reqImportTree->errorInfo()));
			//echo ('<br>'.$reqImportTree->rowCount().' rangs affectés');
			$reqImportTree -> closeCursor();										
		}
	}
	else {
		echo "Une des variables n'est pas définie.";
	}
}
else {
	echo 'disconnected';	
}