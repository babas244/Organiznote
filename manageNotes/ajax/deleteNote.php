<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

//echo "dans deleteNote !!";

$isCategory = "1";

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCategoryToDelete"]) && isset($_GET["sCategoryOfDad"])) {

	//echo "Le num�ro de cat�goryTodelete  est ".$_GET["sCategoryToDelete"];

	include '../../log_in_bdd.php';
									
	$reqDelete = $bdd -> prepare('DELETE FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idNote AND isCategory=:isCategory');
		$reqDelete -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => $_GET["sCategoryToDelete"],
		'isCategory' => $isCategory));
	$reqDelete->closeCursor();	
	
	//il faut aussi d�cr�menter NbOfItems de la cat�gorie Pere :
	$reqUpdateDad = $bdd -> prepare('UPDATE notes SET nbOfItems=nbOfItems-1 WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:sCategoryOfDad AND isCategory=:isCategory');
		$reqUpdateDad -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => $_GET["sCategoryOfDad"], 
		'isCategory' => $isCategory));
	$reqUpdateDad -> closeCursor();	
	
}

else {
	echo 'Une des variables n\'est pas d�finie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>