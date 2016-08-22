<?php 
session_start();

// Suppression des variables de session et de la session
$_SESSION = array();
session_destroy();

// Suppression des cookies de connexion automatique
setcookie('user', '');
setcookie('hashpass', '');

header ('Location: index.php');
?>


<!DOCTYPE html>
<html>
    <head>
        <title>page de session</title>
        <meta charset="utf-8"/>
    </head>
    <body>
		Ca y est, vous êtes déconnecté de votre compte.
		<br><br><a href="index.php"> Revenir vers la page de connexion </a>
		
	</body>
</html>