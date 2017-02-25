var MapHandler = (function(){
	var userOptions = {};
	var instance = null;
	var googleApi = null;
	var language = 'zh-TW';
	var container = '#map-container';

	var getMapOption = function(userOptions){
		var options = {
			streetViewControl: true,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: googleApi.MapTypeControlStyle.HORIZONTAL_BAR,
				position: googleApi.ControlPosition.TOP_RIGHT,
				mapTypeIds: [
					googleApi.MapTypeId.ROADMAP, 
					googleApi.MapTypeId.SATELLITE, 
					googleApi.MapTypeId.HYBRID, 
					googleApi.MapTypeId.TERRAIN,
				]
			},
			zoomControl: true,
			zoomControlOptions: {
				position: googleApi.ControlPosition.RIGHT_BOTTOM
			},
			scaleControl: true,
			center: {lat: 23.839775, lng: 121.062213},
			zoom: 7,
		};

		if(userOptions){ options = $.extend({}, options, userOptions); }

		return options;
	};

	var addUserLocationButton = function(map){				
		var findZoomLevelByAccuracy = function(accuracy){
			if( parseFloat(accuracy) <= 0 ){ return 12; }
			//591657550.500000 / 2^(level-1)
			var level = ( Math.log(591657550.500000/accuracy) / Math.log(2) ) + 1;
			return Math.floor(level);
		};

		var $element = $([
			"<div id='geoLocate'>",
			"<button>", 
			"<div class='icon-gps'></div>",
			"</button>",
			"</div>"
		].join(''));
		var $icon = $element.find(".icon-gps");
		
		googleApi.event.addListener(map, 'dragend', function() {
			$icon.removeClass('gps-located gps-unlocate');
		});

		var animateInterval;
		$element.find("button").click(function(){
			if(animateInterval){				
				$icon.removeClass('gps-located gps-unlocate');
				clearInterval(animateInterval);
				animateInterval = null;
				return;
			}

			animateInterval = setInterval(function(){
				if( $icon.hasClass('gps-unlocate') ){
					$icon.removeClass('gps-unlocate');
				}else{
					$icon.addClass('gps-unlocate');
				}
			}, 500);

			var latlng = $icon.data('latlng');
			var zoom = $icon.data('zoom');
			if(latlng){
				map.setCenter(latlng);
				map.setZoom(zoom || 12);

				$icon.removeClass('gps-unlocate').addClass('gps-located');
				clearInterval(animateInterval);
				animateInterval = null;
				return; 
			}

			// var url = "http://ip-api.com/json";
			var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCDRRT8it4AZpwbORhHeqoi2qrWDmQqD48";
			$.ajax({
				dataType: 'json',
				method: 'POST',
				url: url
			}).success(function(data){
				$icon.removeClass('gps-located gps-unlocate');
				
				if( data.location.lat && data.location.lng ){
					latlng = new googleApi.LatLng(data.location.lat, data.location.lng);
					zoom = findZoomLevelByAccuracy(data.accuracy);
					if( zoom > 14 ){ zoom = 14; }

					map.setCenter(latlng);
					map.setZoom(zoom);

					$icon.data('latlng', latlng).data('zoom', zoom).addClass('gps-located');
				}
			}).complete(function(){
				clearInterval(animateInterval);
				animateInterval = null;
			});	
		});

		var controlDiv = $element[0];
		controlDiv.index = 1;
		map.controls[googleApi.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	};

	var initMap = function(){
		googleApi = google.maps;
		var options = $.extend({}, getMapOption(), userOptions);		
		
		instance = new googleApi.Map(
			document.getElementById(container.replace('#', '')), 
			options
		);

		addUserLocationButton(instance);

		$("body").trigger("mapBootCompelete");
	};

	var loadScript = function() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyBfhb3bOt_jBPFN2WDzkhX8k518Yc7CLBw&callback=MapHandler.initMap';
        script.src += '&language=' + language;
        
        script.id = "google-maps-script";
        document.body.appendChild(script);
    } 

    

	return {
		boot: function(options){
			userOptions = options || {};
			//loadScript();
		},
		getContainer: function(){
			return container;
		},
		getInstance: function(){
			return instance;
		},
		getApi: function(optons){
			return googleApi;
		},
		createLatLng: function(lat, lng){
			return new googleApi.LatLng(lat, lng);
		},
		createSize: function(w, h){
			return new googleApi.Size(w, h);
		},
		createPoint: function(w, h){
			return new googleApi.Point(w, h);
		},
		createOverlayView: function(w, h){
			return new googleApi.OverlayView();
		},
		createInfoWindow: function(optons){
			return new googleApi.InfoWindow(optons);
		},
		createMarker: function(options){
			if( typeof options.map == "undefined" ){ options.map = this.getInstance(); } 
			return new googleApi.Marker(options);
		},
		addListener: function(event, cb, instance){
			instance = instance || this.getInstance();
			return googleApi.event.addListener(instance, event, cb);
		},
		addDomListener: function(event, cb, element){
			return googleApi.event.addDomListener(element, event, cb);
		},
		initMap: initMap,
		changeLanguage: function(lang){
			if( !lang || lang == language ){ return false; }

			var oldScript = document.getElementById("google-maps-script");
			oldScript.parentNode.removeChild(oldScript);
			// console.log(google.maps);
			if( typeof google != "undefined" ){ delete google.maps; }

			language = lang;
			loadScript(lang);
		}
	}
})();

//events
// $("body").on("languageChange", function(e, lang){
// 	MapHandler.changeLanguage(lang);
// });
// 
module.exports = MapHandler;