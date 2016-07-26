<?php
session_start(); 

include 'log_in_bdd.php';

include 'sessionAuthentication.php';

if (isset($_POST['newTopic'])) {
	if ($_POST['newTopic']=="") {
		echo"Le champ est vide. Recommencez."; // il faut penser à interdire aussi le cas où le champ contient le caractère  |.
	}
	else {
		$newTopic = htmlspecialchars($_POST['newTopic']);

		$reqWrite = $bdd->prepare('INSERT INTO topics(topic, idUser) VALUE (:topic, :idUser)');
		$reqWrite -> execute (array(
			'topic' => $newTopic,
			'idUser' => $_SESSION['id']));
		echo "Le nouveau Sujet ".$newTopic." a été crée.";
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