<?php
session_start(); 

include 'log_in_bdd.php';

include 'sessionAuthentication.php';
?>

<!DOCTYPE html>
<html>
    <head>
        <title>create new topic</title>
        <meta charset="utf-8"/>
    </head>
    <body>

<?php
if (isset($_SESSION['id']) && isset($_POST['newTopic']) && isset($_POST['colorBackGround']) && isset($_POST['colorFont'])) {
	if ($_POST['newTopic']=="") {
		echo"<script>alert('Le champ est vide. Recommencez.');window.open('manageTopics.php');</script>"; //Il faut penser à interdire aussi le cas où le champ contient le caractère  |.
	}
	else {
		$newTopic = htmlspecialchars($_POST['newTopic']);

		// déterminer si le topic existe déjà
		$bTopicAlreadyExists = false;	
		$reqCheckifTopicAlreadyExists = $bdd->prepare('SELECT topic FROM topics WHERE idUser=:idUser');
			$reqCheckifTopicAlreadyExists -> execute (array(
			'idUser' => $_SESSION['id']));
			while ($donnees = $reqCheckifTopicAlreadyExists -> fetch()) {
				if ($newTopic == $donnees['topic']) {
					$bTopicAlreadyExists = true;
				}
			}
		$reqCheckifTopicAlreadyExists -> closeCursor();
				
		if ($bTopicAlreadyExists) { //rediriger l'utilisateur vers manageTopics si le topic existe déjà
			echo"<script>alert('Ce sujet de note existe déjà. Trouvez un autre nom.');window.open('manageTopics.php');</script>";	
		}
		else {
			// Insérer le nouveau topic. 
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
			
			// insérer "01" comme catégorie root de la table Notes
			$reqInsertRootIntoNotesTable = $bdd->prepare('INSERT INTO Notes(idUser,idTopic,idNote,content,dateCreation) VALUES (:idUser,:idTopic,"01",:newNote,NOW())');
			$reqInsertRootIntoNotesTable -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic, 
				'newNote' => $newTopic));
			$reqInsertRootIntoNotesTable -> closeCursor();	
			header ('Location: manageTopics.php');
		}
	}
	
	exit; // ?
}
	

?>


	</body>
</html>