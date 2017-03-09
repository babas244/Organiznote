<?php
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {

	if (preg_match("#^[0-9]+$#", $_GET["idTopic"])) {		
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);

		include '../../log_in_bdd.php';		
		
		include '../../isIdTopicSafeAndMatchUser.php';
	
		$reqDisplayToDoList = $bdd -> prepare('SELECT id, content, dateCreation, dateExpired FROM todolists WHERE idUser=:idUser AND idTopic=:idTopic AND dateArchive IS NULL ORDER BY dateCreation DESC');
			$reqDisplayToDoList -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $_GET["idTopic"])) or die(print_r($reqDisplayToDoList->errorInfo()));
			//echo ('<br>'.$reqDisplayToDoList->rowCount().' rangs affectés');
			
			$toDoFetched = "{";
			
			while ($data = $reqDisplayToDoList->fetch()) {
			$toDoFetched .= '"'.$data['id'].'":["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'"],';
			}
		$reqDisplayToDoList -> closeCursor();	
			
		echo $toDoFetched == "{" ? "" : substr($toDoFetched, 0, -1)."}"; //il faut enlever le dernier ","
		
		/*echo ('<br>'.$reqUpdateSiblingsAndChildren->rowCount()." lignes affectées dans reqUpdateSiblingsAndChildren<br>");
		*/
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>