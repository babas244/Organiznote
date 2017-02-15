<?php
if (isset($_COOKIE['user'])) {
	header ('Location: manageTopics.php');		
	exit;
}
?>
 
<!DOCTYPE html>
<html>
    <head>
        <title>Index</title>
        <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
		<link rel="stylesheet" href="index.css" />
    </head>
    <body>
		<br><br><h1>Organiznote</h1><br><br><br><br>
		<form method="post" action="manageTopics.php"> 
			<fieldset>
				<legend>Connexion</legend>
				Pseudo : <input type="text" name="user" autofocus><br><br>
				Mot de passe : <input type="password" name="pass"><br><br>
				<input type="checkbox" name="stayConnected"> Rester connecté<br>
				<input type="submit" value="Se connecter">
			</fieldset>
		</form>
		<form method="post" action="createNewAccount.php"> 
			<fieldset>
				<legend>Créer un nouveau compte</legend>
				Pseudo : <input type="text" name="user"><br><br>
				Mot de passe : <input type="password" name="pass"><br><br>
				Entrer à nouveau votre mot de passe : <input type="password" name="rePass"><br><br>
				Adresse email (facultatif) : <input type="email" name="email"><br><br>
				<input type="submit" value="Créer">
			</fieldset>
		</form>
			
		
	</body>
</html>