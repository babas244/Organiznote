<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain; charset=UTF-8");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sPath"])) {

	if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPath"])) {

		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sPath = htmlspecialchars($_GET["sPath"]);
		$sCategoryOfDad = substr($sPath,0,-3);
		
		require 'checkTreeItemIsTheRightOne.php';
		
		// on efface sPath et ses descendants
		$reqDeleteChildren = $bdd -> prepare('DELETE FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote lIKE :idNoteToDelete');
			$reqDeleteChildren -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'idNoteToDelete' => $sPath."%"));
		$reqDeleteChildren->closeCursor();	// att ! 01% efface aussi 01, ce qui sera interdit si 01 devient la racine. pour éviter ça on effacer 01a%, mais cela  n'inclut que les folders, mais de risque car il n'y a pas d'appel de deleteNote pour la racine
											
		// on update tous les items affectés par le décalage
		$sPathParent = $sCategoryOfDad;
		$sRankDeleted = $sPath;
		$nRankDeleted = intval(substr($sRankDeleted,-2));
		$lengthPathParent = strlen($sPathParent);
		$reqUpdateSiblingsAndChildren = $bdd -> prepare('	UPDATE notes 
								SET idNote=CONCAT(:pathParent, "a" , LPAD((SUBSTRING(idNote,:lengthPathParent+2,2)-1),2,"0"),SUBSTRING(idNote,:lengthPathParent + 4)) 
								WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND convert(SUBSTRING(idNote,:lengthPathParent+2,2),signed) > :nRankDeleted');
		$reqUpdateSiblingsAndChildren -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'pathParent' => $sPathParent,
			'lengthPathParent' => $lengthPathParent,
			'startWithPathParent' => $sPathParent.'a%',
			'nRankDeleted' => $nRankDeleted));		
		$reqUpdateSiblingsAndChildren->closeCursor();  // attention la requete concerne les folders ET les notes 
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>