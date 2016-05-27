import React, { Component } from 'react';

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.joinGame = this.joinGame.bind(this);
    this.createGame = this.createGame.bind(this);
  }

  componentDidMount() {
    const { onReady } = this.props;
    if (onReady) {
      onReady();
    }
  }

  joinGame(username, gameId) {
    const { onJoin } = this.props;
    if (onJoin) {
      onJoin(username, gameId);
    }
  }

  createGame(username, title, capacity) {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate(username, title, capacity);
    }
  }

  render() {
    const { games } = this.props;

    return (
      <div className="c-landing">
        <div className="c-landing-join">
          <h3>Join an existing game</h3>
          <JoinForm games={games} onSubmit={this.joinGame} />
        </div>
        <div className="c-landing-create">
          <h3>Create a new game</h3>
          <CreateForm onSubmit={this.createGame} />
        </div>
      </div>
    );
  }
}

class JoinForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderPlayers = this.renderPlayers.bind(this);
    this.renderGame = this.renderGame.bind(this);
  }

  onSubmit() {
    const { onSubmit } = this.props;
    const { username, gameId } = this.refs;
    if (onSubmit) {
      onSubmit(username.value, gameId.value);
    }
  }

  renderPlayers(players) {
    return players.map(({ name, coins }, i) => <li key={i}>{name} - {coins}</li>);
  }

  renderGame(game, index) {
    const { id, title, started, players } = game;
    const renderedPlayers = this.renderPlayers(players);
    return (
      <div key={index} className="c-game-item">
        <input ref="gameId" type="radio" name="c-game-select" value={id} />
        <div className="c-game-card">
          <h4 className="c-game-title">
            {title}
            {started ? '(in progress)' : '(waiting for players)'}
          </h4>
          <ul className="c-game-players">
            {renderedPlayers}
          </ul>
        </div>
      </div>
    );
  }

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
}

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { onSubmit } = this.props;
    const { username, title, capacity } = this.refs;
    if (onSubmit) {
      onSubmit(username.value, title.value, capacity.value);
    }
  }

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
}
