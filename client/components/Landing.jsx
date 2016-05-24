import Fluxxor from 'fluxxor';
import React from 'react';

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

  joinGame(username, gameId) {
    const landingActions = this.getFlux().actions.landing;

    landingActions.joinGame({
      id: gameId,
      username: username
    });
  },

  createGame(username, title, capacity) {
    var landingActions = this.getFlux().actions.landing;

    landingActions.createGame({
      username,
      title,
      capacity
    });
  },

  render() {
    return (
      <div className="c-landing">
        <div className="c-landing-join">
          <h3>Join an existing game</h3>
          <JoinForm games={this.state.games} onSubmit={this.joinGame} />
        </div>
        <div className="c-landing-create">
          <h3>Create a new game</h3>
          <CreateForm onSubmit={this.createGame} />
        </div>
      </div>
    );
  }
});

var JoinForm = React.createClass({
  onSubmit() {
    const propsOnSubmit = this.props.onSubmit;
    const { username, gameId } = this.refs;
    if (propsOnSubmit) {
      propsOnSubmit.call(this, username.value, gameId.value);
    }
  },

  renderPlayers(players) {
    return players.map((player, i) => <li key={i}>{player.name} - {player.coins}</li>);
  },

  renderGame(game, index) {
    const { id, title, started } = game;
    const players = this.renderPlayers(game.players);
    return (
      <div key={index} className="c-game-item">
        <input ref="gameId" type="radio" name="c-game-select" value={id} />
        <div className="c-game-card">
          <h4 className="c-game-title">
            {title}
            {started ? '(in progress)' : '(waiting for players)'}
          </h4>
          <ul className="c-game-players">
            {players}
          </ul>
        </div>
      </div>
    );
  },

  render() {
    const { games } = this.props;

    return (
      <form>
        <div className="c-form-field">
          <label htmlFor="c-login-form-username">Choose your username</label>
          <input ref="username" type="text" id="c-login-form-username" />
        </div>
        <div className="c-form-field c-login-games c-group">
          {games.map(this.renderGame)}
        </div>
        <input type="button" value="Join" onClick={this.onSubmit} />
      </form>
    );
  }
});

var CreateForm = React.createClass({
  onSubmit() {
    const propsOnSubmit = this.props.onSubmit;
    const { username, title, capacity } = this.refs;
    if (propsOnSubmit) {
      propsOnSubmit.call(this, username.value, title.value, capacity.value);
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
