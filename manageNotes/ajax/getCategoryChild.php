<?php
//header("Access-Control-Allow-Origin: *"); ??? C'est quoi ???

header("Content-Type: text/plain");

//header("Content-Type: application/json; charset=UTF-8");

session_start();

//echo "dans GetTree !!";

if (isset($_SESSION['id']) && isset($_GET["sCategoriePere"]) && isset($_GET["idTopic"])) {
	
	// faut-il faire des htmlchar ici ?? et v�rifier que tout est de la bonne forme ?? A priorio oui, �a vient de l'utilisateur..
	
	//echo '$_GET["sCategoriePere"] est ' . $_GET["sCategoriePere"] . " ! ";
	
	$sCategoriePere = $_GET["sCategoriePere"]; //utile ou pas ?
	// faire une regex pour voir si sCategoriePere est de la forme correcte

	//echo "Le num�ro de cat�gorie p�re est " . $sCategoriePere . " ! ";
	if ($sCategoriePere == "racine") {
		$sCategoriePere = "";
	}

	include '../../log_in_bdd.php';
							
	/* il faudra v�rifier que cet idUser poss�de cet idTopic � chaque fois...Alors que si on avait une table par topic, il suffirait de v�rifier 1 fois ?? Mmm.pas s�r
	$req = $bdd -> prepare ('SELECT topic FROM topics WHERE idUser=:idUser AND idTopic=:idTopic);	
	$req -> execute(array(
	'idUser' => $_SESSION['id'],
	'idTopic' => $_SESSION['' ]);
	
	$resultat = $req -> fetch();
	if ($resultat) {
		...code
	}
	Non inutile car $_SESSION['id'] n'est pas manipulable (c'est bien s�r �a ??). Et que si on met un idTopic qui n'appartient pas � cet user aucun r�sultat ne va revenir.
	*/
		
	$req = $bdd -> prepare('SELECT idNote, content, levelInTree, NbOfItems FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote REGEXP :aTrouver AND idNote NOT LIKE :categoriepere AND isCategory=\'1\' ORDER BY idNote');
	$req -> execute(array(
	'idUser' => $_SESSION['id'],
	'idTopic' => $_GET["idTopic"], 
	'aTrouver' => '^'.$sCategoriePere.'(a[1-9]{1,3}$|[1-9]{1,3}$)',
	'categoriepere' => $sCategoriePere));

	$sCategoriesRecuperees = "";

	while ($donnees = $req->fetch()) {
		$sCategoriesRecuperees .= $donnees['idNote'] . "|" . $donnees['content'] . "|" . $donnees['levelInTree'] . "|" . $donnees['NbOfItems'] . "|";
	}

	echo substr($sCategoriesRecuperees, 0, -1); //il faut enlever le dernier |

	$req->closeCursor();	
}

else {
	echo 'Une des variables n\'est pas d�finie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>