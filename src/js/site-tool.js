var Site = require("js/site-model");

var showSitesInMap = true;
var sites = [];
var groups = {};

var activeGroups = null;
var activeStatus = null;

function addSite(Site){
	sites.push(Site);
}

function clearSites(){
	for(var i in sites){
		var site = sites[i];
		var marker = site.getMarker();
		if(marker){ marker.setMap(null); }
		delete sites[i];
	}
	sites = [];
}
exports.clear = clearSites;

function getGroups(){
	if( Object.keys(groups).length ){
		return groups;
	}

	for(var i in sites){
		var site = sites[i];
		var siteGroup = site.getProperty('SiteGroup');

		if( siteGroup.length ){
			if(!groups[siteGroup]){ groups[siteGroup] = 0;	}
			groups[siteGroup]++;
		}
	}
	return groups;
}
exports.getGroups = getGroups;

function countSitesInView(){
	var sitesCountInView = 0;
	var Bounds = MapHandler.getInstance().getBounds();
	for(var i in sites){
		var site = sites[i];
		if( Bounds && Bounds.contains(site.getPosition()) && site.getMarker() && site.getMarker().getMap() ){
			sitesCountInView++;
		}
	}
	$("#info-on-map").text(sitesCountInView);
}

function bindEvents(){
	MapHandler.addListener('bounds_changed', function(){
		countSitesInView();
	});

	$("body")
		.on("site_changeCategory", function(e, actives){
			countSitesInView();
			changeGroups(actives);
		})
		.on("toggleLayer", function(e, type, state){
			if( type != 'siteLayer'){ return; }
			toggleSitesInMap(state);
		})
		.on("filterStatus", function(e, actives){
			countSitesInView();
			filterAnalysisStatus(actives);
		})
		.on("indicatorTypeChange", function(e, type){
			updateMarkers();
		});
}

function boot(){
	bindEvents();
}
exports.boot = boot;

function loadSites(data){
	if(!data || !data.length){ return false; }
	clearSites();

	for(var i in data){
		var site = new Site(data[i]);
		if( !site.isValid() ){ continue; }

		site.createMarker({onMap: false});
		addSite(site);
	}
	
	$("body").trigger("sitesLoaded", [getGroups()]);
	countSitesInView();
}
exports.loadSites = loadSites;

function toggleSitesInMap(show){
	if( typeof show == "undefined" ){
		showSitesInMap = !showSitesInMap;
	}else{
		showSitesInMap = !!show;
	}			

	for(var i in sites){
		var site = sites[i];
		site.toggleMarker(showSitesInMap);
	}
	return showSitesInMap;
}
exports.toggleLayer = toggleSitesInMap;

function isInVisibleGroup(actives, Site){
	var group = Site.getProperty('SiteGroup');
	return actives.indexOf(group) > -1;
}

function isInVisibleStatus(actives, Site){
	var status = Site.getProperty('supposeStatus');
	
	status = status === null ? ['normal'] : status.split('|');

	var isShow = false;
	status.map(function(stat){
		isShow = isShow || actives.indexOf(stat) > -1;
	});
	return isShow;
}

function filterActiveSites(){
	for(var i in sites){
		var Site = sites[i];

		var inGroup = activeGroups === null ? true : isInVisibleGroup(activeGroups, Site);
		var inStatus = activeStatus === null ? true :  isInVisibleStatus(activeStatus, Site);

		Site.toggleMarker(inGroup && inStatus);
	}
}

function changeGroups(actives){
	if(!actives){ return false; }

	activeGroups = actives;
	filterActiveSites();
}
exports.changeGroups = changeGroups;

function filterAnalysisStatus(actives){
	if(!actives){ return false; }

	activeStatus = actives;
	filterActiveSites();
}
exports.filterStatus = filterAnalysisStatus;

function updateMarkers(){
	for(var i in sites){
		var Site = sites[i];
		Site.updateMarkerColor();
	}
}
exports.updateMarkers = updateMarkers;

function getVoronoiData(){
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
}
exports.getVoronoiData = getVoronoiData;

function search(string){
	if( !string || !string.length ){ return {}; }

	var results = [];
	sites.map(Site => {
		var searched = Site.match(string);
		if(searched){
			searched.map(value => {
				results.push({
					name: value,
					instance: Site,
				});
			});
		}
	});
	
	return results;
}
exports.search = search;