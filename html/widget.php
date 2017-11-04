<?php 
require ("bootstrap.php");

extract(getIdentity());
if (!strlen($op) || !strlen($group) || !strlen($id)) {
	header("HTTP/1.0 404 Not Found");
	die("404 Not Found");
}

switch ($op) {
	case 'create' :
		loadTemplate('create');
		exit;
		break;
	case 'text' :
		$site = fetchSite();
		loadTemplate('text');
		break;
	case 'marker' :
		$site = fetchSite();
		loadTemplate('marker');
		break;
	case 'thin' :
		$site = fetchSite();
		loadTemplate('thin');
		break;
}


function getIdentity()
{
	$path = parse_url($_SERVER['REQUEST_URI'])['path'];
	$path = urldecode($path);
	$path = str_replace('/widget/', '', $path);

	list($op, $identity) = explode("/", $path);
	list($group, $id) = explode("$", $identity);

	return compact('op', 'group', 'id');
}

function fetchSite()
{
	global $group, $id;

	$cacheKey = implode('-', ['lastest', $group, $id]);
	$response = memcacheGet($cacheKey);

	if ($response === false) {
		$response = fetchDatasource('json/query-lastest', http_build_query(compact('group', 'id')));
		memcacheSet($cacheKey, $response, 300);
	}

	$site = json_decode($response, true);
	if (!$site) {
		throw new Exception('Site Not Found');
	}

	return $site;
}

function getWidgetUrl($type)
{
	global $group, $id;
	$protocol = isHttps() ? 'https' : 'http';
	return sprintf("%s://%s/widget/%s/%s$%s", $protocol, $_SERVER['HTTP_HOST'], $type, $group, $id);
}

function loadTemplate($name)
{
	global $op, $group, $id, $site;
	$templatePath = env('APP_PATH') . "/script/widget";
	include ($templatePath . "/template_head.php");
	include ($templatePath . '/' . $name . '.php');
	include ($templatePath . "/template_foot.php");
}

function getIframeHtml($type, $height = 200)
{
	$url = getWidgetUrl($type);
	return sprintf('<iframe width="100%%" height="%s" frameborder="0" src="%s"></iframe>', $height, $url);
}