import { connect } from 'react-redux'
import App from '../components/App.jsx'

function mapStateToProps(state, ownProps) {
  const { isPlaying } = state;
  return {
    isPlaying
  };
}

const CoupContainer = connect(mapStateToProps)(App);

export default CoupContainer;
