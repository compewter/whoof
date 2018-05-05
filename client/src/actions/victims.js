import * as types from './types'

export const addVictim = (victim) => {
  return {
    type: types.ADD_VICTIM,
    victim
  }
}

export const removeVictim = (victim) => {
  return {
    type: types.REMOVE_VICTIM,
    victim
  }
}

export const targetVictim = (victimId) => {
  return {
    type: types.TARGET_VICTIM,
    victimId
  }
}

export const targetPage = (socketId) => {
  return {
    type: types.TARGET_PAGE,
    socketId
  }
}

export const updateVictim = (victim) => {
  return {
    type: types.UPDATE_VICTIM,
    victim
  }
}
