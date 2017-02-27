require("css/common.css");
require("css/map.css");

var Indicator = require("js/measure-indicator");
var DataSource = require("js/datasource-loader");
var siteTool = require("js/site-tool");
var LANG = require("js/lang");

//map boot
var optionsLatLng = getUrlLatLng();
var options = optionsLatLng ? {center: optionsLatLng, zoom:18} : {};
MapHandler.boot(options);
google.maps.event.addDomListener(window, "load", MapHandler.initMap);

//UI boot
LANG.boot();
Indicator.boot();

$("#loading").show().find(".msg").text('Loading Google Map');

$("body")
	.on('mapBootCompelete', function(){
		DataSource.boot();
		siteTool.boot();
		require("js/map-infowindow-layer");
		require("js/typeahead");

		$("#loading .msg").text('Loading sites')
	})
	.on("dataSourceLoadCompelete", function(e, data){
		siteTool.loadSites(data);
		$("#loading").hide();
	});

//parse location from hash
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

