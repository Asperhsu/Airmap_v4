var svgTemplate = '\
	<svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" xmlns="http://www.w3.org/2000/svg">\
		<defs>\
			<filter id="dropshadow-{{iconType}}" height="150%">\
				<feOffset result="offOut" in="SourceAlpha" dx="{{shadowOffsetX}}" dy="{{shadowOffsetY}}" />\
					<feGaussianBlur result="blurOut" in="offOut" stdDeviation="{{shadowDeviation}}" />\
					<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />\
			</filter>\
		</defs>\
		{{path}}\
		<text x="{{textOffsetX}}" y="{{textOffsetY}}" stroke="{{textStrokeColor}}" stroke-width="{{textStrokeWidth}}"\
		 fill="{{textColor}}" text-anchor="middle" style="font-size:{{textSize}}px; font-weight: bolder;">{{text}}</text>\
	</svg>';

var defaultProperty = {
	width: 30,
	height: 30,
	viewBox: '0 0 30 30',
	iconType: '',
	shadow: {
		offset: {
			x: 3,
			y: 3,
		},
		deviation: 1,
	},
	path: '',
	text: {
		offset: {
			x: 15,
			y: 15,
		},
		stoke: {
			width: 0,
			color: "#FFFFFF",
		},
		color: "#232F3A",
		size: 35,
		value: '',
	}
}

var getFilterShadowName = function(type){
	return "url(#dropshadow-" + type + ")";
}

var getHtml = function(userProperty){
	var property = $.extend(true, {}, defaultProperty, userProperty);

	var svgHtml = svgTemplate.replace(/{{width}}/g, property.width)
						 .replace(/{{height}}/g, property.height)
						 .replace(/{{viewBox}}/g, property.viewBox)
						 .replace(/{{iconType}}/g, property.iconType)
						 .replace(/{{shadowOffsetX}}/g, property.shadow.offset.x)
						 .replace(/{{shadowOffsetY}}/g, property.shadow.offset.y)
						 .replace(/{{shadowDeviation}}/g, property.shadow.deviation)
						 .replace(/{{path}}/g, property.path)
						 .replace(/{{textOffsetX}}/g, property.text.offset.x)
						 .replace(/{{textOffsetY}}/g, property.text.offset.y)
						 .replace(/{{textStrokeColor}}/g, property.text.stoke.color)
						 .replace(/{{textStrokeWidth}}/g, property.text.stoke.width)
						 .replace(/{{textColor}}/g, property.text.color)
						 .replace(/{{textSize}}/g, property.text.size)
						 .replace(/{{text}}/g, property.text.value);

	return svgHtml;
}

var toDataImage = function(svgHtml){
	return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgHtml);
}

exports.getCircleUrl = function(color, text, size=40){
	var type = "circle";
	var strokeWidth = 3;
	var strokeColor = "#FFFFFF";
	var fillColor = color;
	var filterName = getFilterShadowName(type);

	var path = '\
		<circle r="40" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" fill="{{fillColor}}" filter="{{filterName}}"/>\
		<circle r="40" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" fill="{{fillColor}}" />\
	';
	path = path.replace(/{{strokeWidth}}/g, strokeWidth)
				.replace(/{{strokeColor}}/g, strokeColor)
				.replace(/{{fillColor}}/g, fillColor)
				.replace(/{{filterName}}/g, filterName);

	var property = {
		viewBox: "-40 -40 100 80",
		iconType: type,
		path: path,
		text: {
			offset: { x: 0, y: 13 },
			value: text,
		}
	};

	var html = getHtml(property);
	return toDataImage(html);
}

