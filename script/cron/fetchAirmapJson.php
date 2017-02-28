<?php
require("../common.php");

$response = fetchDatasource("airmap.json");
memcacheSet('airmap', $response, 300);

