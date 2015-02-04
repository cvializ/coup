var React = require('react');
var Fluxxor = require('fluxxor');
var Action = require('./Action.jsx');
var Ready;

module.exports = Ready = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React)
  ],

  getDefaultProps: function () {
    return {
      title: 'Ready to Play',
      text: 'Click "Start Play" when all players have joined.',
      choices: [
        {
          title: 'Start Play',
          id: 'ready-start-play'
        }
      ]
    };
  },

  onReady: function () {

    var playActions = this.getFlux().actions.play;

    playActions.readyToStart();
  },

  render: function () {
    return (
      <Action
        ref="action"
        title={this.props.title}
        text={this.props.text}
        choices={[
            {
              title: 'Start Play',
              onClick: this.onReady
            }
          ]}
      />
    );
  }
});
