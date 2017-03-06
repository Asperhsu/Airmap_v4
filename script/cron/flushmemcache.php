<?php
require("../common.php");

$Memcache = getMemcacheInstance();
$Memcache->flush();

$response = fetchDatasource("airmap.json");
memcacheSet('airmap', $response);