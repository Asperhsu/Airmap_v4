<?php
require("bootstrap.php");

$response = fetchDatasource("airmap.json");
memcacheSet('airmap', $response, 300);

