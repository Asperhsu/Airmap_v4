var Site = require("js/site-model");

var siteTool = (function(){
	var showLayer = true;
	var sites = [];
	var groups = {};

	var add = function(site){
		sites.push(site);
	};
	var clear = function(){
		for(var i in sites){
			var site = sites[i];
			if(site.toggleMarker){ site.toggleMarker(false); }
			delete sites[i];
		}
		sites = [];
	};
	var getGroups = function(){
		if( !Object.keys(groups).length ){
			for(var i in sites){
				var site = sites[i];
				var siteGroup = site.getProperty('SiteGroup');

				if( siteGroup.length ){
					if(!groups[siteGroup]){ groups[siteGroup] = 0;	}
					groups[siteGroup]++;
				}
			}
		}

		return groups;
	};

	var calcSitesInView = function(){
		var sitesCountInView = 0;
		var Bounds = MapHandler.getInstance().getBounds();
		for(var i in sites){
			var site = sites[i];
			if( Bounds && Bounds.contains(site.getPosition()) && site.getMarker().getMap() ){
				sitesCountInView++;
			}
		}
		$("#info-on-map").text(sitesCountInView);
	}

	var boot = function(){
		//bind events
		MapHandler.addListener('bounds_changed', function(){
			calcSitesInView();
		});

		$("body").on("site_changeCategory", function(e, actives){
			calcSitesInView();
		});
	}	

	return {
		boot: function(){
			//bind events
			MapHandler.addListener('bounds_changed', function(){
				calcSitesInView();
			});

			$("body").on("site_changeCategory", function(e, actives){
				calcSitesInView();
			});
		},
		add: add,
		clear: clear,
		getGroups: getGroups,
		calcSitesInView: calcSitesInView,
		changeGroups: function(activeGroups){
			for(var i in sites){
				var site = sites[i];
				var group = site.getProperty('SiteGroup');
				
				var isShow = activeGroups.indexOf(group) > -1;
				site.toggleMarker(isShow);
			}
		},
		loadSites: function(data){
			if(!data || !data.length){ return false; }
			clear();

			var validSiteCount = 0;
			var markers = [];

			for(var i in data){
				var site = new Site(data[i]);
				if( !site.isValid() ){ continue; }
				site.createMarker({onMap: false });
				markers.push(site.getMarker());
				add(site);
			}
			
			$("body").trigger("sitesLoaded", [getGroups()]);
			calcSitesInView();
		},
		toggleLayer: function(flag){
			if( typeof flag == "undefined" ){
				showLayer = !showLayer;
			}else{
				showLayer = !!flag;
			}			

			for(var i in sites){
				var site = sites[i];
				site.toggleMarker(showLayer);
			}
			return showLayer;
		},
		getVoronoiData: function(){
			var locations = [];
			var colors = [];
			for(var i in sites){
				var site = sites[i];

				var LatLng = site.getPosition();
				locations[i] = [LatLng.lat(), LatLng.lng()];
				colors[i] = site.getMeasureColor();
			}
			return {
				locations: locations,
				colors: colors,
			}	
		},
	}
})();

//events
$("body").on("site_changeCategory", function(e, actives){
	siteTool.changeGroups(actives);
});

$("body").on("toggleLayer", function(e, type, state){
	if( type != 'siteLayer'){ return; }
	siteTool.toggleLayer(state);
});

module.exports = siteTool;