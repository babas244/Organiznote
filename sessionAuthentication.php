<?php
if (!isset($_SESSION['id'])) {
	
	if (isset($_COOKIE['user']) && isset($_COOKIE['hashPass'])) { // s'il y a des cookies de session, on v�rifie qu'ils correspondent � un des users, et on ouvre la session
		$req = $bdd->prepare('SELECT id FROM users WHERE user = :user AND hashPass = :hashPass');
		$req->execute(array( 	// V�rification des cookies de connexion
			'user' => $_COOKIE['user'],
			'hashPass' => $_COOKIE['hashPass']));
		$resultat = $req->fetch();
		if ($resultat) {		
			$_SESSION['id'] = $resultat['id'];
			$_SESSION['user']= $_COOKIE['user'];
		}
		$req->closeCursor();
	}
	else {
		header ('Location: index.php');		// att! Ce chemin va d�pendre de o� on inclut la page ??
		exit;
	}
}

?>