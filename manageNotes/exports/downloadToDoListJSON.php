<?php
session_start();
header('Content-type: txt/json; charset=UTF-8');
require '../../log_in_bdd.php';
require '../../isIdTopicSafeAndMatchUser.php';
$idTopic = htmlspecialchars($_GET["idTopic"]);
 
if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {

		$aLabels = array();
		$aNbOfLabels = array();
			
		$reqRetrieveLabels = $bdd -> prepare('SELECT todo_userlabelstitles.content AS labelTitleContent, todo_userlabelstitles.rankLabelTitle AS rankLabelTitle, todo_userlabels.content AS labelContent
											FROM todo_userlabels 
											INNER JOIN todo_userlabelstitles
											ON todo_userlabelstitles.id = todo_userlabels.idLabelTitle
											WHERE todo_userlabels.idUser=:idUser AND todo_userlabels.idTopic=:idTopic 
											ORDER BY todo_userlabelstitles.rankLabelTitle, todo_userlabels.rankLabel');
			$reqRetrieveLabels -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic)) or die(print_r($reqRetrieveLabels->errorInfo()));
			//echo ('<br>'.$reqRetrieveLabels->rowCount().' rangs affectés');
			
			$labelsFetched = '';
			
			$labelTitlesFetched = '';
			
			$rankLabelTitleTest = 0;
			$rankLabelTest = 0;
			
			while ($data = $reqRetrieveLabels->fetch()) {
				if ($rankLabelTitleTest <= $data['rankLabelTitle'] && $rankLabelTitleTest!=0) { // on attaque donc un nouveau Title
					$aNbOfLabels[$rankLabelTitleTest - 1] = $rankLabelTest;
					$rankLabelTest = 0;
					$labelsFetched = substr($labelsFetched, 0, -1).'],'; // remplacer la virgule en fin de chaîne par le crochet final 
				}
				
				if ($rankLabelTest ==0) { // 	
					$labelTitlesFetched .= '"'.$data['labelTitleContent'].'",';
					$labelsFetched .= '["'.$data['labelContent'].'",';
					$rankLabelTitleTest +=1;
				}
				else {
					$labelsFetched .= '"'.$data['labelContent'].'",';
				}
				$rankLabelTest +=1;
			}
			$aNbOfLabels[$rankLabelTitleTest - 1] = $rankLabelTest;
		
		$reqRetrieveLabels -> closeCursor();	

		$labelTitlesFetched = substr($labelTitlesFetched, 0, -1)."]"; // remplacer la virgule en fin de chaîne par un crochet 

		$labelsFetched = substr($labelsFetched, 0, -1)."]]"; // remplacer la virgule à la fin

		$sOutput = '{"titleLabels":['.$labelTitlesFetched.',"contentLabels":['.$labelsFetched.',"toDoList":'; 		
	
		for ($labelTitleRank = 0 ; $labelTitleRank < 4 ; $labelTitleRank++) {
		$sLabelsToRetrieve = "";
			for ($labelRank = 0 ; $labelRank < $aNbOfLabels[$labelTitleRank]; $labelRank++) {
				$sLabelsToRetrieve .= $labelRank;
			}
			$aLabels[$labelTitleRank] = $sLabelsToRetrieve;
		}

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

		$reqDisplayToDoList = $bdd -> prepare("SELECT content, dateCreation, dateExpired, latitude, longitude, accuracyPosition, label0, label1, label2, label3 
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
					$toDoFetched = substr($toDoFetched, 0, -1).'],"'.$sLabelsFetchedNew.'":[["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'","'.$data['latitude'].'","'.$data['longitude'].'","'.$data['accuracyPosition'].'"],';
					$sLabelsFetched = $sLabelsFetchedNew;
				}
				else {
					$toDoFetched .= '["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'","'.$data['latitude'].'","'.$data['longitude'].'","'.$data['accuracyPosition'].'"],';
				}
				$i+=1;
			}
		$reqDisplayToDoList -> closeCursor();	
		$sOutput .= $toDoFetched == "" ? "" : '{'.substr(substr($toDoFetched, 0, -1),2)."]}"; //il faut enlever le dernier ","

		$sOutput .= ',"toDoArchived":'; // puis les toDo archivés

		$reqDisplayToDoListArchived = $bdd -> prepare("SELECT content, dateCreation, dateExpired, latitude, longitude, accuracyPosition, dateArchive 
												FROM todolists 
	WHERE idUser=:idUser AND idTopic=:idTopic AND dateArchive IS NOT NULL
	ORDER BY dateArchive");
			$reqDisplayToDoListArchived -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic)) or die(print_r($reqDisplayToDoListArchived->errorInfo()));
			//echo ('<br>'.$reqDisplayToDoListArchived->rowCount().' rangs affectés');
			
			$toDoArchivedFetched = "[";
			while ($data = $reqDisplayToDoListArchived->fetch()) {
				$toDoArchivedFetched .= '["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['dateExpired'].'","'.$data['latitude'].'","'.$data['longitude'].'","'.$data['accuracyPosition'].'","'.$data['dateArchive'].'"],'; 
			}
		$reqDisplayToDoListArchived -> closeCursor();	
		$sOutput .= $toDoArchivedFetched == "" ? "" : substr($toDoArchivedFetched, 0, -1)."]"; //il faut enlever le dernier ",";
		
		header('Content-Disposition: attachment; filename="exportToDoList_'. substr($_SESSION['user'],0,10) .'_'. substr($_SESSION['topic'],0,10) .'.json"');
		echo $sOutput.'}'; 
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
	
?>