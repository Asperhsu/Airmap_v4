<?php
include(__DIR__ . "/../env.php");
date_default_timezone_set('Asia/Taipei');

$memcacheKeyPrefix = 'nGVA2HhYph5i1b8Byx8642Gw4s3ug1li';

function getMemCacheInstance(){
	$Memcache = new Memcached;

	if( php_sapi_name() == "cli" || 
		$_SERVER['HTTP_HOST'] == "airmap.asper.tw" ){
		$Memcache->addServer("127.0.0.1", 11211);
	}

	return $Memcache;
}

function memcacheGet($name){
	global $memcacheKeyPrefix;
	$memcache = getMemCacheInstance();

	return $memcache->get($memcacheKeyPrefix . $name);
}

function memcacheSet($name, $data, $expireSecs=300){
	global $memcacheKeyPrefix;
	$memcache = getMemCacheInstance();

	return $memcache->set($memcacheKeyPrefix.$name, $data, $expireSecs);
}

function setExpire($secs = 300){
	header("Cache-Control: max-age={$secs}, must-revalidate"); 		
	header("Expires: " . gmdate("D, d M Y H:i:s", time() + $secs) . " GMT");
}

function jsonResponse($response){		
	if( is_array($response) ){
		$response = json_encode($response);
	}

	header('Content-Type: application/json');
	echo $response;
	exit;
}

function fetchDatasource($url, $query=''){
	$token = @getenv("DS_TOKEN", true) ?: getenv("DS_TOKEN");
	$prefix = "https://datasource.airmap.asper.tw/";
	if( !strlen($token) ){ return false; }

	$resource  = $url . '?token=' . $token;
	$resource .= strlen($query) ? '&'.$query : '';

	$context = stream_context_create(
		array(
			'ssl' => array('verify_peer' => false),
			'http' => array( 'method' => 'GET' )
		)
	);
	
	$response = file_get_contents($prefix . $resource, false, $context);
	return $response;
}