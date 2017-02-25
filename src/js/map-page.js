require("css/common.css");
require("css/map.css");

var Indicator = require("js/measure-indicator");
var DataSource = require("js/datasource-loader");
var siteTool = require("js/site-tool");
var LANG = require("js/lang");

var optionsLatLng = getUrlLatLng();
var options = optionsLatLng ? {center: optionsLatLng, zoom:18} : {};
MapHandler.boot(options);
google.maps.event.addDomListener(window, "load", MapHandler.initMap);

LANG.boot();
Indicator.boot();
$("body")
	.on('mapBootCompelete', function(){
		DataSource.boot();
		siteTool.boot();
		require("js/map-infowindow-layer");
	})
	.on("dataSourceLoadCompelete", function(e, source, data){
		siteTool.loadSites(data);		
	});


function getUrlLatLng(){
	var param = location.href.replace(location.protocol + '//' + location.host + '/', '');

	if(param.indexOf('@') > -1){
		var latLng = param.replace('@', '').split(',', 2);
		return {
			lat: parseFloat(latLng.shift()),
			lng: parseFloat(latLng.shift()),
		}
	}

	return null;
}

