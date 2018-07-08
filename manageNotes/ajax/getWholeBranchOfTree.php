<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id'])) {
	
	if (isset($_GET["idTopic"]) && isset($_GET["originPath"])) {

		if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["originPath"])) {
		
			require '../../log_in_bdd.php';

			require '../../isIdTopicSafeAndMatchUser.php';
			
			$idTopic = htmlspecialchars($_GET["idTopic"]);
			$originPath = htmlspecialchars($_GET["originPath"]);
			
			$reqRetrieveTree = $bdd -> prepare('SELECT idNote, content, dateCreation FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent ORDER BY IdNote');
				$reqRetrieveTree -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'startWithPathParent' => $originPath.'%')) or die(print_r($reqRetrieveTree->errorInfo()));
			
				$arrayJSON = array();
				$i = 0;
				
				while ($donnees = $reqRetrieveTree->fetch()) {
					 $arrayJSON[$i] = array();
					 $arrayJSON[$i][0] = $donnees['idNote'];
					 $arrayJSON[$i][1] = $donnees['content'];
					 $arrayJSON[$i][2] = $donnees['dateCreation'];
					 $i += 1;
				}
			$reqRetrieveTree->closeCursor();		
			
			echo json_encode($arrayJSON);
		}
	}
	else {
		echo 'Une des variables n\'est pas définie.';
	}
}
else {
	echo 'disconnected';
}
?>