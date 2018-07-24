<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id'])) {
	if (isset($_GET["idTopic"]) && isset($_POST["newNote"]) && isset($_GET["sPathParent"]) && isset($_GET['itemType']) && isset($_GET["rankClientSide"]) && isset($_GET["dateCreation"])) {
	
		if ((preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPathParent"])) && preg_match("#^[a-b]$#", $_GET["itemType"]) && preg_match("#^[0-9]+$#", $_GET["rankClientSide"]) && preg_match("#^[12][09][0-9]{2}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$#", $_GET["dateCreation"])) {
			
			require '../../log_in_bdd.php';

			require '../../isIdTopicSafeAndMatchUser.php';
			
			$idTopic = htmlspecialchars($_GET["idTopic"]);
			$newNote = htmlspecialchars($_POST["newNote"]);
			$sPathParent = htmlspecialchars($_GET["sPathParent"]);
			$iRankClientSide = intval(htmlspecialchars($_GET["rankClientSide"]));
			$dateCreation = htmlspecialchars($_GET["dateCreation"]);
			$pathStartsBy = $sPathParent.htmlspecialchars($_GET["itemType"]);
			
			//compter le nb d'enfant de sPathParent
			$reqCountItems = $bdd -> prepare('SELECT COUNT(*) AS nbOfItems FROM notes
				WHERE idUser=:idUser AND idTopic=:idTopic 
				AND idNote REGEXP :toFind
				AND dateArchive IS NULL');		
				$reqCountItems -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic, 
				'toFind' => '^'.$pathStartsBy.'([0-9]{2}$)')) or die(print_r($reqCountItems->errorInfo()));
				while ($data = $reqCountItems->fetch()) {
					$iNbOfItems = intval($data['nbOfItems']);
				}
			$reqCountItems -> closeCursor();	
			
			$sPathTreeItemToInsert = $pathStartsBy.XX($iNbOfItems+1);

			// inserer la note
			$reqInsertNote = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,dateCreation) VALUES (:idUser,:idTopic,:idNote,:newNote,:dateCreation)');
				$reqInsertNote -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic, 
				'idNote' => $sPathTreeItemToInsert,
				'newNote' => $newNote,
				'dateCreation' => $dateCreation)) or die(print_r($reqInsertNote->errorInfo()));
			//echo ('<br>'.$reqInsertNote->rowCount().' rangs affectés');
			$reqInsertNote -> closeCursor();	
			
			 
			//Vérifier que rankClientSide est bien en accord, sinon demander côté client de rafraichir la page
			if ($iRankClientSide !== $iNbOfItems+1) {
				echo 'reload';
			}
		}
	}
	else {
		echo "Une des variables n'est pas définie.";
	}
}
else {
	echo 'disconnected';	
}

function XX($integer) {
	return $integer>9 ? "".$integer : "0".$integer;
}
?>