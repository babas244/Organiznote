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
				echo $resultat['topic'];
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
	<?php
	if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {
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
