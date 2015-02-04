var React = require('react');
var Fluxxor = require('fluxxor');
var Player = require('./Player.jsx');
var ReadyAction = require('./PlayerActions/Ready.jsx');

module.exports = React.createClass({

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('PlayStore')
  ],

  getStateFromFlux: function() {
    var store = this.getFlux().store('PlayStore');

    return {
      gameState: store.gameState
    };
  },

  render: function () {
    var gameState = this.state.gameState;
    var players;

    players = gameState.players.map(function (player, i) {
      return <Player key={i} model={player} />;
    });

    return (
      <div className="c-play">
        <div className="c-players">
          {players}
        </div>
        <div className="c-actions">
            <ReadyAction />
        </div>
      </div>
    );
  }
});
