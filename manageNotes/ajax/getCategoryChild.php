<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCategoriePere"])) { //changer en sPathParent 

	if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sCategoriePere"])) {
	
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sCategoriePere = htmlspecialchars($_GET["sCategoriePere"]);
		
		$reqRetrieveChildren = $bdd -> prepare('SELECT idNote, content, dateCreation FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote REGEXP :aTrouver AND idNote NOT LIKE :categoriepere ORDER BY idNote');
		$reqRetrieveChildren -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic, 
		'aTrouver' => '^'.$sCategoriePere.'([a-b][0-9]{2}$)',
		'categoriepere' => $sCategoriePere));

		

			$sTreeItemFetched = "";
			$i=0; // sert à rien non ? 
			$sTreeItemTypeFetched = "";
			
			while ($data = $reqRetrieveChildren->fetch()) {
				$sTreeItemTypeFetchedNew = substr($data['idNote'], -3, 1);
				//echo "nnn  ".$sTreeItemTypeFetchedNew;
				if ($sTreeItemTypeFetchedNew !== $sTreeItemTypeFetched or $i==0) {
				$sTreeItemFetched = substr($sTreeItemFetched, 0, -1).']},{"'.$sTreeItemTypeFetchedNew.'":[["'.$data['content'].'","'.$data['dateCreation'].'"],';
					$sTreeItemTypeFetched = $sTreeItemTypeFetchedNew;
				}
				else {
					$sTreeItemFetched .= '["'.$data['content'].'","'.$data['dateCreation'].'"],';
				}
				$i+=1;
			}

	echo $sTreeItemFetched = "[".substr(substr($sTreeItemFetched, 3),0,-1)."]}]"; //il faut enlever le dernier ","

		$reqRetrieveChildren->closeCursor();	
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>