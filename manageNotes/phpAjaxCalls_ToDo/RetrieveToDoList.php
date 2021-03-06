<?php
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id'])) {
	if (isset($_GET["idTopic"]) && isset($_GET["label0"]) && isset($_GET["label1"]) && isset($_GET["label2"]) && isset($_GET["label3"])) {

		if (preg_match("#^[0-9]{1,9}$#", $_GET["label0"]) && preg_match("#^[0-9]{1,9}$#", $_GET["label1"]) && preg_match("#^[0-9]{1,9}$#", $_GET["label3"]) && preg_match("#^[0-9]{1,9}$#", $_GET["label3"])) {		
			
			$idTopic = htmlspecialchars($_GET["idTopic"]);
			$aLabels = array();
			$aLabels[0] = htmlspecialchars($_GET["label0"]);
			$aLabels[1] = htmlspecialchars($_GET["label1"]);
			$aLabels[2] = htmlspecialchars($_GET["label2"]);
			$aLabels[3] = htmlspecialchars($_GET["label3"]);
			
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
		
			require '../../log_in_bdd.php';		
			
			require '../../isIdTopicSafeAndMatchUser.php';
		
			$reqDisplayToDoList = $bdd -> prepare("SELECT content, dateCreation, dateExpired, label0, label1, label2, label3 
													FROM todolists 
		WHERE idUser=? AND idTopic=? AND label0 IN $questionMarks[0] AND label1 IN $questionMarks[1] AND label2 IN $questionMarks[2] AND label3 IN $questionMarks[3] AND dateArchive IS NULL
		ORDER BY label0, label1, label2, label3, noteRank");
				$reqDisplayToDoList -> execute($aExecuteReq) or die(print_r($reqDisplayToDoList->errorInfo()));
				//echo ('<br>'.$reqDisplayToDoList->rowCount().' rangs affectés');
				
				$i=0;
				$sLabelsFetched = "";
				
				$arrayJSON = array();
				
				while ($data = $reqDisplayToDoList->fetch()) {
					$sLabelsFetchedNew = $data['label0'].$data['label1'].$data['label2'].$data['label3'];
					if ($sLabelsFetchedNew !== $sLabelsFetched) {
						$i=0;
						$arrayJSON[$sLabelsFetchedNew] = array();
						$arrayJSON[$sLabelsFetchedNew][$i] = array();
						$arrayJSON[$sLabelsFetchedNew][$i][0] = htmlspecialchars_decode(($data['content']));
						$arrayJSON[$sLabelsFetchedNew][$i][1] = $data['dateCreation'];
						$arrayJSON[$sLabelsFetchedNew][$i][2] = $data['dateExpired'];
						$sLabelsFetched = $sLabelsFetchedNew;
					}
					else {
						$arrayJSON[$sLabelsFetchedNew][$i][0] = htmlspecialchars_decode(($data['content']));
						$arrayJSON[$sLabelsFetchedNew][$i][1] = $data['dateCreation'];
						$arrayJSON[$sLabelsFetchedNew][$i][2] = $data['dateExpired'];					
					}
					$i+=1;
				}
				echo json_encode($arrayJSON);
				
			$reqDisplayToDoList -> closeCursor();		
		}
	}
	else {
		echo "Une des variables n'est pas définie.";
	}
}
else {
	echo 'disconnected';	
}?>