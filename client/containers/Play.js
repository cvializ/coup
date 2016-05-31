import { connect } from 'react-redux'
import * as playActions from '../actions/play.js'
import Play from '../components/Play.jsx'

function mapStateToProps(state, ownProps) {
  const { gameState, startedAck, moveView } = state;
  return {
    gameState,
    startedAck,
    moveView
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onReady() {
      dispatch(playActions.postReadyStart());
    }
  };
}

const PlayContainer = connect(mapStateToProps, mapDispatchToProps)(Play);

export default PlayContainer;
