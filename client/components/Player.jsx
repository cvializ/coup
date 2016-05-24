import React, { Component } from 'react';
import cx from 'classnames';

class Influence extends Component {
  render() {
    const name = this.props.name;

    return (
      <div className="c-player-influence">
        <span>{name}</span>
      </div>
    );
  }
}

class Coin extends Component {
  render() {
    return (
      <span className="c-player-coin"></span>
    );
  }
}

export default class Player extends Component {
  renderCoins(coins) {
    const rendered = [];

    for (let i = 0; i < coins; i++) {
      rendered.push(<Coin key={i} />);
    }

    return rendered;
  }

  renderInfluences(influences) {
    return influences.map((influence, i) => <Influence key={i} model={influence} />);
  }

  render() {
    const props = this.props;
    const { name, active } = props;
    const coins = this.renderCoins(props.coins);
    const influences = this.renderInfluences(props.influences);
    const classNames = cx('c-player', props.className, {
      'c-player--active': active
    });

    return (
      <div className={classNames}>
        <span className="c-player-name">{name}</span>
        <div className="c-player-influences">
          {influences}
        </div>
        <div className="c-player-coins">
          {coins}
        </div>
      </div>
    );
  }
}
