var React = require('react');
var Fluxxor = require('fluxxor');
var Landing = require('./Landing.jsx');
var Play = require('./Play.jsx');
var App;

App = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('PlayStore')
  ],

  getStateFromFlux: function() {
    var store = this.getFlux().store('PlayStore');

    return {
      isPlaying: store.isPlaying
    };
  },

  render: function () {
    var view;

    if (this.state.isPlaying) {
      view = <Play />;
    } else {
      view = <Landing />;
    }

    return (
      <div className="coup-app">
        {view}
      </div>
    );
  }
});

module.exports = App;
