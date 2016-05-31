import * as cards from '../../constants/cards.js';
import React, { Component } from 'react';

function InfluenceOption(props) {
  const { name, cost } = props;

  return (
    <li>{name}({cost}): <button>Do</button></li>
  );
}

class Influence extends Component {
  renderAbilities(abilities) {
    return abilities.map(({ name, cost }, i) => {
      return <InfluenceOption key={i} name={name} cost={cost} />
    });
  }

  render() {
    const { name, abilities, blocks = null } = this.props;
    const renderedAbilities = this.renderAbilities(abilities);
    return (
      <div>
        <p>{name}</p>
        <ul>{renderedAbilities}</ul>
      </div>
    );
  }
}

export default class PrimaryAction extends Component {
  renderInfluenceOptions(cards) {
    return cards.map(({ name, abilities, blocks = null }, i) => {
      return <Influence key={i} name={name} abilities={abilities} />;
    });
  }

  render() {
    const cardList = Object.keys(cards).map((key) => cards[key]);
    const renderedInfluences = this.renderInfluenceOptions(cardList);
    return (
      <div>{renderedInfluences}</div>
    );
  }
}
