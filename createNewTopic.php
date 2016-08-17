<?php
session_start(); 

include 'log_in_bdd.php';

include 'sessionAuthentication.php';

if (isset($_POST['newTopic']) && isset($_POST['colorBackGround']) && isset($_POST['colorFont'])) {
	if ($_POST['newTopic']=="") {
		echo"Le champ est vide. Recommencez."; // on n'a pas le temps de voir ce message. Il faut penser à interdire aussi le cas où le champ contient le caractère  |.
	}
	else {
		$newTopic = htmlspecialchars($_POST['newTopic']);

		$reqWrite = $bdd->prepare('INSERT INTO topics(topic, idUser, colorBackGround, colorFont) VALUE (:topic, :idUser, :colorBackGround, :colorFont)');
		$reqWrite -> execute (array(
			'topic' => $newTopic,
			'idUser' => $_SESSION['id'],
			'colorBackGround' => $_POST['colorBackGround'],
			'colorFont' => $_POST['colorFont']));
		//echo "Le nouveau Sujet ".$newTopic." a été crée.";
		$reqWrite -> closeCursor();
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