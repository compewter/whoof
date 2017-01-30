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

export const targetVictim = (victim) => {
  return {
    type: types.TARGET_VICTIM,
    victim
  }
}