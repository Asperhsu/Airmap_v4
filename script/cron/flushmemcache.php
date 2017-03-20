<?php
require("bootstrap.php");

$Memcache = getMemcacheInstance();
$Memcache->flush();

$response = fetchDatasource("airmap.json");
memcacheSet('airmap', $response);