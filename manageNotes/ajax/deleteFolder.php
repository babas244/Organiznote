<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCategoryToDelete"]) && (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sCategoryToDelete"]))) {

	include '../../log_in_bdd.php';
	
	$sCategoryOfDad = substr($_GET["sCategoryToDelete"],0,-3);
	
	// on efface sCategoryToDelete et ses descendants
	$reqDeleteChildren = $bdd -> prepare('DELETE FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote lIKE :idNoteToDelete');
		$reqDeleteChildren -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNoteToDelete' => $_GET["sCategoryToDelete"]."%"));
	$reqDeleteChildren->closeCursor();	// att ! 01% efface aussi 01, ce qui sera interdit si 01 devient la racine. pour éviter ça on effacer 01a%, mais cela  n'inclut que les folders, mais de risque car il n'y a pas d'appel de deleteNote pour la racine
										
	// on update tous les items affectés par le décalage
	$sPathParent = $sCategoryOfDad;
	$sRankDeleted = $_GET["sCategoryToDelete"];
	$nRankDeleted = intval(substr($sRankDeleted,-2));
	$lengthPathParent = strlen($sPathParent);
	$reqUpdateSiblingsAndChildren = $bdd -> prepare('	UPDATE notes 
							SET idNote=CONCAT(:pathParent, "a" , LPAD((SUBSTRING(idNote,:lengthPathParent+2,2)-1),2,"0"),SUBSTRING(idNote,:lengthPathParent + 4)) 
							WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND convert(SUBSTRING(idNote,:lengthPathParent+2,2),signed) > :nRankDeleted');
	$reqUpdateSiblingsAndChildren -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"],
		'pathParent' => $sPathParent,
		'lengthPathParent' => $lengthPathParent,
		'startWithPathParent' => $sPathParent.'a%',
		'nRankDeleted' => $nRankDeleted));		
	$reqUpdateSiblingsAndChildren->closeCursor();  // attention la requete concerne les folders ET les notes 
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>