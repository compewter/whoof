import { applyMiddleware, compose, createStore } from 'redux';
import reducer from './reducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

var finalCreateStore = compose(
  applyMiddleware(thunk, logger())
)(createStore);

var configureStore = function(initialState) {
  initialState = initialState || {users: [], attacks:[]}
  return finalCreateStore(reducer, initialState);
};

module.exports = configureStore;