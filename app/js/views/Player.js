define([
  'marionette',
  'views/Card',
  'models/CardCollection',
  'hbs!templates/player'
], function (Marionette, CardView, CardCollectionModel, playerTemplate) {
  var PlayerView = Marionette.CompositeView.extend({
    initialize: function (options) {
      options = options || {};
      this.collection = options.collection || new CardCollectionModel(this.model.get('influences'));
    },
    className: 'c-player-view',
    template: playerTemplate,
    childView: CardView,
    childViewContainer: '.c-player-influences'
  });

  return PlayerView;
});
