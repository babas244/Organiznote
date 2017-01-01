<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

//echo "dans deleteNote !!";

$isCategory = "1";

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCategoryToDelete"]) && isset($_GET["sCategoryOfDad"])) {

	//echo "Le numéro de catégoryTodelete  est ".$_GET["sCategoryToDelete"];

	include '../../log_in_bdd.php';
	
	// on efface sCategoryToDelete et ses descendants
	$reqDeleteChildren = $bdd -> prepare('DELETE FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote lIKE :idNoteToDelete AND isCategory=:isCategory');
		$reqDeleteChildren -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNoteToDelete' => $_GET["sCategoryToDelete"]."%",
		'isCategory' => $isCategory));
	$reqDeleteChildren->closeCursor();	// att ! 01% efface aussi 01, ce qui sera interdit si 01 devient la racine. pour éviter ça on effacer 01a%, mais cela  n'inclut que les folders

	// il faudrait faire aussi le cas où on efface qu'une seule catégorie ?

										
	// on update tous les items affectés par le décalage
	$sPathParent = $_GET["sCategoryOfDad"];
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

	//il faut aussi décrémenter NbOfItems de la catégorie Pere :
	$reqUpdateDad = $bdd -> prepare('UPDATE notes SET nbOfItems=nbOfItems-1 WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:sCategoryOfDad AND isCategory=:isCategory');
		$reqUpdateDad -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'sCategoryOfDad' => $_GET["sCategoryOfDad"], 
		'isCategory' => $isCategory));
	$reqUpdateDad -> closeCursor();	
										
	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>