<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["toDoContent"]) && isset($_GET["labels"])) {
	
	include '../../log_in_bdd.php';

	include '../../isIdTopicSafeAndMatchUser.php';
	
	$toDoContent = htmlspecialchars($_GET["toDoContent"]);
	$labels = htmlspecialchars($_GET["labels"]); // utile ??
	
	// inserer la toDo
	$reqInsertToDo = $bdd -> prepare('INSERT INTO todolists(idUser,idTopic,idNote,content,dateCreation) VALUES (:idUser,:idTopic,:idNote,:newNote,NOW())');
		$reqInsertToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"], 
		'idNote' => "1000",
		'newNote' => $toDoContent)) or die(print_r($reqInsertToDo->errorInfo()));
	//echo ('<br>'.$reqInsertNote->rowCount().' rangs affectés');
	$reqInsertToDo -> closeCursor();	
	
	//renvoyer l'id et les composantes du nouveau toDo
	$reqFetchNewToDo = $bdd -> prepare('SELECT id, content, dateCreation, dateExpired FROM todolists WHERE idUser=:idUser AND idTopic=:idTopic AND content=:content');
		$reqFetchNewToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $_GET["idTopic"],
		'content' => $toDoContent)) or die(print_r($reqFetchNewToDo->errorInfo()));
		//echo ('<br>'.$reqFetchNewToDo->rowCount().' rangs affectés');
		
		$toDoFetched = "{";
		
		while ($data = $reqFetchNewToDo->fetch()) {
		$idOfToDo = $data['id'];
		$toDoFetched .= '"'.$idOfToDo.'":["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'"],';
		}
	$reqFetchNewToDo -> closeCursor();	
		
	echo $toDoFetched == "{" ? "" : substr($toDoFetched, 0, -1)."}"; //il faut enlever le dernier ","
	
	// inserer les labels
	$numberOfLabels=strlen($labels);
	$sQuestionsMarks = "";
	$arrayLabels = array();
	for ( $i = 0 ; $i < $numberOfLabels; $i++) {
		$sQuestionsMarks .= '(?,?,?),';
		array_push($arrayLabels, $idOfToDo, $i+1, substr($labels,$i,1)); 
	}
	$sQuestionsMarks = substr($sQuestionsMarks, 0, -1);
	
	$reqInsertLabels = $bdd -> prepare("INSERT INTO todoandlabels(idOfToDo,labelTitleRank,labelRank) VALUES $sQuestionsMarks");
		$reqInsertLabels -> execute($arrayLabels) or die(print_r($reqInsertLabels->errorInfo()));
	//echo ('<br>'.$reqInsertLabels->rowCount().' rangs affectés');
	$reqInsertLabels -> closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>