exports.getHomeUrl = function(color, text){
	//copyright: <a href="http://www.freepik.com" title="Freepik">Freepik</a>
	var type = "home";
	var strokeWidth = 1;
	var strokeColor = "#FFFFFF";
	var fillColor = color;
	var filterName = getFilterShadowName(type);

	var path = '\
		<g fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" filter="{{filterName}}" >\
			<path fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" filter="{{filterName}}" d="M33.609,20.96v12.384c0,1.104-0.896,2-2,2H7.805c-1.104,0-2-0.896-2-2V20.96c0-0.69,0.355-1.332,0.94-1.696l11.901-7.433\
				c0.648-0.405,1.472-0.405,2.119,0l11.901,7.433C33.253,19.628,33.609,20.269,33.609,20.96z M38.475,15.432L20.768,4.374\
				c-0.648-0.405-1.471-0.405-2.119,0L0.94,15.432c-0.937,0.585-1.221,1.819-0.637,2.756c0.584,0.938,1.816,1.224,2.756,0.638\
				L19.707,8.428l16.646,10.396c0.33,0.206,0.695,0.304,1.059,0.304c0.667,0,1.318-0.333,1.697-0.941\
				C39.695,17.249,39.41,16.017,38.475,15.432z"/>\
		</g>\
	';
	path = path.replace(/{{strokeWidth}}/g, strokeWidth)
				.replace(/{{strokeColor}}/g, strokeColor)
				.replace(/{{fillColor}}/g, fillColor)
				.replace(/{{filterName}}/g, filterName);

	var property = {
		viewBox: "0 0 45.414 39.414",
		iconType: type,
		path: path,
		shadow: {
			offset: {
				x: 1,
				y: 1,
			},
			deviation: 1,
		},
		text: {
			offset: {
				x: 20,
				y: 32,
			},
			size: 14,
			value: text,
		}
	};

	var html = getHtml(property);
	return toDataImage(html);
}

exports.getCloudUrl = function(color, text){
	//copyright: <a href="http://www.freepik.com" title="Freepik">Freepik</a>
	var type = "cloud";
	var strokeWidth = 15;
	var strokeColor = "#FFFFFF";
	var fillColor = color;
	var filterName = getFilterShadowName(type);

	var path = '\
		<g fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" filter="{{filterName}}" >\
			<path d="M62.513,153.087c-0.009-0.525-0.02-1.049-0.02-1.575c0-50.155,40.659-90.814,90.814-90.814\
			c43.222,0,79.388,30.196,88.562,70.643c8.555-4.789,18.409-7.531,28.91-7.531c32.766,0,59.328,26.562,59.328,59.328\
			c0,1.339-0.06,2.664-0.148,3.981c24.325,9.03,41.661,32.444,41.661,59.911c0,35.286-28.605,63.892-63.892,63.892H79.865\
			C35.757,310.921,0,275.164,0,231.056C0,192.907,26.749,161.011,62.513,153.087z"/>\
		</g>\
	';
	path = path.replace(/{{strokeWidth}}/g, strokeWidth)
				.replace(/{{strokeColor}}/g, strokeColor)
				.replace(/{{fillColor}}/g, fillColor)
				.replace(/{{filterName}}/g, filterName);

	var property = {
		viewBox: "0 0 391.62 371.62",
		iconType: type,
		path: path,
		shadow: {
			offset: {
				x: 10,
				y: 10,
			},
			deviation: 3,
		},
		text: {
			offset: {
				x: 190,
				y: 280,
			},
			size: 150,
			value: text,
		}
	};

	var html = getHtml(property);
	return toDataImage(html);
}

