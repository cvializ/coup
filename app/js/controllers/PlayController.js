define([
  'marionette',
  'MainRegion',
  'Vent',
  'views/Play',
  'models/Player',
  'views/Result',
  'models/Result',
  'models/PlayerCollection',
  'views/PlayerCollection',
  'views/action/PrimaryAction',
  'views/action/SecondaryAction',
  'views/action/TertiaryAction',
  'views/action/PendingAction'
], function (Marionette,
             mainRegion,
             vent,
             PlayView,
             PlayerModel,
             ResultView,
             ResultModel,
             PlayerCollectionModel,
             PlayerCollectionView,
             PrimaryActionView,
             SecondaryActionView,
             TertiaryActionView,
             PendingActionView) {

  var PlayController = Marionette.Controller.extend({
    socket: null,

    game: null,

    playView: null,

    playersCollection: null,

    playersView: null,

    resultView: null,

    resultModel: null,

    initialize: function initialize(options) {
      var self = this;

      options = options || {};
      options.socket = options.socket || null;

      self.socket = options.socket;

      vent.on('play:init', function loadController() {

        self.playView = new PlayView();
        self.playersCollection = new PlayerCollectionModel();
        self.playersView = new PlayerCollectionView({ collection: self.playersCollection});
        self.resultModel = new ResultModel();

        mainRegion.show(self.playView);

        self.playView.player.show(self.playersView);
        self.playView.action.show(new PrimaryActionView());

        self.socket.emit('pull:game');
      });

      vent.on('play:move:primary', function primaryMove(data) {
        self.playView.result.empty();
        self.socket.emit('make move', data);
        self.playView.action.show(new PendingActionView());
      });

      vent.on('play:move:secondary', function secondaryMove(moveData) {
        moveData = moveData || {};
        if (moveData.type === 'allow') {
          self.socket.emit('allow move', moveData);
        } else if (moveData.type === 'block') {
          self.socket.emit('block move', moveData);
          self.playView.action.show(new PendingActionView());
        } else if (moveData.type === 'doubt') {
          self.socket.emit('doubt move', moveData);
        } else {
          throw 'Unrecognized secondary move type.';
        }
      });

      vent.on('play:move:tertiary', function tertiaryMove(moveData) {
        moveData = moveData || {};
        if (moveData.type === 'concede') {
          self.socket.emit('blocker success');
        } else if (moveData.type === 'doubt') {
          self.socket.emit('blocker doubt');
        } else {
          throw 'Unrecognized tertiary move type.';
        }
      });

      self.socket.on('push:game', function updateGameData(data) {
        self.game = data;

        self.playersCollection.set(self.game.players);
      });

      self.socket.on('user joined', function userJoined() {
        self.socket.emit('pull:game');
      });

      self.socket.on('user left', function userLeft() {
        if (self.game.players.length > 2) {
          self.socket.emit('pull:game');
        }
      });

      self.socket.on('you are alone', function gameAbandoned() {
        vent.trigger('play:end');
      });

      self.socket.on('move attempted', function moveAttempted() {
        self.playView.action.show(new SecondaryActionView());
      });

      self.socket.on('move blocked', function myMoveBlocked() {
        self.showResult({ title: 'Block Attempted', message: 'Someone is attempting to block you.' });
        self.playView.action.show(new TertiaryActionView());
      });

      self.socket.on('block succeeded', function blockSucceeded() {
        self.showResult({ title: 'Blocked', message: 'Someone was successfully blocked!' });
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on('move succeeded', function moveSucceeded() {
        self.showResult({ title: 'Success', message: 'A move was completed.' });
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on('move doubter succeeded', function moveDoubterSucceeded() {
        self.showResult({ title: 'Move Doubted!', message: 'The player was doubted, and was lying!' });
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on('move doubter failed', function moveDoubterFailed() {
        self.showResult({ title: 'Move Doubted!', message: 'The player was doubted, but was telling the truth!' });
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on('block doubter succeeded', function blockDoubterSucceeded() {
        self.showResult({ title: 'Block Doubted!', message: 'The blocker was lying!' });
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on('block doubter failed', function blockDoubterFailed() {
        self.showResult({ title: 'Block Doubted!', message: 'The blocker was truthful! Player blocked!' });
        self.playView.action.show(new PrimaryActionView());
      });
    },

    showResult: function showResult(options) {
      this.resultModel.set(options);
      this.playView.result.show(new ResultView({ model: this.resultModel }));
    }
  });

  return PlayController;
});
