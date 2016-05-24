import React, { Component } from 'react';

export default class PlayersCarousel extends Component {
  renderItems(children) {
    return React.Children.map(children, (c) => <div className="c-carousel-item">{c}</div>);
  }

  render() {
    const props = this.props;
    const items = this.renderItems(props.children);
    return (
      <div className="c-players-carousel">{items}</div>
    );
  }
}
