<?php
header("Content-Type: text/plain");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sCutPath"]) && isset($_GET["sPathWhereToPaste"]) && isset($_GET["rowOfPasteFolder"])) {

	if ((preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sCutPath"])) && (preg_match("#^[0-9]{2}([a-b][0-9]{2})*$#", $_GET["sPathWhereToPaste"]))) {		
		
		$idTopic = htmlspecialchars($_GET["idTopic"]);
		$sCutPath = htmlspecialchars($_GET["sCutPath"]);
		$sPathWhereToPaste = htmlspecialchars($_GET["sPathWhereToPaste"]);
		$rowOfPasteFolder = htmlspecialchars($_GET["rowOfPasteFolder"]);
		
		include '../../log_in_bdd.php';		
		
		include '../../isIdTopicSafeAndMatchUser.php';
		
		// on update les noms de tous les paths descendants de sCutPath et aussi sCutPath
		$lengthCutPath = strlen($sCutPath); // on pourrait mettre le +1 ici au lieu de le recalculer dans la requete à chaque fois
		//echo $lengthCutPath;
		//exit;
		
		$reqUpdatePathFamilyOfCutPath = $bdd -> prepare('	UPDATE notes 
								SET idNote=CONCAT(:pathWhereToPaste , "a" , :rowOfPasteFolder, SUBSTRING(idNote, :lengthCutPath + 1)) 
								WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithCutPath');
			$reqUpdatePathFamilyOfCutPath -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic, 
			'pathWhereToPaste' => $sPathWhereToPaste,
			'rowOfPasteFolder' => $rowOfPasteFolder,
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
								SET idNote=CONCAT(:pathParent, "a" , LPAD((SUBSTRING(idNote,:lengthPathParent+2,2)-1),2,"0"),SUBSTRING(idNote,:lengthPathParent + 4)) 
								WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND convert(SUBSTRING(idNote,:lengthPathParent+2,2),signed) > :nRankDeleted');
		$reqUpdateSiblingsAndChildren -> execute(array(
			'idUser' => $_SESSION['id'],
			'idTopic' => $idTopic,
			'pathParent' => $sPathParent,
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