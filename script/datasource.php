<?php
require("./common.php");

$urlInfo = parse_url($_SERVER['REQUEST_URI']);

if( strpos($urlInfo['path'], ".json") ){
	$jsonType = call_user_func(function() use ($urlInfo){
		$matches = [];
		preg_match("/\/json\/([a-zA-Z0-9\-]+).json/", $urlInfo['path'], $matches);
		return isset($matches[1]) ? $matches[1] : null;
	});

	if( !strlen($jsonType) ){
		jsonResponse([]);
		syslog(LOG_WARNING, "jsonType is empty");
		exit;
	}

	$response = memcacheGet($jsonType);
	if( $response === false ){
		$url = $jsonType . ".json";
		$query = isset($urlInfo['query']) ? $urlInfo['query'] : '';
		$response = fetchDatasource($url, $query);
	}
	memcacheSet($jsonType, $response, 300);
}


if( strpos($urlInfo['path'], "query") ){
	$queryType = call_user_func(function() use ($urlInfo){
		$matches = [];
		preg_match("/\/json\/([a-zA-Z0-9\-]+)/", $urlInfo['path'], $matches);
		return isset($matches[1]) ? $matches[1] : null;
	});

	$url = $queryType;
	$query = isset($urlInfo['query']) ? $urlInfo['query'] : '';
	$response = fetchDatasource($url, $query);
}

setExpire();
jsonResponse($response);