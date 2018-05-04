import * as types from './types';

export const favoriteAttack = (attack) => {
  return {
    type: types.TOGGLE_FAVORITE,
    attack
  };
}

export const showAttack = (attackId) => {
  return {
    type: types.SHOW_ATTACK,
    attackId
  };
}

export const setAttacks = (attacks) => {
  return {
    type: types.SET_ATTACKS,
    attacks
  };
}

export const setPendingAttackEdits = (attack) => {
  return {
    type: types.SET_PENDING_ATTACK_EDITS,
    attack
  };
}

export const toggleActiveAttack = (attack) => {
  return {
    type: types.TOGGLE_ACTIVE_ATTACK,
    attack
  };
}

export const toggleEditAttack = (attack) => {
  return {
    type: types.TOGGLE_EDIT_ATTACK,
    attack
  };
}

export const updateActiveAttackInput = (input) => {
  return {
    type: types.UPDATE_ACTIVE_ATTACK_INPUT,
    input
  };
}
