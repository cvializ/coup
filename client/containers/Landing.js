import { connect } from 'react-redux'
import * as landingActions from '../actions/landing.js';
import Landing from '../components/Landing.jsx'

function mapStateToProps(state, ownProps) {
  const { games } = state;
  return {
    games
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onReady() {
      dispatch(landingActions.postSocketReady())
    },

    onJoin(username, id) {
      dispatch(landingActions.postJoinGame(username, id))
    },

    onCreate(username, title, capacity) {
      dispatch(landingActions.postCreateGame(username, title, capacity))
    }
  }
}

const LandingContainer = connect(mapStateToProps, mapDispatchToProps)(Landing);

export default LandingContainer;
