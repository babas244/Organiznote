<?php
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sLabels"])) {

	if (preg_match("#^[_0-9]{4}$#", $_GET["sLabels"])) {		
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sLabels = htmlspecialchars($_GET["sLabels"]); // utile ??
		
		$aLabels = str_split($sLabels,1);
		
		include '../../log_in_bdd.php';		
		
		include '../../isIdTopicSafeAndMatchUser.php';
	
		$reqDisplayToDoList = $bdd -> prepare('SELECT content, dateCreation, dateExpired, label0, label1, label2, label3 
												FROM todolists 
	WHERE idUser=:idUser AND idTopic=:idTopic AND label0 LIKE :label0 AND label1 LIKE :label1 AND label2 LIKE :label2 AND label3 LIKE :label3 AND dateArchive IS NULL
	ORDER BY dateCreation DESC');
			$reqDisplayToDoList -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $_GET["idTopic"],
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			)) or die(print_r($reqDisplayToDoList->errorInfo()));
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
			
		echo $toDoFetched == "" ? "" : '{'.substr(substr($toDoFetched, 0, -1),2)."]}"; //il faut enlever le dernier ","
		
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>