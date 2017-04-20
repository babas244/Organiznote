<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["pathToUpdateGeolocation"]) && isset($_GET["latitude"]) && isset($_GET["longitude"]) && isset($_GET["accuracyPosition"])) {
	
	if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["pathToUpdateGeolocation"]) &&  preg_match("#^-?[1-9]?[0-9]{1}.[0-9]+$#", $_GET["latitude"]) &&  preg_match("#^-?1?([1-9]?|0){2}.[0-9]+$#", $_GET["longitude"]) &&  preg_match("#^[0-9]+$#", $_GET["accuracyPosition"])) {
		
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';

		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$pathToUpdateGeolocation = htmlspecialchars($_GET["pathToUpdateGeolocation"]);
		$latitude = htmlspecialchars($_GET["latitude"]);
		$longitude = htmlspecialchars($_GET["longitude"]);
		$accuracyPosition = htmlspecialchars($_GET["accuracyPosition"]);
				
		// inserer la geoLocation
		$reqInsertTreeItemGeolocation = $bdd -> prepare('UPDATE notes 
										SET latitude=:latitude, longitude=:longitude, accuracyPosition=:accuracyPosition
										WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:pathToUpdateGeolocation');
			$reqInsertTreeItemGeolocation -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'latitude' => $latitude,
			'longitude' => $longitude,
			'accuracyPosition' => $accuracyPosition,
			'pathToUpdateGeolocation' => $pathToUpdateGeolocation)) or die(print_r($reqInsertTreeItemGeolocation->errorInfo()));
			$nbOfRowsAffected = $reqInsertTreeItemGeolocation->rowCount(); 
			if ($nbOfRowsAffected<1) {
				echo "error : ". $nbOfRowsAffected. " rows affected, while there should be at least 1.";
			}		
		$reqInsertTreeItemGeolocation -> closeCursor();	
	}
}
else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>