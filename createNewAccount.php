<?php 
// vérifier si personne n'est déjà connecté sur le site pour accéder à cette page ??

if (isset($_POST['user']) && isset($_POST['pass']) && isset($_POST['rePass']) && isset($_POST['email'])) {

	if ($_POST['user']=="") {
		echo "- le champ du nom d'utilisateur est vide.<br><br>"; //à faire du côté client plutot
		$user = NULL;
	}
	else {
		$user = htmlspecialchars($_POST['user']);
	}

	if ($_POST['pass']=="") {
		echo "- le champ du mot de passe est vide.<br><br>";
		$hashPass = NULL;
	}	
	else {
		if ($_POST['pass']==$_POST['rePass']) {
			$hashPass = htmlspecialchars(sha1($_POST['pass']));
		}
		else {
			echo "- les deux mot de passes ne se correspondent pas.<br><br>";
			$hashPass = NULL; 
		}
	}


	if ($_POST['email']=="") {
		$email = "";
		$emailIsCorrect = true;
	} 
	else {
		$email = htmlspecialchars($_POST['email']);
		// adresse email de forme valide ?
		if (!preg_match("#^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$#", $_POST['email'])){
			echo ' - l\'adresse ' . $_POST['email'] . ' n\'est pas valide, recommencez ! Ou n\'en mettez pas.<br>';
			$emailIsCorrect = false;
		}
		else {
			$emailIsCorrect = true;
		}
	}
		

	if ($user && $hashPass && ($emailIsCorrect || $email=="")) {

		require 'log_in_bdd.php';
	
		//tester si le nom d'user existe déjà
		$reqUserExists = $bdd->prepare('SELECT user FROM users WHERE user= :user');
		$reqUserExists->execute(array('user' => $user));
		
		$resultat = $reqUserExists->fetch();
		if ($resultat) {
			echo "- il faut choisir un autre nom d'utilisateur car celui-ci est déjà pris.<br>"; 
		}
		else {
			// Insertion
			$reqUserExists -> closeCursor();
			
			$reqInsertUser = $bdd->prepare('INSERT INTO users(user, hashPass, email, dateInscription) VALUES(:user, :hashPass, :email, CURDATE())');
			$reqInsertUser->execute(array(
				'user' => $user,
				'hashPass' => $hashPass,
				'email' => $email)); // ne faut-il pas aussi démarrer la session ?? SI !!
			$reqInsertUser -> closeCursor();
			
			session_start();
			
			$reqGetIdUser = $bdd -> prepare('SELECT id FROM users WHERE user=:user'); // ouverture de la session
			$reqGetIdUser -> execute(array(
				'user' => $user));
			$result = $reqGetIdUser -> fetch();
			$idUser = $result["id"];
			$reqGetIdUser -> closeCursor();
			
			$_SESSION['id'] = $idUser;	
			$_SESSION['user'] = $user;
			header ('Location: manageTopics.php');		
			exit;
			 
		}
	}

	
}

?>

<!DOCTYPE html>
<html>
    <head>
        <title>page de session</title>
        <meta charset="utf-8"/>
		<meta name="robots" content="noindex,nofollow">
    </head>
    <body>
		<br><br><a href="index.php"> vers la page d'accueil </a>
	</body>
</html>