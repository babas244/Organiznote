<?php
if (!isset($_GET["sContentStart"])) {
	echo "Erreur fatale, variable non définie";
	exit;
}
else {
	$sContentStart = htmlspecialchars($_GET["sContentStart"]);
	$lengthCheckedString = 2000;
	
	// vérifier que l'on update le bon toDo 
	$reqChecktoDoIsTheRightOne = $bdd -> prepare("SELECT COUNT(*) AS nbOfToDoMatches FROM todolists 
	WHERE idUser=:idUser AND idTopic=:idTopic 
	AND label0=:label0 AND label1=:label1 AND label2=:label2 AND label3=:label3 AND noteRank=:noteRank
	AND dateArchive IS NULL
	AND SUBSTRING(content, 1, :lengthCheckedString)=:sContentStart");
			$reqChecktoDoIsTheRightOne -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'label0' => $aLabels[0],
			'label1' => $aLabels[1],
			'label2' => $aLabels[2],
			'label3' => $aLabels[3],
			'noteRank'=> $position,
			'lengthCheckedString' => $lengthCheckedString,
			'sContentStart' => $sContentStart)) or die(print_r($reqChecktoDoIsTheRightOne->errorInfo()));
			//echo ('<br>'.$reqChecktoDoIsTheRightOne->rowCount().' rangs affectés');
		while ($data = $reqChecktoDoIsTheRightOne->fetch()) {
			$nbOfToDoMatches = intval($data['nbOfToDoMatches']);
		}		
	$reqChecktoDoIsTheRightOne -> closeCursor();
	
	if ($nbOfToDoMatches !== 1) {
		echo "reload";
		exit;
	}			
}
?>