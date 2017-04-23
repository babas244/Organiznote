<?php 
session_start();

require 'log_in_bdd.php';  /* require 'sessin AUthentication.php'; ???*/

if (!isset($_SESSION['id'])) {
	$req = $bdd->prepare('SELECT id FROM users WHERE user = :user AND hashPass = :hashPass');
	if (isset($_COOKIE['user']) && isset($_COOKIE['hashPass'])) { // s'il y a des cookies de session, on vérifie qu'ils correspondent à un des users, et on ouvre la session
		$req->execute(array( // Vérification des cookies de connexion
			'user' => $_COOKIE['user'],
			'hashPass' => $_COOKIE['hashPass']));
			$resultat = $req->fetch();
		if ($resultat) {
			$_SESSION['id'] = $resultat['id']; // $resultat est une chaine de caracteres, ou ... un nb ??
			$_SESSION['user'] = $_POST['user'];
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
				echo '<br><br><a href="index.php"> vers la page d\'accueil </a>';
			}
			else { // Alors connexion car le mot de passe est correct
				$_SESSION['id'] = $resultat['id'];
				$_SESSION['user'] = $user;
				//require_once 'define CONSTANT domain.php';
				if (isset($_POST['stayConnected'])) {
					setcookie('user',$user, time()+365*24*3600, null, null, false, true); //, '/', DOMAIN , false, true);
					setcookie('hashPass', $hashPass, time()+365*24*3600, null, null, false, true); // , '/', DOMAIN , false, true);
				}
			}
		}
		else {
			echo('Revenez à la page de connexion et entrez un identifiant et un mot de passe valide'); // attendre 2 s et rediriger ?
			echo '<br><br><a href="index.php"> vers la page d\'accueil </a>';
		}
	}
	$req->closeCursor(); 	
}
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Organiznotes - manage Topics</title>
        <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
		<meta name="robots" content="noindex,nofollow">
		<link rel="stylesheet" href="manageTopics.css" />
    </head>
    <body>
		<?php 
		if (isset($_SESSION['id'])) {
			echo "Bonjour, ".$_SESSION['user'].', vous êtes connecté.  '; 
			echo '<a href="logout.php">(se déconnecter)</a>';	
			// require 'log_in_bdd.php'; // besoin ou pas ??
			
			$req = $bdd -> prepare('SELECT topic,id,colorBackGround,colorFont FROM topics WHERE idUser= :idUser'); //
			$req -> execute (array (
				'idUser' => $_SESSION['id'])); 
			
			$topics = "";
			$atLeastOneCaetgory = false;
			
			while ($donnees = $req->fetch()) {
				$atLeastOneCaetgory = true;
				$topics .= "<div id=\"topic".$donnees['id']."\" style=\"Background-color : ".$donnees['colorBackGround'].";color : ".$donnees['colorFont']."\" onclick=\"document.location.href='manageNotes/manageNotes.php?idTopic=".$donnees['id']."'\">".$donnees['topic']."</div>";
			}
			
			if ($atLeastOneCaetgory) {
				$topics = "<br><br>Vous possédez les <strong>ensembles de notes suivants</strong> :<br><br>" . $topics;
			}
			else {
				$topics = "<br><br>Vous n'avez pas encore de Notes. <Br>Créez un nouveau sujet ci-dessous et donnez lui des couleurs pour le rendre facilement identifiable.";		
			}
			
			echo $topics;
			?>
			<br><br>
			 
			<form method="post" action="createNewTopic.php">
				<fieldset>
					<legend>Créer un nouveau <strong>sujet</strong> de notes</legend>
					Titre :<input type="text" name="newTopic"  maxlength="254"><br><br>
					Couleur de fond :<input type="color" id="colorBackGround" name="colorBackGround" value="#ffff11" onchange="updateApercu()"><br><br>
					Couleur du texte : <input type="color" id="colorFont" name="colorFont" value="#000000" onchange="updateApercu()"><br><br>
					Aperçu : <div id="apercu">Sujet</div><br><br>
					<input type="submit" value="Envoyer">
				</fieldset>
			</form>
		<?php
		}
		?>
		<script>
			updateApercu();
			function updateApercu () {
				document.getElementById("apercu").style.backgroundColor = document.getElementById("colorBackGround").value;
				document.getElementById("apercu").style.color = document.getElementById("colorFont").value;				
			}
		</script>
		<br>
	</body>
</html>