import React, { Component } from 'react';
import Landing from '../containers/Landing.js';
import Play from '../containers/Play.js';

export default class App extends Component {
  render() {
    const { isPlaying } = this.props;
    const view = (isPlaying ? <Play /> : <Landing />);

    return (
      <div className="coup-app">{view}</div>
    );
  }
}
