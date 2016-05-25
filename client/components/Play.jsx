import React from 'react';
import Fluxxor from 'fluxxor';
import Player from './Player.jsx';
import PlayersCarousel from './PlayersCarousel.jsx';

const ReadyAction = React.createClass({
  onReady() {
    const propsOnReady = this.props.onReady;
    if (this.props.onReady) {
      this.props.onReady.apply(this, arguments);
    }
  },

  render() {
    const props = this.props;
    const onReady = props.onReady;
    const playerCount = props.playerCount;

    const button = onReady && playerCount > 1 ? (
      <button onClick={this.onReady}>Ready</button>
    ) : null;
    const message = playerCount < 2 ?
      'Waiting for players' :
      onReady ?
        'Press "Ready" to begin' :
        'Waiting til everyone is ready';

    return (
      <span className="c-play-controls-ready">
        <span className="c-play-controls-voting-votes">
          {message}
        </span>
        {button}
      </span>
    );
  }
});

let Play;
module.exports = Play = React.createClass({

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('PlayStore')
  ],

  getStateFromFlux() {
    const store = this.getFlux().store('PlayStore');

    return {
      gameState: store.gameState
    };
  },

  onReady() {
    const playActions = this.getFlux().actions.play;
    playActions.readyToStart();
  },

  renderActions() {
    const gameState = this.state.gameState;
    if (!gameState.started) {
      if (!gameState.startedAck) {
        return (
          <ReadyAction onReady={this.onReady} playerCount={gameState.players.length}/>
        );
      } else {
        return (
          <ReadyAction />
        );
      }
    } else {
      return (
        <div>You are playing</div>
      );
    }
  },

  renderPlayers(players, activeId) {
    return players.map((p, i) => <Player
        key={i}
        name={p.name}
        influences={p.influences}
        coins={p.coins}
        active={p.id === activeId}
      />
    );
  },

  render() {
    const actions = this.renderActions();
    const gameState = this.state.gameState;
    const players = this.renderPlayers(gameState.players, gameState.currentPlayer && gameState.currentPlayer.id);
    return (
      <div className="c-play">
        <div className="c-play-players-area">
          <PlayersCarousel>{players}</PlayersCarousel>
          <div className="c-play-inner-controls">
            {actions}
          </div>
        </div>
        <div className="c-play-actions-primary">
        </div>
      </div>
    );
  }
});
