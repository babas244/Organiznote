<?php
if (!isset($_POST["sContentStart"])) {
	echo "Erreur fatale, variable non définie";
	exit;
}
else {
	$sContentStart = htmlspecialchars($_POST["sContentStart"]);
	
	// vérifier que l'on update le bon treeItem
	$reqChecktreeItemIsTheRightOne = $bdd -> prepare("SELECT COUNT(*) AS nbOfTreeItemsMatches FROM notes 
	WHERE idUser=:idUser AND idTopic=:idTopic
	AND idNote=:sPath
	AND dateArchive IS NULL
	AND content=:sContentStart");
			$reqChecktreeItemIsTheRightOne -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'sPath' => $sPath,
			'sContentStart' => $sContentStart)) or die(print_r($reqChecktreeItemIsTheRightOne->errorInfo()));
			//echo ('<br>'.$reqChecktreeItemIsTheRightOne->rowCount().' rangs affectés');
		while ($data = $reqChecktreeItemIsTheRightOne->fetch()) {
			$nbOfTreeItemsMatches = intval($data['nbOfTreeItemsMatches']);
		}		
	$reqChecktreeItemIsTheRightOne -> closeCursor();
	
	if ($nbOfTreeItemsMatches !== 1) {
		echo "reload";
		exit;
	}			
}
?>