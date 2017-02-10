<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["sCategoriePere"]) && (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sCategoriePere"])) && isset($_GET["idTopic"])) {
	
	$sCategoriePere = $_GET["sCategoriePere"]; //utile ou pas ?

	include '../../log_in_bdd.php';
		
	$req = $bdd -> prepare('SELECT idNote, content FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote REGEXP :aTrouver AND idNote NOT LIKE :categoriepere ORDER BY idNote');
	$req -> execute(array(
	'idUser' => $_SESSION['id'],
	'idTopic' => $_GET["idTopic"], 
	'aTrouver' => '^'.$sCategoriePere.'([a-b][0-9]{2}$)',
	'categoriepere' => $sCategoriePere));

	$sCategoriesRecuperees = "";

	while ($donnees = $req->fetch()) {
		$sCategoriesRecuperees .= $donnees['idNote'] . "|" . $donnees['content'] . "|";
	}

	echo substr($sCategoriesRecuperees, 0, -1); //il faut enlever le dernier |

	$req->closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>