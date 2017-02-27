<?php
require("./common.php");
require("env.php");

$prefix = "https://datasource.airmap.asper.tw/";

$urlInfo = parse_url($_SERVER['REQUEST_URI']);

$jsonType = call_user_func(function() use ($urlInfo){
	$matches = [];
	preg_match("/\/json\/([a-zA-Z0-9\-]+).json/", $urlInfo['path'], $matches);
	return isset($matches[1]) ? $matches[1] : null;
});

$response = memcacheGet($jsonType);
if( $response === false ){
	if( !strlen($jsonType) ){
		jsonResponse([]);
		syslog(LOG_WARNING, "jsonType is empty");
		exit;
	}

	$context = stream_context_create(
		array(
			'ssl' => array('verify_peer' => false),
			'http' => array( 'method' => 'GET' )
		)
	);
	
	$token = getenv("datasourcetoken", true) ?: getenv("datasourcetoken");
	$url = $prefix . $jsonType . '.json?token=' . $token;
	if( isset($urlInfo['query']) ){ $url .= "?" . $urlInfo['query']; }
	
	$response = file_get_contents($url, false, $context);
	memcacheSet($jsonType, $response, 300);
}

setExpire();
jsonResponse($response);