var SiteReliability = (function(){
	var resource = "https://data.lass-net.org/data/device_ranking.json";

	var ranking = [];
	setTimeout(function(){
		$.getJSON(resource).then(data => {
			ranking = data;
		});
	}, 500)
	

	var search = function(index, value){
		for(var i in ranking){
			var site = ranking[i];
			
			if( site[index] == value ){
				return site;
			}
		}
		return false;
	}

	var ranking2Level = function(ranking){
		if( ranking < 0.5 ){ return 0; }
		if( ranking >= 0.5 && ranking < 0.6 ){ return 1; }
		if( ranking >= 0.6 && ranking < 0.7 ){ return 2; }
		if( ranking >= 0.7 && ranking < 0.8 ){ return 3; }
		if( ranking >= 0.8 && ranking < 0.9 ){ return 4; }
		if( ranking >= 0.9 && ranking <= 1 ){ return 5; }

		return null;
	}


	return {
		getRankingByDeviceID(deviceID){
			var result = search("device_id", deviceID);
			if(result){
				return ranking2Level(result.ranking);
			}
			return null;
		},
		getRankingBySiteName(name){
			var result = search("SiteName", name);
			if(result){
				return ranking2Level(result.ranking);
			}
			return null;
		},
	}
})();

module.exports = SiteReliability;