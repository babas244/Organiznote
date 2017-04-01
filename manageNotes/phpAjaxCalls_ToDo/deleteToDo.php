<?php

header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sLabelsAndPositionToDo"])) {
	
	include '../../log_in_bdd.php';

	include '../../isIdTopicSafeAndMatchUser.php';
	
	$idTopic = htmlspecialchars($_GET["idTopic"]);
	$sLabelsAndPositionToDo = htmlspecialchars($_GET["sLabelsAndPositionToDo"]); 
	$aLabelsAndPositionToDo = str_split($sLabelsAndPositionToDo);
	$positionToDo = $sLabelsAndPositionToDo[4];

	// effacer la toDo
	$reqDeleteToDo = $bdd -> prepare('DELETE FROM todolists 
		WHERE idUser=:idUser AND idTopic=:idTopic AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND noteRank=:NoteRank');
		$reqDeleteToDo -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic, 
		'label0' => $aLabelsAndPositionToDo[0],
		'label1' => $aLabelsAndPositionToDo[1],
		'label2' => $aLabelsAndPositionToDo[2],
		'label3' => $aLabelsAndPositionToDo[3],
		'NoteRank'=> $positionToDo)) or die(print_r($reqDeleteToDo->errorInfo()));
	echo ('<br>'.$reqDeleteToDo->rowCount().' rangs affectés');
	$reqDeleteToDo -> closeCursor();	
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	
}
?>