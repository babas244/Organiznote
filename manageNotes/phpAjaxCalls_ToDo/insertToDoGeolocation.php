<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sLabels"]) && isset($_GET["position"]) && isset($_GET["latitude"]) && isset($_GET["longitude"]) && isset($_GET["accuracyPosition"])) {
	
	if (preg_match("#^[0-9]{4}$#", $_GET["sLabels"]) && preg_match("#^[0-9]+$#", $_GET["position"]) &&  preg_match("#^-?[1-9]?[0-9]{1}.[0-9]+$#", $_GET["latitude"]) &&  preg_match("#^-?1?([1-9]?|0){2}.[0-9]+$#", $_GET["longitude"]) &&  preg_match("#^[0-9]+$#", $_GET["accuracyPosition"])) {
		
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';

		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sLabels = htmlspecialchars($_GET["sLabels"]);
		$position = htmlspecialchars($_GET["position"]);
		$latitude = htmlspecialchars($_GET["latitude"]);
		$longitude = htmlspecialchars($_GET["longitude"]);
		$accuracyPosition = htmlspecialchars($_GET["accuracyPosition"]);
		
		$aLabels = str_split($sLabels);
		
		// inserer la geoLocation
		$reqInsertToDoGeolocation = $bdd -> prepare('UPDATE todolists 
										SET latitude=:latitude, longitude=:longitude, accuracyPosition=:accuracyPosition
										WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 
										AND label3=:label3 AND dateArchive IS NULL AND noteRank=:noteRank');
			$reqInsertToDoGeolocation -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'latitude' => $latitude,
			'longitude' => $longitude,
			'accuracyPosition' => $accuracyPosition,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'noteRank' => $position)) or die(print_r($reqInsertToDoGeolocation->errorInfo()));
			$nbOfRowsAffected = $reqInsertToDoGeolocation->rowCount(); 
			if ($nbOfRowsAffected<1) {
				echo "error : ". $nbOfRowsAffected. " rows affected, while there should be at least 1.";
			}		
		$reqInsertToDoGeolocation -> closeCursor();	
	}
}
else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>