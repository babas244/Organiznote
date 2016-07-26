<?php 
// vérifier si personne n'est déjà connecté sur le site pour accéder à cette page ??

if (isset($_POST['user']) && isset($_POST['pass']) && isset($_POST['rePass']) && isset($_POST['email'])) {

	if ($_POST['user']=="") {
		echo "- le champ du nom d'utilisateur est vide.<br><br>";
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
			$hashPass = sha1($_POST['pass']);
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

		include 'log_in_bdd.php';
	
		//tester si le nom d'user existe déjà
		$req = $bdd->prepare('SELECT user FROM users WHERE user= :user');
		$req->execute(array('user' => $user));
		
		$resultat = $req->fetch();
		if ($resultat) {
			echo "- il faut choisir un autre nom d'utilisateur car celui-ci est déjà pris.<br>"; 
		}
		else {
			// Insertion
			$req = $bdd->prepare('INSERT INTO users(user, hashPass, email, dateInscription) VALUES(:user, :hashPass, :email, CURDATE())');
			$req->execute(array(
				'user' => $user,
				'hashPass' => $hashPass,
				'email' => $email)); // ne faut-il pas aussi démarrer la session ?? SI !!
			
			session_start();
			// $_SESSION['id'] = ....; a remplir avec requete avant !!	
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
    </head>
    <body>
		
	</body>
</html>