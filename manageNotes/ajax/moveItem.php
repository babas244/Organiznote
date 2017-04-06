<?php
header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCutPath"]) && isset($_GET["sPathWhereToPaste"]) && isset($_GET["rowOfPasteItem"])) {

	if ((preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sCutPath"])) && (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPathWhereToPaste"])) && (preg_match("#^[0-9]{2}*$#", $_GET["rowOfPasteItem"]))) {		
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sCutPath = htmlspecialchars($_GET["sCutPath"]);
		$aORb = substr($sCutPath,-3,1);
		$sPathWhereToPaste = htmlspecialchars($_GET["sPathWhereToPaste"]);
		$rowOfPasteItem = htmlspecialchars($_GET["rowOfPasteItem"]);
		
		include '../../log_in_bdd.php';		
		
		include '../../isIdTopicSafeAndMatchUser.php';
		
		// on update les noms de tous les paths descendants de sCutPath et aussi sCutPath
		$lengthCutPath = strlen($sCutPath); // on pourrait mettre le +1 ici au lieu de le recalculer dans la requete à chaque fois
		//echo $lengthCutPath;
		//exit;
		
		$reqUpdatePathFamilyOfCutPath = $bdd -> prepare('	UPDATE notes 
								SET idNote=CONCAT(:pathWhereToPaste , :aORb , :rowOfPasteItem, SUBSTRING(idNote, :lengthCutPath + 1)) 
								WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithCutPath');
			$reqUpdatePathFamilyOfCutPath -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'pathWhereToPaste' => $sPathWhereToPaste,
			'aORb' => $aORb,
			'rowOfPasteItem' => $rowOfPasteItem,
			'lengthCutPath' => $lengthCutPath,
			'startWithCutPath' => $sCutPath.'%')) or die(print_r($reqUpdatePathFamilyOfCutPath->errorInfo()));
		echo ('<br>'.$reqUpdatePathFamilyOfCutPath->rowCount()." lignes affectées dans reqUpdatePathFamilyOfCutPath<br>");
		$reqUpdatePathFamilyOfCutPath->closeCursor();
											
		// on update tous les items affectés par le décalage
		$sPathParent = substr($sCutPath,0,-3);
		$sRankDeleted = $sCutPath;
		$nRankDeleted = intval(substr($sRankDeleted,-2));
		$lengthPathParent = strlen($sPathParent);
		$reqUpdateSiblingsAndChildren = $bdd -> prepare('	UPDATE notes 
								SET idNote=CONCAT(:pathParent, :aORb , LPAD((SUBSTRING(idNote,:lengthPathParent+2,2)-1),2,"0"),SUBSTRING(idNote,:lengthPathParent + 4)) 
								WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND convert(SUBSTRING(idNote,:lengthPathParent+2,2),signed) > :nRankDeleted');
		$reqUpdateSiblingsAndChildren -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'pathParent' => $sPathParent,
			'aORb' => $aORb,
			'lengthPathParent' => $lengthPathParent,
			'startWithPathParent' => $sPathParent.'a%',
			'nRankDeleted' => $nRankDeleted)) or die(print_r($reqUpdateSiblingsAndChildren->errorInfo()));		
			echo ('<br>'.$reqUpdateSiblingsAndChildren->rowCount()." lignes affectées dans reqUpdateSiblingsAndChildren<br>");
			$reqUpdateSiblingsAndChildren->closeCursor();  // attention la requete concerne les folders ET les notes 
	}
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>