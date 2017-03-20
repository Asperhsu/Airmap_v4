<?php 
require("bootstrap.php"); 

extract(getIdentity());
if(!strlen($op) || !strlen($group) || !strlen($id)){
	header("HTTP/1.0 404 Not Found");
	die("404 Not Found");
}

switch($op){
	case 'create':
		loadTemplate('create');
		exit;
		break;
	case 'text':
		$site = fetchSite();
		loadTemplate('text');
		break;
	case 'marker':
		$site = fetchSite();
		loadTemplate('marker');
		break;
}


function getIdentity(){
	$path = parse_url($_SERVER['REQUEST_URI'])['path'];
	$path = urldecode($path);
	$path = str_replace('/widget/', '', $path);

	list($op, $identity) = explode("/", $path);
	list($group, $id) = explode("$", $identity);

	return compact('op', 'group', 'id');
}

function fetchSite(){
	global $group, $id;

	$cacheKey = implode('-', ['lastest', $group, $id]);
	$response = memcacheGet($cacheKey);

	if($response === false){
		$response = fetchDatasource('query-lastest', http_build_query(compact('group', 'id')));
		memcacheSet($cacheKey, $response, 300);
	}

	$site = json_decode($response, true);
	if(!$site){ die("site Not Found"); }

	return $site;
}

function getWidgetUrl($op){
	global $group, $id;
	return sprintf("http://%s/widget/%s/%s$%s", $_SERVER['HTTP_HOST'], $op, $group, $id);
}

function loadTemplate($name){
	global $op, $group, $id, $site;
	$templatePath = env('APP_PATH') . "/script/widget";
	include($templatePath."/template_head.php"); 
	include($templatePath.'/'.$name.'.php');
	include($templatePath."/template_foot.php");
}