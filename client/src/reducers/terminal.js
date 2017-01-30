import * as types from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.SET_LOGGER:
      return Object.assign({}, state, {
        logger: action.logger
      });
    default:
      return state;
  }
};