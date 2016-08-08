<?php

header("Content-Type: text/plain");

session_start();

//echo '$_SESSION["id"] = '.$_SESSION['id'];

if (isset($_SESSION['id']) && isset($_GET["newNote"]) && isset($_GET["idTopic"]) && isset($_GET["idCategoriePere"])) {
	
	//echo "coucou dans insertNewNote ! ";
	
	//echo '$_GET["idTopic"]= '.$_GET["idTopic"];
	
	include '../../log_in_bdd.php';

	$isCategory = "1";
	
	// chercher dans la bdd pour idCategoriePere : nbOfItems et rowOfNoteInCategory et levelInTree :
	$reqGetFeaturesOfDad = $bdd -> prepare('SELECT NbOfItems, levelInTree FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idCategoriePere AND isCategory=:isCategory');
		$reqGetFeaturesOfDad -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idCategoriePere' => $_GET["idCategoriePere"],
		'isCategory' => $isCategory));

		$featuresOfDad = $reqGetFeaturesOfDad -> fetch();
		$nbOfItemsOfDad = $featuresOfDad["NbOfItems"]; 
		$levelInTreeOfDad = $featuresOfDad["levelInTree"];		
	//echo'             $nbOfItemsOfDad = '.$nbOfItemsOfDad."           \n\n";
	$reqGetFeaturesOfDad -> closeCursor();	
		
	$idNote = $_GET["idCategoriePere"].'a'.($nbOfItemsOfDad+1); // faut-il convertir en string ?? : apparemment non
	//echo("\n\n idNote à insérer = $idNote");
	$nbOfItems = 0;
	$levelInTree = $levelInTreeOfDad + 1;
	$rowOfNoteInCategory = $nbOfItemsOfDad + 1; // en fait ça suffit pas ici, il faut trouver la valeur MAX de rowOfNoteInCategory, puis l'incrémenter !! 
	
	// inserer la note
	$reqInsertNote = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,NbOfItems,dateCreation,isCategory,levelInTree,rowOfNoteInCategory) VALUES (:idUser,:idTopic,:idNote,:newNote,:nbOfItems, NOW(),:isCategory,:levelInTree,:rowOfNoteInCategory)');
		$reqInsertNote -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => $idNote,
		'newNote' => $_GET["newNote"],
		'nbOfItems' => $nbOfItems,
		'isCategory' => $isCategory,
		'levelInTree' => $levelInTree,
		'rowOfNoteInCategory' => $rowOfNoteInCategory));
	$reqInsertNote -> closeCursor();	

	$nbOfItemsOfDad += 1;
	
	//il faut aussi incrémenter NbOfItems de la catégorie Pere :
	$reqUpdateDad = $bdd -> prepare('UPDATE notes SET NbOfItems=:nbOfItemsOfDad WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:idCategoriePere AND isCategory=:isCategory');
		$reqUpdateDad -> execute(array(
		'nbOfItemsOfDad' => $nbOfItemsOfDad,
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idCategoriePere' => $_GET["idCategoriePere"],
		'isCategory' => $isCategory));
	$reqUpdateDad -> closeCursor();	
 

}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>