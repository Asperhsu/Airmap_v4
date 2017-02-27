<?php
function asset($folder, $path){
	if( $_SERVER['SERVER_NAME'] == "airmap.g0v.asper.tw" ){
		$prefix = "https://rawgit.com/Aspertw/Airmap_v4/master/assets/dist/";
		return $prefix . $path;
	}

	return '/' . $folder . '/' . $path;
}

function showGACode(){
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

function getMsg(){
	//TODO getmsg
	return null;
}