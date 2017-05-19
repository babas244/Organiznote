<?php
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['id']) && isset($_GET["idTopic"])) {		
	
	require '../../log_in_bdd.php';		
	
	require '../../isIdTopicSafeAndMatchUser.php';

	$idTopic = htmlspecialchars($_GET["idTopic"]);
	
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
	$reqRetrieveLabels -> closeCursor();	
	
	$labelTitlesFetched = substr($labelTitlesFetched, 0, -1)."]"; // remplacer la virgule en fin de chaîne par un crochet 
	
	$labelsFetched = substr($labelsFetched, 0, -1)."]]"; // remplacer la virgule à la fin
	
	echo '{"title":['.$labelTitlesFetched.',"content":['.$labelsFetched.'}'; 		
}
else {
	echo 'Une des variables n\'est pas définie ou la session n\'est pas ouverte !!!';	// ajouter du html pour que ca s'affiche comme une box !!
}
?>