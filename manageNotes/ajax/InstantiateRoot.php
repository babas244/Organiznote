<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: application/json; charset=UTF-8");

session_start();

//echo "dans InstantiateRoot !!";

if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {

	include '../../log_in_bdd.php';


	$reqGetTopic = $bdd -> prepare('SELECT topic FROM topics WHERE idUser=:idUser AND id=:idTopic');
		$reqGetTopic -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET['idTopic']));
		
		$resultat = $reqGetTopic -> fetch();
		echo '{"topic":"'.$resultat['topic'].'",';
	$reqGetTopic -> closeCursor();
	
	
/* 	$reqGetNbOfItemsOfRoot = $bdd -> prepare('SELECT COUNT(*) as nNbDeComposants FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote REGEXP :aTrouver AND isCategory=\'1\'');
		$reqGetNbOfItemsOfRoot -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'aTrouver' => '^[1-9]{1,3}$'));

		$resultat = $reqGetNbOfItemsOfRoot -> fetch();
		echo '"nNbDeComposants":"'.$resultat['nNbDeComposants'].'"}';
	$reqGetNbOfItemsOfRoot->closeCursor();	
 */
	$reqGetNbOfItemsOfRoot = $bdd -> prepare('SELECT NbOfItems FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote="racine"');
		$reqGetNbOfItemsOfRoot -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"]));

		$resultat = $reqGetNbOfItemsOfRoot -> fetch();
		echo '"nNbDeComposants":"'.$resultat['NbOfItems'].'"}';
	$reqGetNbOfItemsOfRoot->closeCursor();	
	

}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';
}
?> 