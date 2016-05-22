var React = require('react');
var Fluxxor = require('fluxxor');
var Player = require('./Player.jsx');

module.exports = React.createClass({

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('PlayStore')
  ],

  getStateFromFlux() {
    var store = this.getFlux().store('PlayStore');

    return {
      gameState: store.gameState
    };
  },

  render() {
    var gameState = this.state.gameState;
    var players;

    players = gameState.players.map((player, i) => {
      return <Player key={i} model={player} />;
    });

    return (
      <div className="c-play">
        <div className="c-players">
          {players}
        </div>
      </div>
    );
  }
});
