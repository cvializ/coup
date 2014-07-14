define([
  'marionette',
  'socket',
  'CoupApp',
  'views/action/SecondaryAction',
  'views/action/TertiaryAction',
  'models/PlayerCollection',
  'views/PlayerCollection',
  'views/Play'
], function (Marionette, socket, CoupApp, SecondaryAction, TertiaryAction, PlayerCollection, PlayerCollectionView, PlayView) {

  CoupController = Marionette.Controller.extend({

    initialize: function (options) {
      this.socket = options.socket;

      this.listenTo(this, 'init', function () {
        CoupApp.main.show(playView);

        playView.player.show(new PlayerCollectionView({ collection: playerCollection }));
        playView.action.show(new TertiaryAction());
      });
    }
  });

  var playerCollection = new PlayerCollection([
    {name: 'Carlos', coins: 5},
    {name: 'Erik', coins: 6},
    {name: 'Caleb', coins: 2},
    {name: 'Laura', coins: 7}
  ]);

  var playView = new PlayView();

  return CoupController;
});