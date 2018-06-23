import * as types from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.SET_AUTHORIZED:
      return Object.assign({}, state, {
        authorized: action.authorized
      });
    default:
      return state;
  }
};