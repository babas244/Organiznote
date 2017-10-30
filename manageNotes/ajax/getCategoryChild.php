<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id'])) {
	
	if (isset($_GET["idTopic"]) && isset($_GET["sPathParent"])) {

		if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPathParent"])) {
		
			require '../../log_in_bdd.php';

			require '../../isIdTopicSafeAndMatchUser.php';
			
			$idTopic = htmlspecialchars($_GET["idTopic"]);
			$sPathParent = htmlspecialchars($_GET["sPathParent"]);
			
			$reqRetrieveChildren = $bdd -> prepare('SELECT idNote, content, dateCreation FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote REGEXP :toFind AND idNote NOT LIKE :pathParent ORDER BY idNote');
			$reqRetrieveChildren -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'toFind' => '^'.$sPathParent.'([a-b][0-9]{2}$)',
			'pathParent' => $sPathParent));

			//echo $reqRetrieveChildren->rowCount();

			$arrayJSON = array();
			$arrayJSON['a']= array();
			$arrayJSON['b']= array();
			$ia = 0;
			$ib = 0;
			
			while ($data = $reqRetrieveChildren->fetch()) {
				$sTreeItemsTypeFetched = substr($data['idNote'], -3, 1);		
				$sTreeItemsTypeFetched === "a" ? $i = $ia : $i= $ib;	
				if ($i===0) {
					$arrayJSON[$sTreeItemsTypeFetched][$i] = array();
				}
				$arrayJSON[$sTreeItemsTypeFetched][$i][0] = htmlspecialchars_decode($data['content']);
				$arrayJSON[$sTreeItemsTypeFetched][$i][1] = $data['dateCreation'];
				$sTreeItemsTypeFetched == "a" ? $ia+=1 : $ib+=1;
			}
			echo json_encode($arrayJSON);

			$reqRetrieveChildren->closeCursor();	
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