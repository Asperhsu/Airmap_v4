webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(moment, $) {"use strict";
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(12);
	
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

	/* WEBPACK VAR INJECTION */(function(moment) {'use strict';
	
	module.exports = {
		formatter: {
			sn: function sn(value, row, index) {
				return 1 + index;
			},
			location: function location(value, row, index) {
				// var url = "https://www.google.com.tw/maps/place/" + value.lat + ',' + value.lng;
				var url = "/@" + value.lat + ',' + value.lng;
				var latlng = [value.lat, value.lng].join(', ');
	
				return ['<a href="' + url + '" class="latlng" target="_blank" data-latlng="' + latlng + '">', '<span class="glyphicon glyphicon-map-marker"></span>', '</a>'].join('');
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
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=list.js.map