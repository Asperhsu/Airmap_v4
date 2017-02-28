<?php
require("../common.php");

$Memcache = getMemcacheInstance();
$Memcache->flush();