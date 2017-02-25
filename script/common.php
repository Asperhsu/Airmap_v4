<?php
date_default_timezone_set('Asia/Taipei');

$Memcache = null;
$memcacheKeyPrefix = 'nGVA2HhYph5i1b8Byx8642Gw4s3ug1li';

function getMemcacheInstance(){
	global $Memcache;

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

function setExpire($secs = 1800){		
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