<?php
if (!isset($_SESSION['id'])) {
	
	if (isset($_COOKIE['user']) && isset($_COOKIE['hashPass'])) { // s'il y a des cookies de session, on vérifie qu'ils correspondent à un des users, et on ouvre la session
		$req = $bdd->prepare('SELECT id FROM users WHERE user = :user AND hashPass = :hashPass');
		$req->execute(array( 	// Vérification des cookies de connexion
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
		header ('Location: index.php');		// att! Ce chemin va dépendre de où on inclut la page ??
		exit;
	}
}

?>