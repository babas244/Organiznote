<?php


//if (isset($_SESSION['id']) && isset($_GET["newNote"]) && isset($_GET["idTopic"])) {
	
	include '../../log_in_bdd.php';
	
	$idUser = 23;
	$idTopic = 14;
	$idNote = "1a2a3";
	$newNote = "blabla";
	$nbOfItems = 0;
	$isCategory = "1";
	$levelInTree = 5;
	$rowOfNoteInCategory = 43;
	
	$req = $bdd -> prepare('INSERT INTO notes(idUser,idTopic,idNote,content,NbOfItems,dateCreation,isCategory,levelInTree,rowOfNoteInCategory) VALUES (:idUser,:idTopic,:idNote,:newNote,:nbOfItems, CURDATE(),:isCategory,:levelInTree,:rowOfNoteInCategory');
	$req -> execute(array(
	'idUser' => $idUser,
	'idTopic' => $idTopic, 
	'idNote' => $idNote,
	'newNote' => $newNote,
	'nbOfItems' => $nbOfItems,
	'isCategory' => $isCategory,
	'levelInTree' => $levelInTree,
	'rowOfNoteInCategory' => $rowOfNoteInCategory));

	//INSERT INTO `notes`(`id`, `idUser`, `idTopic`, `idNote`, `content`, `NbOfItems`, `dateCreation`, `dateExpired`, `dateArchive`, `isCategory`, `levelInTree`, `rowOfNoteInCategory`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7],[value-8],[value-9],[value-10],[value-11],[value-12])
	
	$req->closeCursor();	
/* }

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
} */
?>


<!DOCTYPE html>
<html>
    <head>
        <title>Organiznote</title>
        <meta charset="utf-8" />
    </head>
    <body>
		mmmmmmmmmmmm
	</body>
</html> 