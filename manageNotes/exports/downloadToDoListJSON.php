<?php
session_start();
header('Content-type: txt/json; charset=UTF-8');
require '../../log_in_bdd.php';
require '../../isIdTopicSafeAndMatchUser.php';
$idTopic = htmlspecialchars($_GET["idTopic"]);
 
if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {

		$aLabels = array();
		$aLabels[0] = "01234";
		$aLabels[1] = "012";
		$aLabels[2] = "012";
		$aLabels[3] = "012";

		$aExecuteReq = array();
		array_push($aExecuteReq,$_SESSION['id'],$idTopic);	
		$aQuestionsMarks = array();
		
		for ($i = 0 ; $i < count($aLabels) ; $i++) {
			$aExecuteReq = array_merge($aExecuteReq,str_split($aLabels[$i]));
			$questionMarks[$i] = '(';
			for ($j = 0 ; $j < strlen($aLabels[$i]) ; $j++) {
				$questionMarks[$i] .= '?,';
			}
			$questionMarks[$i] = substr($questionMarks[$i], 0, -1).')';
		}

		$reqDisplayToDoList = $bdd -> prepare("SELECT content, dateCreation, dateExpired, label0, label1, label2, label3 
												FROM todolists 
	WHERE idUser=? AND idTopic=? AND label0 IN $questionMarks[0] AND label1 IN $questionMarks[1] AND label2 IN $questionMarks[2] AND label3 IN $questionMarks[3] AND dateArchive IS NULL
	ORDER BY label0, label1, label2, label3, noteRank");
			$reqDisplayToDoList -> execute($aExecuteReq) or die(print_r($reqDisplayToDoList->errorInfo()));
			//echo ('<br>'.$reqDisplayToDoList->rowCount().' rangs affectés');
			
			$toDoFetched = "";
			$i=0;
			$sLabelsFetched = "";
			
			while ($data = $reqDisplayToDoList->fetch()) {
				$sLabelsFetchedNew = $data['label0'].$data['label1'].$data['label2'].$data['label3'];
				if ($sLabelsFetchedNew !== $sLabelsFetched OR $i===0) {
					$toDoFetched = substr($toDoFetched, 0, -1).'],"'.$sLabelsFetchedNew.'":[["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'"],';
					$sLabelsFetched = $sLabelsFetchedNew;
				}
				else {
					$toDoFetched .= '["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'"],';
				}
				$i+=1;
			}
		$reqDisplayToDoList -> closeCursor();	
					
		header('Content-Disposition: attachment; filename="exportToDoList_'. $_SESSION['user'] .'_'. $_SESSION['topic'] .'.json"');
		echo $toDoFetched == "" ? "" : '{'.substr(substr($toDoFetched, 0, -1),2)."]}"; //il faut enlever le dernier ","
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
	
?>