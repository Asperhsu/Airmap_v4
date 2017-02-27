var DataSource = {
	autoUpdateFlag: true,
	autoUpdateTS: null,
	autoUpdateIntervalms: 5 * 60 * 1000,
	sources: [
		"https://datasource.airmap.asper.tw/airmap.json"
	],
	boot: function(){
		this.loadSources();
		this.autoUpdate(true);
	},
	loadSources: function(){
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