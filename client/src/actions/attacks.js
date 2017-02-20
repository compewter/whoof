import * as types from './types';

export const setAttacks = (attacks) => {
  return {
    type: types.SET_ATTACKS,
    attacks
  };
}

export const toggleActiveAttack = (attack) => {
  return {
    type: types.TOGGLE_ACTIVE_ATTACK,
    attack
  };
}

export const updateActiveAttackInput = (input) => {
  return {
    type: types.UPDATE_ACTIVE_ATTACK_INPUT,
    input
  };
}

export const setPendingAttackEdits = (attack) => {
  return {
    type: types.SET_PENDING_ATTACK_EDITS,
    attack
  };
}