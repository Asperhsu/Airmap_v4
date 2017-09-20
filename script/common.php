<?php
function getMemCacheInstance()
{
    $Memcache = new Memcached;

    if (php_sapi_name() == "cli" ||
        $_SERVER['HTTP_HOST'] == "airmap.asper.tw" ) {
        $Memcache->addServer("127.0.0.1", 11211);
    }

    return $Memcache;
}

function memcacheGet($name)
{
    $memcacheKeyPrefix = env('MEMCACHED_PREFIX');
    $memcache = getMemCacheInstance();

    return $memcache->get($memcacheKeyPrefix . $name);
}

function memcacheSet($name, $data, $expireSecs = 300)
{
    $memcacheKeyPrefix = env('MEMCACHED_PREFIX');
    $memcache = getMemCacheInstance();

    return $memcache->set($memcacheKeyPrefix.$name, $data, $expireSecs);
}

function setExpire($secs = 300)
{
    header("Cache-Control: max-age={$secs}, must-revalidate");
    header("Expires: " . gmdate("D, d M Y H:i:s", time() + $secs) . " GMT");
}

function jsonResponse($response)
{
    if (is_array($response)) {
        $response = json_encode($response);
    }

    header('Content-Type: application/json');
    echo $response;
    exit;
}

function fetchDatasource($url, $query = '')
{
    $token = env("DS_TOKEN");
    $prefix = "https://datasource.airmap.asper.tw/";
    // $prefix = "http://localhost:9080/";
    
    if (!strlen($token)) {
        return false;
    }
    $resource  = $url . '?token=' . $token;
    $resource .= strlen($query) ? '&'.$query : '';

    $context = stream_context_create(
        array(
            'ssl' => array('verify_peer' => false, "verify_peer_name" => false),
            'http' => array( 'method' => 'GET' )
        )
    );
    
    $response = file_get_contents($prefix . $resource, false, $context);
    return $response;
}

function env($index)
{
    return defined($index) ? constant($index) : false;
}

function asset($folder, $path)
{
    if (strpos($_SERVER['SERVER_NAME'], "localhost") !== false) {
        return '/' . $folder . '/' . $path;
    }
    
    $prefix = "https://rawgit.com/Aspertw/Airmap_v4/master/assets/dist/";
    return $prefix . $path;
}

function showGACode()
{
    echo <<<EOT
<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-55384149-4', 'auto');
			ga('send', 'pageview');
		</script>\r\n
EOT;
}

function getMsg()
{
    //TODO getmsg
    return null;
}

function isHttps()
{
    return $_SERVER['HTTPS'] == "on";
}
