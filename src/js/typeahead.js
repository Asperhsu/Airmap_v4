var siteTool 			= require("js/site-tool");
var MapApi 				= MapHandler.getApi();
var MapInstance 		= MapHandler.getInstance();
var AutocompleteService = new MapApi.places.AutocompleteService();
var Geocoder 			= new MapApi.Geocoder;

function getPlaceLatLng(query){
	return new Promise((resolve, reject) => {
		var placeIDs = [];
		AutocompleteService.getQueryPredictions({ input: query }, function(predictions, status){
			if(status != MapApi.places.PlacesServiceStatus.OK) { return placeIDs; }

			predictions.forEach(function(prediction){
				placeIDs.push({
					placeID: prediction.place_id,
					name: prediction.description,
				})
			});
			resolve(placeIDs);
		});
	});
}

function placeToLatLng(placeID){
	return new Promise((resolve, reject) => {
		Geocoder.geocode({'placeId': placeID}, function(results, status) {
			if (status !== google.maps.GeocoderStatus.OK || !results[0] ) { return; }
			resolve(results[0].geometry.location);
		});
	});
}


var $input = $(".typeahead");
$input.typeahead({
	source: function(query, callback){
		var sites = siteTool.search(query);

		getPlaceLatLng(query).then(placeIDs => {
			callback(sites.concat(placeIDs));
		});
	},
	autoSelect: true,
	fitToElement: true,
	minLength: 3,
	displayText: function (item) {
		var icon = item.instance ? 'glyphicon-bookmark' : 'glyphicon-map-marker';
        return item.name + "#" + icon;
    },
	highlighter: function(item) {
		var parts = item.split('#');

		var query = this.query;
		var reEscQuery = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		var reQuery = new RegExp('(' + reEscQuery + ')', "gi");
		var text = parts[0].replace(reQuery, '<strong>$1</strong>');

		return '<span class="glyphicon ' + parts[1] + '"></span> ' + text;
	},
});
$input.change(function() {
	var current = $input.typeahead("getActive");
	if (!current) { return false; }

	if( current.instance ){
		var position = current.instance.getPosition();
		MapInstance.setCenter(position);
		MapInstance.setZoom(16);
	}

	if( current.placeID ){
		placeToLatLng(current.placeID).then(position => {
			MapInstance.setCenter(position);
			MapInstance.setZoom(16);
		});
	}
});