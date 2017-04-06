<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCategoriePere"])) {

	if (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sCategoriePere"])) {
	
		require '../../log_in_bdd.php';

		require '../../isIdTopicSafeAndMatchUser.php';
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sCategoriePere = htmlspecialchars($_GET["sCategoriePere"]);
		
		$req = $bdd -> prepare('SELECT idNote, content FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote REGEXP :aTrouver AND idNote NOT LIKE :categoriepere ORDER BY idNote');
		$req -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic, 
		'aTrouver' => '^'.$sCategoriePere.'([a-b][0-9]{2}$)',
		'categoriepere' => $sCategoriePere));

		$sCategoriesRecuperees = "[";

		while ($donnees = $req->fetch()) {
			$sCategoriesRecuperees .= '"'.$donnees['idNote'] .'","'. $donnees['content'] . '",';
		}

		echo $sCategoriesRecuperees == "[" ? "" : substr($sCategoriesRecuperees, 0, -1)."]"; //il faut enlever le dernier ","

		$req->closeCursor();	
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>