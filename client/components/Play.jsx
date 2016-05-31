import React, { Component } from 'react';
import Player from './Player.jsx';
import ReadyAction from './actions/Ready.jsx';
import PrimaryAction from './actions/Primary.jsx';
import StandbyAction from './actions/Standby.jsx';
import PlayersCarousel from './PlayersCarousel.jsx';

export default class Play extends Component {
  constructor(props) {
    super(props);

    this.onReady = this.onReady.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderPlayers = this.renderPlayers.bind(this);
  }

  onReady() {
    const { onReady } = this.props;
    if (onReady) {
      onReady();
    }
  }

  renderActions(started, startedAck, playerCount, onReady, moveView) {
    if (!started) {
      return (
        <ReadyAction
          onReady={onReady}
          acknowledged={startedAck}
          playerCount={playerCount}
        />
      );
    } else {
      switch (moveView) {
        case 'standby':
          return (
            <StandbyAction />
          );
        case 'primary':
          return (
            <PrimaryAction />
          );
      }

    }
  }

  renderPlayers(players, activeId) {
    return players.map(({ name, influences, coins, id}, i) => <Player
        key={i}
        name={name}
        influences={influences}
        coins={coins}
        active={id === activeId}
      />
    );
  }

  render() {
    const { gameState, startedAck, moveView } = this.props;
    const { players, currentPlayer, started } = gameState;

    const renderedActions = this.renderActions(started, startedAck, players.size, this.onReady, moveView);
    const renderedPlayers = this.renderPlayers(players, currentPlayer && currentPlayer.id);

    return (
      <div className="c-play">
        <div className="c-play-players-area">
          <PlayersCarousel>{renderedPlayers}</PlayersCarousel>
          <div className="c-play-inner-controls">
            {renderedActions}
          </div>
        </div>
        <div className="c-play-actions-primary">
        </div>
      </div>
    );
  }
}
