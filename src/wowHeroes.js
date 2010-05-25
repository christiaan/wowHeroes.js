var wowHeroes = {
	yql : "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fxml.wow-heroes.com%2Fxml-guild.php%3Fz%3D{Zone}%26r%3D{Realm}%26g%3D{Guild}'&format=json&callback={Callback}",
	getGuildUrl : function(zone, realm, guild, callback) {
		zone = zone.replace(/ /g, "+").replace(/'/g, "%27");
		realm = realm.replace(/ /g, "+").replace(/'/g, "%27");
		guild = guild.replace(/ /g, "+").replace(/'/g, "%27");
		return this.yql.
			replace("{Zone}", encodeURIComponent(zone.toLowerCase())).
			replace("{Realm}", encodeURIComponent(realm)).
			replace("{Guild}", encodeURIComponent(guild)).
			replace("{Callback}", callback);
	},
	getGuild : function(zone, realm, guild, callback) {
		var self = this;
		$.ajax({
			cache: true,
			url: self.getGuildUrl(zone, realm, guild, "?"),
			dataType: "jsonp",
			success: function(data) {
				callback(self.extractData(data));
			}
		});
	},
	extractData : function(data) {
		if(!data.query) {
			return [];
		}

		if(data.query.results["wowheroes"] && data.query.results["wowheroes"].error) {
			throw new Error("wowHeroes.js wow-heroes.com returned error: "+data.query.results["wowheroes"].error.error_id);
		}
		return data.query.results["wow-heroes"].guild.character;
	}
};
