<?php
header("Content-Type: text/plain");

//$profondeur_d_arborescence = 5; // nb de chiffres sur lesquels est codée d'une catégoeir 

$sIdNumeroCategorieDepliee = (isset($_GET["sIdNumeroCategorieDepliee"])) ? $_GET["sIdNumeroCategorieDepliee"] : NULL;


if (! $sIdNumeroCategorieDepliee) {
	echo "$sIdNumeroCategorieDepliee n'est pas définie...!!!";
} /* else {
echo "Le numéro de catégorie est " . $sIdNumeroCategorieDepliee;
} */
 
 
if ($sIdNumeroCategorieDepliee == "catRacine") {
	$niveauDeCategorie = "0";
} else {
//echo (substr($sIdNumeroCategorieDepliee, 0, 3));
$chiffresCategorie = explode("a",substr($sIdNumeroCategorieDepliee, 3)); 
//echo ($chiffresCategorie[0] ." yo ". $chiffresCategorie[1]);
$niveauDeCategorie = count($chiffresCategorie);	
}

for ( $i = 0 ; $i < $niveauDeCategorie ; $i++) { //on ne teste pas le cas ou on envoie un seul caractère ??? Faire un while ??
	if (!ctype_digit($chiffresCategorie[$i])) {
		exit('$niveauDeCategorie contient autre chose que des chiffres...'); // faire deux niveaux séparés d'alertes
	} else if ($chiffresCategorie[$i]>1000) {
		exit('Vous avez plus que les 1000 catégories permises ou il y a un problème dans la requête');
	}
}
	
try
	{
		$bdd= new PDO('mysql:host=localhost;dbname=notes_persos', 'root', '');
	}
	catch (Exception $e)
	{
		die('Erreur : ' . $e->getMessage());
	}

switch ($niveauDeCategorie) {
	case 0:
		$req = $bdd->query('SELECT note FROM notes WHERE niveau_de_categorie<>0 AND niveau2=0 AND niveau3=0 AND niveau4=0 AND niveau5=0 ORDER BY niveau1');
		//echo ('case 0 !');
		break;
	case 1:
		$req = $bdd->prepare('SELECT note FROM notes WHERE niveau_de_categorie<>0 AND niveau1=:niveau1 AND niveau3=0 AND niveau4=0 AND niveau5=0 AND niveau2<>0 ORDER BY niveau2');
		//echo ('$chiffresCategorie[0] = ' . $chiffresCategorie[0]);
		$req->execute(array('niveau1' => $chiffresCategorie[0]));
		//echo ('case 1 !!');
		break;
	case 2:
		$req = $bdd->prepare('SELECT note FROM notes WHERE niveau_de_categorie<>0 AND niveau1=:niveau1 AND niveau2=:niveau2 AND niveau4=0 AND niveau5=0 AND niveau3<>0 ORDER BY niveau3');
		$req->execute(array('niveau1' => $chiffresCategorie[0], 'niveau2' => $chiffresCategorie[1]));
		//echo ('case 2 !!');
		break;		
} 	

//$sCategoriesRecuperees = implode ("|",$req->fetch()); marche pas..

$sCategoriesRecuperees = "";

while ($donnees = $req->fetch()) {
	$sCategoriesRecuperees .= $donnees['note'] . "|";
	//echo ($donnees['note']);
}

echo substr($sCategoriesRecuperees, 0, -1); //il faut enlever le dernier |

$req->closeCursor();
?>