<?php 
session_start();

include 'log_in_bdd.php';  /* include 'sessin AUthentication.php'; ???*/

if (!isset($_SESSION['id'])) { // il faudra améliorer le script pour les cas où une session est ouverte et un nouvel utilisateur se log
	$req = $bdd->prepare('SELECT id FROM users WHERE user = :user AND hashPass = :hashPass');
	if (isset($_COOKIE['user']) && isset($_COOKIE['hashPass'])) { // s'il y a des cookies de session, on vérifie qu'ils correspondent à un des users, et on ouvre la session
		$req->execute(array( // Vérification des cookies de connexion
			'user' => $_COOKIE['user'],
			'hashPass' => $_COOKIE['hashPass']));
			$resultat = $req->fetch();
		if ($resultat) {
			$_SESSION['id'] = $resultat['id']; // $resultat est une chaine de caracteres, ou ... un nb ??
		}
	}
	else {
		if (isset($_POST['user']) && isset($_POST['pass'])) {	// s'il n'y a pas de cookies de connexion on vérifie si user et mot de passe existent
			
			$hashPass = sha1($_POST['pass']); // Hachage du mot de passe // pas la peine de htmlspecialchars non ? OU sha1 peut générer du code ???
			$user = htmlspecialchars($_POST['user']);

			$req->execute(array( // Vérification des identifiants
			'user' => $user,
			'hashPass' => $hashPass));

			$resultat = $req->fetch();

			if (!$resultat) {
				echo 'Mauvais identifiant ou mot de passe !';
			}
			else { // Alors connexion car le mot de passe est correct
				$_SESSION['id'] = $resultat['id']; 
				if (isset($_POST['stayConnected'])) {
					setcookie('user',$user, time()+365*24*24*3600, null, null, false, true);
					setcookie('hashPass', $hashPass, time()+365*24*24*3600, null, null, false, true);
				}
			}
		}
		else {
			echo('Revenez à la page de connexion et entrez un identifiant et un mot de passe valide'); // attendre 2 s et rediriger ?
		}
	}
	$req->closeCursor(); 	
}
?>

<!DOCTYPE html>
<html>
    <head>
        <title>manageTopics</title>
        <meta charset="utf-8"/>
		<link rel="stylesheet" href="manageTopics.css" />
    </head>
    <body>
		<?php 
		if (isset($_SESSION['id'])) {
			echo "Bonjour, ".$_SESSION['id'].', vous êtes connecté.'; 
				
			// include 'log_in_bdd.php'; // besoin ou pas ??
			
			$req = $bdd -> prepare('SELECT topic,id FROM topics WHERE idUser= :idUser'); //
			$req -> execute (array (
				'idUser' => $_SESSION['id'])); 
			
			$topics = "";
			$atLeastOneCaetgory = false;
			
			while ($donnees = $req->fetch()) {
				$atLeastOneCaetgory = true;
				$topics .= "<div id=\"topic".$donnees['id']."\" onclick=\"document.location.href='manageNotes/index.php?idTopic=".$donnees['id']."'\">".$donnees['topic']."</div>";	
			}
			
			if ($atLeastOneCaetgory) {
				$topics = "<br><br>Vous possédez les <strong>ensembles de notes suivants</strong> :<br><br>" . $topics;
			}
			else {
				$topics = "<br><br>Vous n'avez pas encore de Notes.";		
			}
			
			echo $topics;
			?>
			<br><br>
			 
			<form method="post" action="createNewTopic.php">
				<fieldset>
					<legend>Créer un nouveau <strong>sujet</strong> de notes</legend>
					Titre :<input type="text" name="newTopic"><br><br>
					Couleur de fond :<input type="color" name="colorTopic"><br><br>
					<input type="submit" value="Envoyer">
				</fieldset>
			</form>
			<br><br><a href="logout.php"> Deconnexion </a>
		<?php
		}	
		?>		
		<br><br><a href="index.php"> vers la page d'accueil </a>
		<br>
	</body>
</html>