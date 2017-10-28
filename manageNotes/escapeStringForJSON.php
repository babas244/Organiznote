<?php 
function escapeStringForJSON($sString) {
	$arr["value"] = $sString;
	$tempArray = json_decode(json_encode($arr));  
	//var_dump($tempArray);
	return $tempArray->value;	
}
?>