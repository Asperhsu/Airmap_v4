var DataSource = {
	autoUpdateFlag: true,
	autoUpdateTS: null,
	autoUpdateIntervalms: 5 * 60 * 1000,
	sources: [
		"//api.myjson.com/bins/1egae1",	// lass
		"//api.myjson.com/bins/fx5ax",  // g0v
		"//api.myjson.com/bins/1g8l7d", // edimax
		"//api.myjson.com/bins/15isbd", // asus
	],
	boot: function(){
		this.loadSources();
		this.autoUpdate(true);
	},
	loadSources: function(){
		$("body").trigger("dataSourceLoadSources");

		if( !this.sources.length ){
			$("body").trigger("dataSourceLoadCompelete");
			return;
		}

		var jobs = [];

		this.sources.map(source => {
			jobs.push(this.fetch(source));
		});

		Promise.all(jobs).then(results => {
			var merged = [].concat.apply([], results);
			$("body").trigger("dataSourceLoadCompelete", [merged]);
		});
	},
	fetch: function(source){
		return new Promise((resolve, reject) => {
			$.getJSON(source).done(function(data){
				resolve(data);
			});
		});
	},
	autoUpdate: function(flag){
		this.autoUpdateFlag = !!flag;

		if( this.autoUpdateFlag ){
			this.autoUpdateTS = setInterval(() => {
				this.loadSources();
			}, this.autoUpdateIntervalms)
		}else{
			clearInterval(this.autoUpdateTS);
		}
	}

}

module.exports = DataSource;