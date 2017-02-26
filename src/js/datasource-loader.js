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

		this.sources.map(function(source){
			this.load(source);
		}.bind(this));
	},
	load: function(source){
		$.getJSON(source).done(function(data){
			$("body").trigger("dataSourceLoadCompelete", [source, data]);
		});	
	},
	update: function(source){
		this.load(source);
	},
	autoUpdate: function(flag){
		this.autoUpdateFlag = !!flag;

		if( this.autoUpdateFlag ){
			this.autoUpdateTS = setInterval(function(){
				this.loadSources();
			}.bind(this), this.autoUpdateIntervalms)
		}else{
			clearInterval(this.autoUpdateTS);
		}
	}

}

module.exports = DataSource;