exports.getFactoryUrl = function(color, text){
	//copyright: <a href="http://www.freepik.com" title="Freepik">Freepik</a>
	var type = "factory";
	var strokeWidth = 15;
	var strokeColor = "#FFFFFF";
	var fillColor = color;
	var filterName = getFilterShadowName(type);

	var path = '\
		<g fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" filter="{{filterName}}" >\
			<path d="M303.297,75.612c0-0.057-0.004-0.112-0.005-0.169c-0.123-7.849-6.52-14.174-14.397-14.174c-2.777,0-5.37,0.788-7.571,2.149\
				c-1.306-1.326-3.12-2.149-5.129-2.149c-3.697,0-6.74,2.787-7.15,6.375c-1.499-0.353-3.102-0.547-4.773-0.547\
				c-2.272,0-4.427,0.352-6.363,0.981c-1.755-2.795-4.856-4.659-8.399-4.659c-5.267,0-9.563,4.106-9.89,9.291\
				c-6.28,2.46-10.73,8.569-10.73,15.722c0,9.326,7.559,16.885,16.884,16.885c3.537,0,6.817-1.089,9.529-2.947\
				c0.641-0.171,1.262-0.369,1.867-0.59c1.254,0.297,2.559,0.459,3.904,0.459c2.494,0,4.859-0.545,6.99-1.516\
				c3.193,3.52,7.803,5.729,12.929,5.729c9.638,0,17.451-7.813,17.451-17.452c0-0.816-0.06-1.618-0.169-2.405\
				c3.073-2.641,5.023-6.554,5.023-10.924c0-0.014,0-0.026,0-0.04C303.297,75.625,303.297,75.618,303.297,75.612z"/>\
			<path d="M270.253,159.914v-39.816c0-6.19-5.017-11.207-11.206-11.207h-30.158v43.276l36.019,93.711h22.075\
				c3.693,0,7.147-1.816,9.237-4.862c2.091-3.045,2.549-6.921,1.225-10.365L270.253,159.914z"/>\
			<path d="M213.6,155.003V89.338c0-6.191-5.017-11.207-11.207-11.207h-49.794c-6.19,0-11.207,5.016-11.207,11.207v65.689\
				l-6.778,17.637v0.737l42.718,111.119h69.741c3.692,0,7.146-1.816,9.236-4.861c2.09-3.046,2.548-6.923,1.224-10.366L213.6,155.003z"\
				/>\
			<path d="M119.326,176.237v-65.665c0-6.19-5.017-11.207-11.207-11.207H58.325c-6.19,0-11.207,5.017-11.207,11.207v65.69\
				L3.205,290.527c-1.324,3.444-0.866,7.326,1.225,10.365c2.09,3.047,5.543,4.863,9.235,4.863h139.133\
				c3.692,0,7.146-1.816,9.237-4.863c2.09-3.045,2.548-6.921,1.224-10.365L119.326,176.237z"/>\
			<path d="M40.489,87.268c10.897,0,20.244-5.624,25.031-13.78c5.285,2.862,11.874,4.644,19.13,4.644\
				c15.219,0,27.818-7.52,30.446-17.423c4.1,1.995,8.977,3.181,14.232,3.181c5.076,0,9.774-1.126,13.784-2.991\
				c4.938,6.28,13.428,10.445,23.111,10.445c11.625,0,21.528-5.997,25.62-14.461c4.966-0.051,9.515-1.808,13.216-4.673\
				c2.42,5.39,8.779,9.261,16.334,9.261c9.614,0,17.408-6.25,17.408-13.964c0-1.056-0.17-2.076-0.449-3.065\
				c7.794-0.335,13.984-5.056,13.984-10.894c0-5.923-6.37-10.715-14.323-10.919c0.459-1.538,0.788-3.119,0.788-4.792\
				c0-9.849-8.561-17.836-19.11-17.836c-8.6,0-15.795,5.345-18.194,12.64c-2.985-1.518-6.31-2.448-9.863-2.448\
				c-9.754,0-17.976,6.46-21.11,15.447c-1.403-0.188-2.827-0.362-4.3-0.362c-6.837,0-13.009,2.144-17.836,5.568\
				c-4.786-3.803-11.525-6.206-19.06-6.206c-1.215,0-2.368,0.149-3.533,0.264C125.547,13.71,114.36,4.688,100.554,4.688\
				c-7.216,0-13.685,2.487-18.293,6.434C76.897,4.398,68.606,0,59.171,0C42.987,0,29.869,12.74,29.869,28.45\
				c0,3.051,0.627,5.932,1.543,8.686C20.175,40.588,12.033,50.118,12.033,61.47C12.033,75.717,24.773,87.268,40.489,87.268z\
				 M214.049,34.791c0.04,0.01,0.09,0.024,0.14,0.04c-0.05,0.014-0.1,0.044-0.149,0.063C214.039,34.86,214.049,34.825,214.049,34.791z\
				"/>\
		</g>\
	';
	path = path.replace(/{{strokeWidth}}/g, strokeWidth)
				.replace(/{{strokeColor}}/g, strokeColor)
				.replace(/{{fillColor}}/g, fillColor)
				.replace(/{{filterName}}/g, filterName);

	var property = {
		viewBox: "0 0 391.62 371.62",
		iconType: type,
		path: path,
		shadow: {
			offset: {
				x: 10,
				y: 10,
			},
			deviation: 3,
		},
		text: {
			offset: {
				x: 160,
				y: 240,
			},
			stoke: {
				width: 3,
			},
			color: "#000000",
			size: 150,
			value: text,
		}
	};

	var html = getHtml(property);
	return toDataImage(html);
}