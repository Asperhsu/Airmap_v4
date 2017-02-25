<?php
$param = parseParam();


$imgPadding = 2;
$borderWidth = 5;
$borderColor = "#FFFFFF";
$circleRadius = strlen($param['size']) ? intval($param['size']) : 50;
$fillColor = strlen($param['color']) ? $param['color'] : "";
$text = strlen($param['text']) ? $param['text'] : '';
$fontColor = getContrastYIQ($fillColor);
$fontPath = "./consola.ttf";

$img = imagecreatetruecolor($circleRadius+$imgPadding, $circleRadius+$imgPadding);
$imgCenter = ($circleRadius+$imgPadding)/2;

//transparent background
imagesavealpha($img, true);
$transparentColor = imagecolorallocatealpha($img, 0, 0, 0, 127);
imagefill($img, 0, 0, $transparentColor);

//draw border
$imgBorderColor = hexColorAllocate($img, $borderColor, 0.5);
// imagefilledellipse($img, $imgCenter, $imgCenter, $circleRadius, $circleRadius, $imgBorderColor); 
for($i=0; $i<=$borderWidth; $i++){
	imagearc($img, $imgCenter, $imgCenter, $circleRadius-$i, $circleRadius-$i,  0, 360, $imgBorderColor);
}

//draw inner circle
if(strlen($fillColor)){
	$imgCircleColor = hexColorAllocate($img, $fillColor, 0.7);
	imagefilledellipse($img, $imgCenter, $imgCenter, $circleRadius-$borderWidth, $circleRadius-$borderWidth, $imgCircleColor);
}

//text
// $xOffset = 0; $yOffset = 2;
// $fontSize = 20;
// switch(strlen($text)){
// 	case '1': $xOffset=$circleRadius/6-0.5; break;
// 	case '2': break;
// 	case '3': $xOffset=-4; $fontSize=14; break;
// }
// $textPosition = ($circleRadius + $imgPadding - $fontSize - 5) / 2;
// $imgTextColor = hexColorAllocate($img, $fontColor, 1);
// imagettftext($img, $fontSize, 0, $textPosition+$xOffset, $textPosition+$fontSize+$yOffset, $imgTextColor, $fontPath, $text);

//output
header('Content-Type: image/png');
imagepng($img);

function hexColorAllocate($im, $hex, $opacity=1){
    $hex = ltrim($hex,'#');
    $a = hexdec(substr($hex,0,2));
    $b = hexdec(substr($hex,2,2));
    $c = hexdec(substr($hex,4,2));

    $alpha = (1-$opacity) * 127;
    return imagecolorallocatealpha($im, $a, $b, $c, $alpha); 
}

function getContrastYIQ($hexcolor){
	$r = hexdec(substr($hexcolor,0,2));
	$g = hexdec(substr($hexcolor,2,2));
	$b = hexdec(substr($hexcolor,4,2));
	$yiq = (($r*299)+($g*587)+($b*114))/1000;
	return ($yiq >= 128) ? 'black' : 'white';
}

function getContrast50($hexcolor){
    return (hexdec($hexcolor) > 0xffffff/2) ? 'black':'white';
}

function parseParam(){
	$path = $_SERVER['REQUEST_URI'];

	$pattern = '/\/image\/markerIcon\//';
	$path = preg_replace($pattern, '', $path);
	$param = explode("/", $path);

	return [
		'color' => $param[0],
		'size' => $param[1],
		'text' => $param[2],
	];
}