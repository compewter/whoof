import * as types from './types';

export const setAuthorized = (authorized) => {
  return {
    type: types.SET_AUTHORIZED,
    authorized
  };
}