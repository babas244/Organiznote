<?php
header("Content-Type: text/html; charset=UTF-8");
session_start();
require '../../log_in_bdd.php';
require '../../isIdTopicSafeAndMatchUser.php';
$idTopic = htmlspecialchars($_GET["idTopic"]);
 ?>

<!DOCTYPE html>
<html>
    <head>
        <title>
			<?php
			$reqGetTopic = $bdd -> prepare('SELECT topic, colorBackGround FROM topics WHERE idUser=:idUser AND id=:idTopic');
				$reqGetTopic -> execute(array(
				'idUser' => $_SESSION['id'],
				'idTopic' => $idTopic));
				$resultat = $reqGetTopic -> fetch();
				echo 'export todos '.$resultat['topic'];
				$_SESSION['topic'] = $resultat['topic'];
				$backgroundColorToDo = $resultat['colorBackGround'];
				if ($reqGetTopic->rowCount() == 0) { // inutile car déjà isIdTopicSafeAndMatchUser.php non ?
					header("Location: ../logout.php");
				}
			$reqGetTopic -> closeCursor();
			?>
		</title>
			<meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
			<meta name="robots" content="noindex,nofollow">
			<link rel="stylesheet" href="displayCompleteToDoList.css"/>
	</head>
    <body>
	<div id="noScroll"></div>
	<Br><Br>
	<p>Todos archivés</p>
	<?php
	if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {
		$reqDisplayToDoListArchived = $bdd -> prepare("SELECT content, dateCreation, dateArchive 
		FROM todolists 
		WHERE idUser=:idUser AND idTopic=:idTopic AND dateArchive IS NOT NULL 
		ORDER BY DateArchive");
				$reqDisplayToDoListArchived -> execute(array(
					'idUser' => $_SESSION['id'],
					'idTopic' => $idTopic)) or die(print_r($reqDisplayToDoListArchived->errorInfo()));
							
				while ($data = $reqDisplayToDoListArchived->fetch()) {
					echo '<div id="containerOfArchived"><div class="dateArchived">'.$data['dateArchive'].'</div><div class="toDo">'.$data['content'].'</div><div class="dateCreation">crée le : '.$data['dateCreation'].'</div></div>';
				}
		$reqDisplayToDoListArchived -> closeCursor();					
	?>	
		<script>
			<?php
			echo "var idUser = ".$_SESSION['id'].";"; 
			echo "var idTopic = ". $idTopic.";";
			echo "var backgroundColorToDo = '".$backgroundColorToDo."';";	
			?>
		</script>
	<?php
	}
	else {
		echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
	}	
	?>
	<script src="displayCompleteToDoList.js"></script>
	</body>
</html>
