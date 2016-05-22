var React = require('react');
var Player;
var Influence;

Influence = React.createClass({
  render() {
    var model = this.props.model;

    return (
      <div className="c-player-influence">
        <span>{model.name}</span>
      </div>
    );
  }
});

module.exports = Player = React.createClass({
  render() {
    var model = this.props.model;
    var coins = [];
    var influences;

    for (var i = 0; i < model.coins; i++) {
      coins.push(<span key={i}>X</span>);
    }

    influences = model.influences.map(function (influence, i) {
      return <Influence key={i} model={influence} />;
    });

    return (
      <div className="c-player">
        <h2>{model.name}</h2>
        <div className="c-player-influences">
          {influences}
        </div>
        <div className="c-player-coins">
          {coins}
        </div>
      </div>
    );
  }
});
