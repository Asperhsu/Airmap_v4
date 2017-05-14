<?php
require("vendor/autoload.php");
include("env.php");

date_default_timezone_set('Asia/Taipei');

set_exception_handler(function($e){
    $code = $e->getCode();
    $msg = $e->getMessage();

    http_response_code($code ?: 400);
    echo $msg ?: 'Not Found';
});