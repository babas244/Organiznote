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
									
	$reqDelete = $bdd -> prepare('DELETE FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idNote AND isCategory=:isCategory');
		$reqDelete -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => $_GET["sCategoryToDelete"],
		'isCategory' => $isCategory));
	$reqDelete->closeCursor();	


	// on update tous les items affectés par le décalage
	$sPathParent = $_GET["sCategoryOfDad"];
	$sRankDeleted = $_GET["sCategoryToDelete"];
	$nRankDeleted = intval($sRankDeleted);
	$lengthPathParent = strlen($sPathParent);
	//echo ($lengthPathParent);
	$reqDeleteChildren = $bdd -> prepare('UPDATE notes SET idNote=CONCAT( :pathParent , "a" , LPAD((SUBSTRING(idNote, :lengthPathParent+2,2)-1),2,"0"), SUBSTRING(idNote, :lengthPathParent + 2)) WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND SUBSTRING(idNote, :lengthPathParent +2, 2) > :nRankDeleted');
		$reqDeleteChildren -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"],
		'pathParent' => $sPathParent,
		'lengthPathParent' => $lengthPathParent,
		'startWithPathParent' => $sCategoriePere.'a%',
		'nRankDeleted' => $nRankDeleted));	
	$reqDeleteChildren->closeCursor();		

	//il faut aussi décrémenter NbOfItems de la catégorie Pere :
	$reqUpdateDad = $bdd -> prepare('UPDATE notes SET nbOfItems=nbOfItems-1 WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:sCategoryOfDad AND isCategory=:isCategory');
		$reqUpdateDad -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => $_GET["sCategoryOfDad"], 
		'isCategory' => $isCategory));
	$reqUpdateDad -> closeCursor();	
	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>