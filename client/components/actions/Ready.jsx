import React, { Component } from 'react';

export default class Ready extends Component {
  render() {
    const { onReady, acknowledged, playerCount } = this.props;

    const button = !acknowledged && playerCount > 1 ? (
      <button onClick={onReady}>Ready</button>
    ) : null;
    const message = playerCount < 2 ?
      'Waiting for more players to join' :
      acknowledged ?
        'Waiting until everyone is ready' :
        'Press "Ready" to begin';

    return (
      <span className="c-play-controls-ready">
        <span className="c-play-controls-voting-votes">
          {message}
        </span>
        {button}
      </span>
    );
  }
}
