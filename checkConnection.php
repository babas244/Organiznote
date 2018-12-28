<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (!isset($_SESSION['id'])) {
	echo 'disconnected';
}
else {
	echo 'ok';
}
?>