var Fluxxor = require('fluxxor');
var React = require('react');

module.exports = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('LandingStore')
  ],

  getStateFromFlux() {
    var store = this.getFlux().store('LandingStore');

    return {
      games: store.games
    };
  },

  componentDidMount() {
    var landingActions = this.getFlux().actions.landing;
    landingActions.init();
  },

  joinGame(event) {
    var landingActions = this.getFlux().actions.landing;
    var join = this.refs['join'];
    var username = join.refs['username'].getDOMNode();
    var gameId = join.getDOMNode().querySelector('input[type="radio"]:checked');

    landingActions.joinGame({
      id: gameId.value,
      username: username.value
    });
  },

  createGame(event) {
    // TODO: use the event instead of refs?
    var landingActions = this.getFlux().actions.landing;
    var create = this.refs['create'];
    var username = create.refs['username'].getDOMNode();
    var title = create.refs['title'].getDOMNode();
    var capacity = create.refs['capacity'].getDOMNode();

    landingActions.createGame({
      username: username.value,
      title: title.value,
      capacity: capacity.value
    });
  },

  render() {
    return (
      <div className="c-landing">
        <div className="c-landing-join">
          <h3>Join an existing game</h3>
          <JoinForm
            ref="join"
            games={this.state.games}
            onSubmit={this.joinGame} />
        </div>
        <div className="c-landing-create">
          <h3>Create a new game</h3>
          <CreateForm
            ref="create"
            onSubmit={this.createGame} />
        </div>
      </div>
    );
  }
});

var JoinForm = React.createClass({
  onSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit.apply(this, arguments);
    }
  },

  renderGame(item, index) {
    var game = item;

    return (
      <div key={index} className="c-game-item">
        <input type="radio" name="c-game-select" value={game.id} />
        <div className="c-game-card">
          <h4 className="c-game-title">
            {game.title}
            {game.started ? '(in progress)' : '(waiting for players)'}
          </h4>
          <ul className="c-game-players">
            {
              game.players.map((player) => {
                return <li>{player.name} - {player.coins}</li>;
              })
            }
          </ul>
        </div>
      </div>
    );
  },

  render() {
    var props = this.props;

    return (
      <form>
        <div className="c-form-field">
          <label htmlFor="c-login-form-username">Choose your username</label>
          <input ref="username" type="text" id="c-login-form-username" />
        </div>
        <div className="c-form-field c-login-games c-group">
          {
            props.games.map(this.renderGame)
          }
        </div>
        <input type="button" value="Join" onClick={this.onSubmit} />
      </form>
    );
  }
});

var CreateForm = React.createClass({
  onSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit.apply(this, arguments);
    }
  },

  render() {
    return (
      <form>
        <div className="c-form-field">
          <label htmlFor="create-game-username">Your Username</label>
          <input ref="username" type="text" id="create-game-username" />
        </div>
        <div className="c-form-field">
          <label htmlFor="create-game-title">Game Title</label>
          <input ref="title" type="text" id="create-game-title" />
        </div>
        <div className="c-form-field">
          <label htmlFor="create-game-capacity">Number of Players</label>
          <select ref="capacity" id="create-game-capacity">
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>
        </div>
        <input type="button" value="Create Game" onClick={this.onSubmit} />
      </form>
    );
  }
})
