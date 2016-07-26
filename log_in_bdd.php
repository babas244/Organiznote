<?php 
// connexion à la bdd
try {
	$bdd= new PDO('mysql:host=localhost;dbname=notes_persos', 'root', '');
}
catch (Exception $e) {
	die('Erreur : ' . $e->getMessage());
}
?>