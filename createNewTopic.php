<?php
session_start(); 

include 'log_in_bdd.php';

include 'sessionAuthentication.php';

if (isset($_SESSION['id']) && isset($_POST['newTopic']) && isset($_POST['colorBackGround']) && isset($_POST['colorFont'])) {
	if ($_POST['newTopic']=="") {
		echo"Le champ est vide. Recommencez."; // on n'a pas le temps de voir ce message. Il faut penser à interdire aussi le cas où le champ contient le caractère  |.
	}
	else {
		$newTopic = htmlspecialchars($_POST['newTopic']);

		// Insérer le nouveau topic. Faut-il vérifier qu'il n'existe pas déjà pour cet user ??...oui...
		$reqInsertTopic = $bdd->prepare('INSERT INTO topics(topic, idUser, colorBackGround, colorFont) VALUE (:topic, :idUser, :colorBackGround, :colorFont)');
		$reqInsertTopic -> execute (array(
			'topic' => $newTopic,
			'idUser' => $_SESSION['id'],
			'colorBackGround' => $_POST['colorBackGround'],
			'colorFont' => $_POST['colorFont']));
		//echo "Le nouveau Sujet ".$newTopic." a été crée.";
		$reqInsertTopic -> closeCursor();
		
		// Déterminer l'id du topic fraichement créé dans topics
		$reqGetIdOfTopic = $bdd->prepare('SELECT id FROM topics WHERE topic=:topic AND idUser=:idUser');
		$reqGetIdOfTopic -> execute (array(
			'topic' => $newTopic,
			'idUser' => $_SESSION['id']));
		$result = $reqGetIdOfTopic -> fetch(); 
		$idTopic = $result['id'];
		$reqGetIdOfTopic -> closeCursor();
		//echo "\nId = ".$idTopic;
		
		// insérer Root comme première catégorie de la table Notes
		$reqInsertRootIntoNotesTable = $bdd->prepare('INSERT INTO Notes(idUser,idTopic,idNote,content,NbOfItems,dateCreation,isCategory,levelInTree,rowOfNoteInCategory) VALUES (:idUser,:idTopic,"racine",:newNote,"0", NOW(),"1","0","1")');
		$reqInsertRootIntoNotesTable -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'newNote' => $newTopic));
		$reqInsertRootIntoNotesTable -> closeCursor();	

	}
	
	header ('Location: manageTopics.php');
	exit;
}
	

?>

<!DOCTYPE html>
<html>
    <head>
        <title>Index</title>
        <meta charset="utf-8"/>
    </head>
    <body>
		
	</body>
</html>