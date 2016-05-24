import React from 'react';
import Fluxxor from 'fluxxor';
import Landing from './Landing.jsx';
import Play from './Play.jsx';

const App = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('PlayStore')
  ],

  getStateFromFlux() {
    const { isPlaying } = this.getFlux().store('PlayStore');

    return {
      isPlaying
    };
  },

  render() {
    const view = this.state.isPlaying ? <Play /> : <Landing />;

    return (
      <div className="coup-app">
        {view}
      </div>
    );
  }
});

export default App;
