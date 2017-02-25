module.exports = {
	formatter: {
		sn: function(value, row, index){
			return 1+index;
		},
		location: function(value, row, index){
			// var url = "https://www.google.com.tw/maps/place/" + value.lat + ',' + value.lng;
			var url = "/@" + value.lat + ',' + value.lng;
			var latlng = [value.lat, value.lng].join(', ');			

			return [
				`<a href="${url}" class="latlng" target="_blank" data-latlng="${latlng}">`,
				'<span class="glyphicon glyphicon-map-marker"></span>',
				'</a>'
			].join('');
		},
		detail: function(index, row, element){
			return [
				"<div class='col-sm-6'>",
				bsTable.generate.table("Data", ['Index', 'Value'], row.Data),
				"</div>",
				"<div class='col-sm-6'>",
				bsTable.generate.table("RawData", ['Index', 'Value'], row.RawData),
				"</div>",
			].join('');
		},
		updateTime: function(time){
			var human = moment(time).fromNow();
			var dataTime = moment(time).format('YYYY-MM-DD HH:mm');
			return '<span title="' + dataTime + '"><span class="glyphicon glyphicon-time"></span> ' + human + '</span>';
		},
		siteName: function(name, row){
			var url = "/site#" + row.SiteGroup + '$' + row.uniqueKey;
			return "<a href='" + url + "' target='_blank'><span class='glyphicon glyphicon-bookmark'></span> " + name + "</a>";
		},
	},
	generate: {
		table: function(title, head, body){
			var headHtml = '<tr><th>' + head.join('</th><th>') + '</th></tr>';
			
			var bodyHtml = '';
			for(var index in body){
				var value = body[index];
				// console.log(index, value);
				bodyHtml += [
					'<tr>',
						'<th>' + index + '</th>',
						'<td>' + value + '</td>',
					"</tr>"
				].join('');
			}

			return [
				'<div class="panel panel-info">',
					'<div class="panel-heading">',
						title,
					'</div>',
					"<table class='table table-striped'>",
						"<thead>",
							headHtml,
						"</thead>",
						"<tbody>",
							bodyHtml,
						"</tbody>",
					"</table>",
				'</div>',
			].join('');
		}
	},
}