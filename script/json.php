<?php
require("./common.php");

$prefix = "https://datasource.airmap.asper.tw/";

$urlInfo = parse_url($_SERVER['REQUEST_URI']);

$jsonType = call_user_func(function() use ($urlInfo){
	$matches = [];
	preg_match("/\/json\/([a-zA-Z-]+).json/", $urlInfo['path'], $matches);
	return isset($matches[1]) ? $matches[1] : null;
});

$response = memcacheGet($jsonType);
if( $response === false ){
	$context = stream_context_create(
		array(
			'ssl' => array('verify_peer' => false),
			'http' => array( 'method' => 'GET' )
		)
	);
	
	$url = $prefix . $jsonType . '.json';
	if( isset($urlInfo['query']) ){ $url .= "?" . $urlInfo['query']; }
	
	$response = file_get_contents($prefix . $jsonType . '.json?raw=1', false, $context);
	memcacheSet($jsonType, $response, 300);
}

setExpire();
jsonResponse($response);