var Helper = require("js/helper");
var Indicator = require("js/measure-indicator");

function Site(data){
	this.property = {};
	this.marker = null;

	this.setProperties(data);

	//events	
	$("body").on("indicatorTypeChange", function(e, type){
		this.updateMarkerColor();
	}.bind(this));
}

/**
 * test site is valid
 * @return {Boolean} [description]
 */
Site.prototype.isValid = function(){
	var item = this.property;

	//time filter
	if( moment().diff(moment(item.Data.Create_at), 'minutes') > 60 ){
		return false;
	}

	//location filter
	if( !item.LatLng || !item.LatLng.lng || !item.LatLng.lat ){
		return false;
	}

	return true;
};


/**
 * ===================
 * Property
 * ===================
 */

Site.prototype.setProperties = function(item){
	if( !item || !item.Data || !item.Data.Create_at ){
		return false;
	}

	this.property = item;
};

Site.prototype.getProperty = function(key){
	return Helper.getObjectValue(this.property, key);
};


/**
 * =============================
 * Shotcut to retrive property
 * =============================
 */

Site.prototype.getMeasure = function(measureType){
	if(['PM2.5', 'PM2.5_NASA', 'AQI'].indexOf(measureType) > -1 ){
		measureType = 'Dust2_5';
	}

	return this.getProperty('Data.'+measureType);
};

Site.prototype.getIdentity = function(){
	return this.getProperty('uniqueKey');
}

Site.prototype.getTitle = function(){
	return '[' + this.getProperty('SiteGroup') + '] ' + this.getProperty('SiteName');
}

Site.prototype.getMeasureColor = function(){
	var measureType = Indicator.getPresentType();
	var value = this.getMeasure(measureType);
	return value != null ? Indicator.getLevelColor(value) : 'transparent';
}

Site.prototype.getPosition = function(){
	var LatLng = this.getProperty('LatLng');
	if( LatLng && LatLng.lat && LatLng.lng ){
		if(MapHandler.getApi()){
			return MapHandler.createLatLng(LatLng.lat, LatLng.lng); 
		}else{
			return { lat: +LatLng.lat, lng: +LatLng.lng };
		}
	}
	return null;
}


/**
 * =====================
 * Remote Resource
 * =====================
 */

Site.prototype.fetchLastest = function(group, id, includeRaw=false){
	var urlTemplate = "https://datasource.airmap.asper.tw/query-lastest?group={{group}}&id={{id}}";
	if(includeRaw){ urlTemplate = urlTemplate+"&raw=1"; }
	
	var url = urlTemplate.replace('{{group}}', group).replace('{{id}}', id);
	return new Promise((resolve, reject) => {
		$.getJSON(url).then((data) => {
			if(Object.keys(data).length){
				this.setProperties(data);
				resolve(this);
			}else{
				resolve(null);
			}
		}, (err, exception) => {
			var errorText = 'Load Lastest Record Error: ';
			errorText += Helper.getAjaxErrorText(err, exception);

			reject(errorText);
		});
	});
};

Site.prototype.fetchHistory = function(offsetHours){
	var group 	= this.getProperty('SiteGroup');
	var id 		= this.getProperty('uniqueKey');
	var end 	= moment().unix();
	var start 	= moment.unix(end).subtract(parseInt(offsetHours), 'hours').unix();

	if(!group || !id || !start ){
		return false;
	}

	var urlTemplate = "https://datasource.airmap.asper.tw/query-history?group={{group}}&id={{id}}&start={{start}}&end={{end}}";
	var url = urlTemplate.replace('{{group}}', group).replace('{{id}}', id)
						 .replace('{{start}}', start).replace('{{end}}', end);

	return new Promise((resolve, reject) => {
		$.getJSON(url).then((history) => {
			var labels = [];
			var datasets = [];
			for(var index in history){
				var data = history[index];

				if(index == 'isotimes'){
					data.map(isoString => {
						var label = new Date(isoString);
						labels.push(label);
					});
					continue;
				}
				
				datasets.push({
					label: index,
					data: history[index],
				});
			}

			resolve({
				labels: labels,
				datasets: datasets,
			});
		}, (err, exception) => {
			var errorText = 'Load History Error: ';
			errorText += Helper.getAjaxErrorText(err, exception);

			reject(errorText);
		});
	});
};


