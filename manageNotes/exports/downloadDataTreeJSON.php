<?php
session_start();
header('Content-type: txt/json; charset=UTF-8');
require '../../log_in_bdd.php';
require '../../isIdTopicSafeAndMatchUser.php';
$idTopic = htmlspecialchars($_GET["idTopic"]);
 
if (isset($_SESSION['id']) && isset($_GET["idTopic"]) && isset($_GET["sParentPathOfTreeToExport"])) {
	
	$sParentPathOfTreeToExport = htmlspecialchars($_GET["sParentPathOfTreeToExport"]);
	
	$reqRetrieveParentContent = $bdd -> prepare('SELECT content FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote=:pathParent'); // on retrouve le content de pathParent et on vérifie qu'il existe bien en même temps dans la bdd
		$reqRetrieveParentContent -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic,
		'pathParent' => $sParentPathOfTreeToExport)) or die(print_r($reqRetrieveParentContent->errorInfo()));
		
		while ($data = $reqRetrieveParentContent->fetch()) {
			$contentParent = $data['content'];
		
		}
		
		if ($reqRetrieveParentContent->rowCount() == 0) {
			header('Content-Disposition: attachment; filename="exportDataTree_ERREUR EXPORT (voir message erreur dedans).json"');
			echo '{"error":"le fichier ne peut pas être écrit, car il est impossible de trouver la catégorie parent dans la base de données. Contacter l\'administrateur du site si l\'erreur se répète"}'; 
			exit;
		}

		
	$reqRetrieveParentContent->closeCursor();		
	
	
	$reqRetrieveTree = $bdd -> prepare('SELECT idNote, content, dateCreation, latitude, longitude, accuracyPosition  FROM notes WHERE idUser=:idUser AND idTopic=:idTopic AND idNote LIKE :startWithPathParent AND idNote NOT LIKE :pathParent ORDER BY IdNote');
		$reqRetrieveTree -> execute(array(
		'idUser' => $_SESSION['id'],
		'idTopic' => $idTopic,
		'startWithPathParent' => $sParentPathOfTreeToExport.'%',
		'pathParent' => $sParentPathOfTreeToExport)) or die(print_r($reqRetrieveTree->errorInfo()));
		
		$stringJSON = '[';
		
		$lengthOfsParentPathOfTreeToExport = strlen($sParentPathOfTreeToExport);
		
		while ($data = $reqRetrieveTree->fetch()) {
			$stringJSON .='{"'.substr($data['idNote'],$lengthOfsParentPathOfTreeToExport).'":["'.$data['content'].'","'.$data['dateCreation'].'","'.$data['latitude'].'","'.$data['longitude'].'","'.$data['accuracyPosition'].'"]},';
		}
		
		if ($reqRetrieveTree->rowCount() == 0) {
			header('Content-Disposition: attachment; filename="exportDataTree_ERREUR EXPORT (voir message erreur dedans).json"');
			echo '{"error":"le fichier est vide, car le dossier sélectionné pour l\'exportation n\'a pas de descendants."}'; 
			exit;
		}

	$reqRetrieveTree->closeCursor();		
	
	$stringJSON = substr($stringJSON,0,-1).']';
	header('Content-Disposition: attachment; filename="exportDataTree_'. substr($_SESSION['user'],0,10) .'_'. substr($_SESSION['topic'],0,10) .'_'. substr($contentParent,0,10) .'_('. $sParentPathOfTreeToExport . ').json"');
	echo $stringJSON;
}

else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
	
?>