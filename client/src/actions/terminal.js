import * as types from './types';

export const setLogger = (logger) => {
  return {
    type: types.SET_LOGGER,
    logger
  };
}