/**
 * =======================
 * Marker
 * =======================
 */

Site.prototype.createMarker = function(options){
	options = options || {};	
	var position = this.getPosition();
	if( !position ){
		console.log("position not avaliable");
		return false;
	}

	var option = {
		'title': this.getTitle(),
		'position': position,
		'map': options.onMap ? MapHandler.getInstance() : null,
	};
	delete options.onMap;

	//get icon
	var icon = this.getIconSVG();
	// var icon = this.getIconImage();
	if(icon){ option['icon'] = icon; }

	this.marker = MapHandler.createMarker( $.extend({}, option, options) );

	MapHandler.addListener('click', function(){
		this.openInfoWindow();
	}.bind(this), this.marker);
}

Site.prototype.getMarker = function(){
	return this.marker;
}

Site.prototype.toggleMarker = function(flag){
	if( !this.marker ){ return false; }

	if( typeof flag == "undefined" ){
		flag = this.marker.getMap() == null ? true : false; //reverse
	}else{
		flag = !!flag;
	}
	var map = MapHandler.getInstance();
	this.marker.setMap( flag ? map : null );
}

Site.prototype.updateMarkerColor = function(){
	var marker = this.getMarker();
	if( marker ){
		marker.setIcon(this.getIconSVG());
		// marker.setIcon(this.getIconImage());
	}
}

Site.prototype.getIconSVG = function(size){
	var iconSvg = [
		'<svg width="30" height="30" viewBox="-40 -40 100 80" xmlns="http://www.w3.org/2000/svg">',
		'	<defs>',
		'		<filter id="dropshadow" height="150%">',
		'			<feGaussianBlur in="SourceAlpha" stdDeviation="1"/> ',
		'			<feOffset dx="3" dy="3" result="offsetblur"/> ',
		'			<feMerge> ',
		'				<feMergeNode/>',
		'				<feMergeNode in="SourceGraphic"/> ',
		'			</feMerge>',
		'		</filter>',
		'	</defs>',
		'	<circle r="{{size}}" stroke="#FFFFFF" stroke-width="3" fill="{{background}}" filter="url(#dropshadow)"/>',
		'	<circle r="{{size}}" stroke="#FFFFFF" stroke-width="3" fill="{{background}}"/>',
		'	<text x="0" y="13" fill="#232F3A" text-anchor="middle" style="font-size:35px; font-weight: bolder;">{{text}}</text>',
		'</svg>'
	].join('');

	var color = '#006699';
	var text = '';
	if( typeof Indicator !== "undefined" ){
		var measureType = Indicator.getPresentType();
		text = this.getMeasure(measureType) ? Math.round(this.getMeasure(measureType)) : '';
		color = this.getMeasureColor();
	}	

	var url = 'data:image/svg+xml;charset=utf-8,' + 
			   encodeURIComponent( 
				 iconSvg.replace('{{background}}', color).replace('{{size}}', size || 40).replace('{{text}}', text)
			   );

	return {
		anchor: MapHandler.createPoint(10, 10),
		url: url,
		value: text,
	};
}

Site.prototype.getIconImage = function(){
	var color = '';
	var text = '';
	if( typeof Indicator !== "undefined" ){
		var measureType = Indicator.getPresentType();
		text = this.getMeasure(measureType) ? Math.round(this.getMeasure(measureType)) : '';
		color = this.getMeasureColor();
		if(color == "transparent"){ color = ''; }
	}
	var url = [
		"/image/markerIcon/",
		color.replace('#', ''),
		// "/" + text
	].join('');
	return {
		url: url,
		scaledSize: MapHandler.createSize(30, 30),
		value: text,
	}
}


/**
 * =======================
 * InfoWindow
 * =======================
 */

Site.prototype.openInfoWindow = function(){	
	var InfoWindowLayer = require("js/map-infowindow-layer");
	InfoWindowLayer.putOn(this);
}


module.exports = Site;