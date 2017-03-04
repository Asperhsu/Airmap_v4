webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(moment, $) {"use strict";
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	__webpack_require__(6);
	__webpack_require__(9);
	__webpack_require__(13);
	
	moment.locale('zh-tw');
	moment.updateLocale('zh-tw', {
		relativeTime: {
			m: '1分鐘',
			h: '1小時',
			d: '1天',
			M: '1個月',
			y: '1年'
		}
	});
	
	$(function () {
		// siteName hashtag
		var siteName = window.location.hash.substr(1);
		$(".bsTable").on('load-success.bs.table', function (e, data) {
			if (siteName) {
				$(".bootstrap-table .search input").val(siteName).trigger('keyup');
			}
		});
	
		$(".bsTable").on('click-row.bs.table', function (e, row, $tr) {
			if ($tr.next().is('tr.detail-view')) {
				$(this).bootstrapTable('collapseRow', $tr.data('index'));
			} else {
				$(this).bootstrapTable('expandRow', $tr.data('index'));
			}
		});
	
		$("#filter button").click(function () {
			if ($(this).data('type')) {
				$("#filter button[data-type]").removeClass('btn-primary').filter(this).addClass('btn-primary');
			}
	
			if ($(this).data('group')) {
				$("#filter button[data-group]").removeClass('btn-success').filter(this).addClass('btn-success');
			}
	
			var type = $("#filter button.btn-primary[data-type]").data('type');
			var group = $("#filter button.btn-success[data-group]").data('group');
			var filename = type == 'valid' ? group : group + '-expire';
			loadDatasource(filename);
		});
	
		function loadDatasource(filename) {
			if (!filename) {
				return false;
			}
	
			$("#loading").show();
	
			var url = "/json/{{filename}}.json?raw=1";
			url = url.replace('{{filename}}', filename);
	
			$.getJSON(url).then(function (data) {
				$('#bsTable').bootstrapTable('load', data);
				$("#loading").hide();
			});
		}
	
		google.maps.event.addDomListener(window, "load", function () {
			var geocoder = new google.maps.Geocoder();
			var getAddr = function getAddr(lat, lng, cb) {
				var coord = new google.maps.LatLng(lat, lng);
				geocoder.geocode({ 'latLng': coord }, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK && results) {
						var address = results[0].formatted_address;
	
						var components = results[0].address_components;
						if (components.length > 4) {
							components.shift();components.pop();
							var seperate = components[components.length - 1].short_name == "TW" ? '' : ', ';
							address = components.reverse().map(function (component) {
								return component.long_name;
							}).join(seperate);
						}
	
						cb(address);
						return;
					}
					cb('');
				});
			};
	
			$("body").on("mouseover", "a.latlng", function () {
				var $el = $(this);
	
				var _$$data$split = $(this).data('latlng').split(',');
	
				var _$$data$split2 = _slicedToArray(_$$data$split, 2);
	
				var lat = _$$data$split2[0];
				var lng = _$$data$split2[1];
	
				getAddr(lat, lng, function (addr) {
					$el.attr('title', addr + (" (" + $el.data('latlng') + ")"));
				});
			});
		});
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(5)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["bsTable"] = __webpack_require__(7);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(moment) {"use strict";
	
	var SVGTool = __webpack_require__(8);
	
	module.exports = {
		formatter: {
			sn: function sn(value, row, index) {
				return 1 + index;
			},
			location: function location(value, row, index) {
				// var url = "https://www.google.com.tw/maps/place/" + value.lat + ',' + value.lng;
				var url = "/@" + value.lat + ',' + value.lng;
				var latlng = [value.lat, value.lng].join(', ');
	
				return ["<a href=\"" + url + "\" class=\"latlng\" target=\"_blank\" data-latlng=\"" + latlng + "\">", '<span class="glyphicon glyphicon-map-marker"></span>', '</a>'].join('');
			},
			detail: function detail(index, row, element) {
				return ["<div class='col-sm-6'>", bsTable.generate.table("Data", ['Index', 'Value'], row.Data), "</div>", "<div class='col-sm-6'>", bsTable.generate.table("RawData", ['Index', 'Value'], row.RawData), "</div>"].join('');
			},
			updateTime: function updateTime(time) {
				var human = moment(time).fromNow();
				var dataTime = moment(time).format('YYYY-MM-DD HH:mm');
				return '<span title="' + dataTime + '"><span class="glyphicon glyphicon-time"></span> ' + human + '</span>';
			},
			siteName: function siteName(name, row) {
				var url = "/site#" + row.SiteGroup + '$' + row.uniqueKey;
				return "<a href='" + url + "' target='_blank'><span class='glyphicon glyphicon-bookmark'></span> " + name + "</a>";
			},
			ranking: function ranking(_ranking) {
				if (_ranking == null) {
					return '';
				}
	
				var html = [];
				var template = '<span class="glyphicon glyphicon-{{icon}}"></span>';
				for (var i = 1; i <= 5; i++) {
					html.push(template.replace('{{icon}}', i <= _ranking ? 'star' : 'star-empty'));
				}
				return html.join('');
	
				return value;
			},
			status: function status(_status) {
				if (_status === null) {
					return '';
				}
	
				var template = '<img src="{{url}}" title="{{hint}}" />';
				var hints = {
					'indoor': '可能放置於室內或設備故障',
					'longterm': '可能接近長時間的固定污染源或設備故障',
					'shortterm': '偵測到小型污染源'
				};
				var color = '#333';
				var text = '';
				var html = [];
	
				if (_status.indexOf('indoor') > -1) {
					html.push(template.replace('{{url}}', SVGTool.getHomeUrl(color, text)).replace('{{hint}}', hints['indoor']));
				}
				if (_status.indexOf('longterm-pollution') > -1) {
					html.push(template.replace('{{url}}', SVGTool.getFactoryUrl(color, text)).replace('{{hint}}', hints['longterm']));
				}
				if (_status.indexOf('shortterm-pollution') > -1) {
					html.push(template.replace('{{url}}', SVGTool.getCloudUrl(color, text)).replace('{{hint}}', hints['shortterm']));
				}
	
				return html.join('');
			}
		},
		generate: {
			table: function table(title, head, body) {
				var headHtml = '<tr><th>' + head.join('</th><th>') + '</th></tr>';
	
				var bodyHtml = '';
				for (var index in body) {
					var value = body[index];
					// console.log(index, value);
					bodyHtml += ['<tr>', '<th>' + index + '</th>', '<td>' + value + '</td>', "</tr>"].join('');
				}
	
				return ['<div class="panel panel-info">', '<div class="panel-heading">', title, '</div>', "<table class='table table-striped'>", "<thead>", headHtml, "</thead>", "<tbody>", bodyHtml, "</tbody>", "</table>", '</div>'].join('');
			}
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	var svgTemplate = '\
		<svg width="{{width}}" height="{{height}}" viewBox="{{viewBox}}" xmlns="http://www.w3.org/2000/svg">\
			{{path}}\
			<text x="{{textOffsetX}}" y="{{textOffsetY}}"\
				fill="{{textColor}}" text-anchor="middle" \
				style="font-size:{{textSize}}px; font-weight: bolder; text-shadow: 1px 1px 0px #333, -1px -1px 0px #333, 1px -1px 0px #333, -1px 1px 0px #333;">\
				{{text}}\
			</text>\
		</svg>';
	
	var defaultProperty = {
		width: 30,
		height: 30,
		viewBox: '0 0 30 30',
		path: '',
		text: {
			offset: {
				x: 15,
				y: 15
			},
			color: "#FFFFFF",
			size: 35,
			value: ''
		},
		strokeColor: "#4F595D"
	};
	
	var getHtml = function getHtml(userProperty) {
		var property = $.extend(true, {}, defaultProperty, userProperty);
	
		var svgHtml = svgTemplate.replace(/{{width}}/g, property.width).replace(/{{height}}/g, property.height).replace(/{{viewBox}}/g, property.viewBox).replace(/{{path}}/g, property.path).replace(/{{textOffsetX}}/g, property.text.offset.x).replace(/{{textOffsetY}}/g, property.text.offset.y).replace(/{{textColor}}/g, property.text.color).replace(/{{textSize}}/g, property.text.size).replace(/{{text}}/g, property.text.value);
	
		return svgHtml;
	};
	
	var toDataImage = function toDataImage(svgHtml) {
		return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgHtml);
	};
	
	exports.getCircleUrl = function (color, text) {
		var size = arguments.length <= 2 || arguments[2] === undefined ? 40 : arguments[2];
	
		var strokeWidth = 2;
		var strokeColor = defaultProperty.strokeColor;
		var fillColor = color;
	
		var path = '\
			<circle r="40" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" fill="{{fillColor}}" />\
		';
		path = path.replace(/{{strokeWidth}}/g, strokeWidth).replace(/{{strokeColor}}/g, strokeColor).replace(/{{fillColor}}/g, fillColor);
	
		var property = {
			viewBox: "-45 -45 90 90",
			path: path,
			text: {
				offset: { x: 0, y: 13 },
				value: text
			}
		};
	
		var html = getHtml(property);
		return toDataImage(html);
	};
	
	exports.getHomeUrl = function (color, text) {
		//copyright: <a href="http://www.freepik.com" title="Freepik">Freepik</a>
		var strokeWidth = 1;
		var strokeColor = defaultProperty.strokeColor;
		var fillColor = color;
	
		var path = '\
			<g fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" >\
				<path d="M33.609,20.96v12.384c0,1.104-0.896,2-2,2H7.805c-1.104,0-2-0.896-2-2V20.96c0-0.69,0.355-1.332,0.94-1.696l11.901-7.433\
					c0.648-0.405,1.472-0.405,2.119,0l11.901,7.433C33.253,19.628,33.609,20.269,33.609,20.96z M38.475,15.432L20.768,4.374\
					c-0.648-0.405-1.471-0.405-2.119,0L0.94,15.432c-0.937,0.585-1.221,1.819-0.637,2.756c0.584,0.938,1.816,1.224,2.756,0.638\
					L19.707,8.428l16.646,10.396c0.33,0.206,0.695,0.304,1.059,0.304c0.667,0,1.318-0.333,1.697-0.941\
					C39.695,17.249,39.41,16.017,38.475,15.432z"/>\
			</g>\
		';
		path = path.replace(/{{strokeWidth}}/g, strokeWidth).replace(/{{strokeColor}}/g, strokeColor).replace(/{{fillColor}}/g, fillColor);
	
		var property = {
			viewBox: "-2 -2 44 44",
			path: path,
			text: {
				offset: {
					x: 20,
					y: 32
				},
				size: 14,
				value: text
			}
		};
	
		var html = getHtml(property);
		return toDataImage(html);
	};
	
	exports.getCloudUrl = function (color, text) {
		//copyright: <a href="http://www.freepik.com" title="Freepik">Freepik</a>
		var strokeWidth = 15;
		var strokeColor = defaultProperty.strokeColor;
		var fillColor = color;
	
		var path = '\
			<g fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}">\
				<path d="M62.513,153.087c-0.009-0.525-0.02-1.049-0.02-1.575c0-50.155,40.659-90.814,90.814-90.814\
				c43.222,0,79.388,30.196,88.562,70.643c8.555-4.789,18.409-7.531,28.91-7.531c32.766,0,59.328,26.562,59.328,59.328\
				c0,1.339-0.06,2.664-0.148,3.981c24.325,9.03,41.661,32.444,41.661,59.911c0,35.286-28.605,63.892-63.892,63.892H79.865\
				C35.757,310.921,0,275.164,0,231.056C0,192.907,26.749,161.011,62.513,153.087z"/>\
			</g>\
		';
		path = path.replace(/{{strokeWidth}}/g, strokeWidth).replace(/{{strokeColor}}/g, strokeColor).replace(/{{fillColor}}/g, fillColor);
	
		var property = {
			viewBox: "-20 -20 420 420",
			path: path,
			text: {
				offset: {
					x: 190,
					y: 290
				},
				size: 140,
				value: text
			}
		};
	
		var html = getHtml(property);
		return toDataImage(html);
	};
	
	exports.getFactoryUrl = function (color, text) {
		//copyright: <a href="http://www.freepik.com" title="Freepik">Freepik</a>
		var strokeWidth = 10;
		var strokeColor = defaultProperty.strokeColor;
		var fillColor = color;
	
		var path = '\
			<path fill="{{fillColor}}" stroke="{{strokeColor}}" stroke-width="{{strokeWidth}}" \
			d="M499.669,495.616C406.528,348.416,373.333,159.595,373.333,32c0-28.885-85.781-32-122.667-32C213.781,0,128,3.115,128,32\
			c0,104.875-15.04,304.555-115.669,463.616c-2.091,3.285-2.219,7.445-0.341,10.859c1.877,3.413,5.461,5.525,9.344,5.525h469.333\
			c3.883,0,7.467-2.112,9.344-5.525S501.76,498.923,499.669,495.616z M343.403,32.853c-0.747,0.235-1.429,0.469-2.24,0.683\
			c-2.091,0.597-4.459,1.195-7.061,1.771c-0.491,0.107-0.875,0.213-1.365,0.32c-3.2,0.683-6.784,1.365-10.688,2.005\
			c-1.003,0.171-2.176,0.32-3.221,0.469c-3.008,0.469-6.187,0.896-9.579,1.323c-1.6,0.192-3.285,0.363-4.971,0.555\
			c-3.221,0.341-6.592,0.661-10.112,0.96c-1.941,0.149-3.883,0.32-5.909,0.448c-3.797,0.256-7.829,0.469-11.947,0.661\
			c-1.963,0.085-3.84,0.192-5.867,0.256c-6.272,0.213-12.8,0.341-19.755,0.341c-6.955,0-13.483-0.128-19.755-0.341\
			c-2.027-0.064-3.904-0.171-5.867-0.256c-4.117-0.192-8.149-0.384-11.947-0.661c-2.027-0.149-3.989-0.299-5.909-0.448\
			c-3.52-0.299-6.891-0.597-10.112-0.96c-1.685-0.171-3.371-0.363-4.971-0.555c-3.392-0.405-6.571-0.853-9.579-1.323\
			c-1.045-0.171-2.219-0.32-3.221-0.469c-3.904-0.64-7.488-1.323-10.688-2.005c-0.512-0.107-0.875-0.213-1.365-0.32\
			c-2.603-0.576-4.992-1.173-7.061-1.771c-0.811-0.235-1.493-0.469-2.24-0.683c-0.981-0.299-1.813-0.597-2.645-0.896\
			c13.803-4.864,46.037-10.624,95.381-10.624s81.536,5.76,95.339,10.624C345.216,32.256,344.384,32.555,343.403,32.853z"/>\
		';
		path = path.replace(/{{strokeWidth}}/g, strokeWidth).replace(/{{strokeColor}}/g, strokeColor).replace(/{{fillColor}}/g, fillColor);
	
		var property = {
			viewBox: "-94 -94 680 680",
			path: path,
			text: {
				offset: {
					x: 256,
					y: 480
				},
				size: 200,
				value: text
			}
		};
	
		var html = getHtml(property);
		return toDataImage(html);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=list.js.map