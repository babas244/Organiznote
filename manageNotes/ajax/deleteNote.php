<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain; charset=UTF-8");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCategoryToDelete"])) {

	if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sCategoryToDelete"])) {

		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sCategoryToDelete = htmlspecialchars($_GET["sCategoryToDelete"]);
		$sCategoryOfDad = substr($sCategoryToDelete,0,-3);
		
		// on efface la note
		$reqDeleteNote = $bdd -> prepare('DELETE FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idNoteToDelete');
			$reqDeleteNote -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'idNoteToDelete' => $sCategoryToDelete));
		$reqDeleteNote->closeCursor();

											
		// on update toutes les notes affect�s par le d�calage
		$sPathParent = $sCategoryOfDad;
		$sRankDeleted = $sCategoryToDelete;
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
	echo 'Une des variables n\'est pas d�finie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>