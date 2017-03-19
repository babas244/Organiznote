<?php
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["labelTitleRank"]) && isset($_GET["labelRank"])) {

	if (preg_match("#^[0-9]{1}$#", $_GET["labelTitleRank"]) && preg_match("#^[0-9]{1}$#", $_GET["labelRank"])) {		
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$labelTitleRank = htmlspecialchars($_GET["labelTitleRank"]); // utile ??
		$labelRank = htmlspecialchars($_GET["labelRank"]); // utile ??
		
		include '../../log_in_bdd.php';		
		
		include '../../isIdTopicSafeAndMatchUser.php';
	
		$reqDisplayToDoList = $bdd -> prepare('SELECT todolists.id, todolists.content, todolists.dateCreation, todolists.dateExpired 
												FROM todolists 
												INNER JOIN todoandlabels
												ON todolists.id = todoandlabels.idOfToDo
	WHERE todolists.idUser=:idUser AND todolists.idTopic=:idTopic AND todoandlabels.labelTitleRank=:labelTitleRank AND todoandlabels.labelRank=:labelRank AND todolists.dateArchive IS NULL ORDER BY dateCreation DESC');
			$reqDisplayToDoList -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $_GET["idTopic"],
			'labelTitleRank' => $labelTitleRank,
			'labelRank' => $labelRank,
			)) or die(print_r($reqDisplayToDoList->errorInfo()));
			//echo ('<br>'.$reqDisplayToDoList->rowCount().' rangs affectés');
			
			$toDoFetched = "{";
			
			while ($data = $reqDisplayToDoList->fetch()) {
			$toDoFetched .= '"'.$data['id'].'":["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'"],';
			}
		$reqDisplayToDoList -> closeCursor();	
			
		echo $toDoFetched == "{" ? "" : substr($toDoFetched, 0, -1)."}"; //il faut enlever le dernier ","
		
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>