define(['backbone'], function (Backbone) {
	var PlayerModel = Backbone.Model.extend({
		defaults: {
			name: 'Unnamed Player',
			coins: 2,
      influences: [ 'Unnamed Influence', 'Unnamed Influence' ]
		}
	});

	return PlayerModel;
});