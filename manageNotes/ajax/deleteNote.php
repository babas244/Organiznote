<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain; charset=UTF-8");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id'])) {
	
	if (isset($_GET["idTopic"]) && isset($_GET["sPath"])) {

		if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPath"])) {

			require '../../log_in_bdd.php';

			require '../../isIdTopicSafeAndMatchUser.php';
			
			$idTopic = htmlspecialchars($_GET["idTopic"]);
			$sPath = htmlspecialchars($_GET["sPath"]);
			$sCategoryOfDad = substr($sPath,0,-3);
			
			// on efface la note
			$reqDeleteNote = $bdd -> prepare('DELETE FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idNoteToDelete');
				$reqDeleteNote -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic, 
				'idNoteToDelete' => $sPath));
			$reqDeleteNote->closeCursor();

			require 'checkTreeItemIsTheRightOne.php';
												
			// on update toutes les notes affectés par le décalage
			$sPathParent = $sCategoryOfDad;
			$sRankDeleted = $sPath;
			$nRankDeleted = intval(substr($sRankDeleted,-2));
			$lengthPathParent = strlen($sPathParent);
			$reqUpdateSiblings = $bdd -> prepare('	UPDATE notes 
									SET idNote=CONCAT(:pathParent, "b" , LPAD((SUBSTRING(idNote,:lengthPathParent+2,2)-1),2,"0"),SUBSTRING(idNote,:lengthPathParent + 4)) 
									WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND convert(SUBSTRING(idNote,:lengthPathParent+2,2),signed) > :nRankDeleted');
			$reqUpdateSiblings -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic,
				'pathParent' => $sPathParent,
				'lengthPathParent' => $lengthPathParent,
				'startWithPathParent' => $sPathParent.'b%',
				'nRankDeleted' => $nRankDeleted));		
			$reqUpdateSiblings->closeCursor();  // attention la requete concerne les folders ET les notes 									
		}
	}
	else {
		echo "Une des variables n'est pas définie.";
	}
}
else {
	echo 'disconnected';	
}?>