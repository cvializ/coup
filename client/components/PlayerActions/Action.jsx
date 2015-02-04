var React = require('react');
var Action;

module.exports = Action = React.createClass({
  getDefaultProps: function () {
    return {
      title: 'Untitled Action',
      text: 'This action doesn\'t do anything!',
      choices: [
        { title: 'OK',  id: 'action-ok' }
      ],
      ability: null,
      conditions: null
    };
  },

  getAvailableChoices: function () {

    var conditions = this.props.conditions;
    var ability = this.props.ability;
    var i;
    var condition;

    var choices = this.props.choices.slice();

    if (ability) {
      for (i = 0; i < choices.length; i++) {
        condition = choices[i].condition;

        if ((ability && ability[condition] === false) ||
            (conditions && conditions[condition] === false)) {
          choices.splice(i, 1);
        }
      }
    }

    return choices;
  },

  renderChoice: function (choice, index) {
    return (
      <button ref={choice.ref} key={index} id={choice.id} onClick={choice.onClick}>{choice.title}</button>
    );
  },

  render: function () {
    var availableChoices = this.getAvailableChoices().map(this.renderChoice);

    return (
      <div className="c-action">
        <h2>{this.props.title}</h2>
        <p>{this.props.text}</p>
        <div class="c-action-button-list">
          {availableChoices}
        </div>
      </div>
    );
  }
});
