<!DOCTYPE html>
<html>
    <head>
        <title>Index</title>
        <meta charset="utf-8"/>
    </head>
    <body>
		
		<?php
		$sCategoriePere = "1a2";
		$idUser = "23";
		$idTopic = "5";
		
		include '../../log_in_bdd.php';

		$req = $bdd -> prepare('SELECT idNote, content, levelInTree, NbOfItems FROM notes WHERE idUSer=:idUser AND idTopic=:idTopic AND idNote LIKE :aTrouver AND idNote NOT LIKE :categoriepere AND isCategory=\'1\' ORDER BY idNote');
		$req -> execute(array(
		'idUser'=> $idUser,
		'idTopic' => $idTopic,
		'aTrouver' => $sCategoriePere.'%',
		'categoriepere' => $sCategoriePere));
				
		$sCategoriesRecuperees = "";

		while ($donnees = $req->fetch()) {
			$sCategoriesRecuperees .= $donnees['idNote'] . "|" . $donnees['content'] . "|" . $donnees['levelInTree'] . "|" . $donnees['NbOfItems'] . "|";
		}

		echo substr($sCategoriesRecuperees, 0, -1); //il faut enlever le dernier |

		$req->closeCursor();	

		?>
		
	</body>
</html>