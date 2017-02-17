import * as types from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.SET_ATTACKS:
      return Object.assign({}, state, {
        attacks: action.attacks.map((attack)=>{
          attack.inputs = JSON.parse(attack.inputs)
          return attack
        })
      });
    case types.TOGGLE_ACTIVE_ATTACK:
      return Object.assign({}, state, {
        activeAttack: state.activeAttack.id === action.attack.id ? {id:null} : action.attack
      });
    case types.UPDATE_ACTIVE_ATTACK_INPUT:
      let newInputs = state.activeAttack.inputs
      newInputs[action.input.name].value = action.input.value
      newInputs[action.input.name].valid = action.input.valid
      return Object.assign({}, state, {
        activeAttack: Object.assign({}, state.activeAttack, {
          inputs: newInputs
        })
      });
    default:
      return state;
  }
};