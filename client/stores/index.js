import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import rootReducer from '../reducers'

const logger = reduxLogger();
const store = createStore(rootReducer, applyMiddleware(reduxThunk, logger));

export default store;
