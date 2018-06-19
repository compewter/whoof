import * as types from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case types.SHOW_ATTACK:
      return Object.assign({}, state, {
        visibleAttacks: Object.assign({}, state.visibleAttacks, {
          [action.attackId]: true
        })
      })
    case types.SET_ATTACKS:
      return Object.assign({}, state, {
        attacks: action.attacks.map((attack)=>{
          attack.pending = {...attack}
          return attack
        })
      })
    case types.TOGGLE_ACTIVE_ATTACK:
      return Object.assign({}, state, {
        activeAttack: state.activeAttack.id === action.attack.id ? {id:null} : action.attack
      })
    case types.TOGGLE_EDIT_ATTACK:
      return Object.assign({}, state, {
        activeAttack: Object.assign({}, state.activeAttack, {
          editing: !state.activeAttack.editing
        })
      })
    case types.SET_PENDING_ATTACK_EDITS:
      if(action.attack.id === 'new'){
        return Object.assign({}, state, {
          exampleAttack: Object.assign({}, state.exampleAttack, {
            pending: action.attack
          })
        })
      }
      return Object.assign({}, state, {
        attacks: state.attacks.map((attack)=>{
          if(attack.id !== action.attack.id) return attack
          return Object.assign({}, attack, {
            pending: action.attack
          })
        })
      })
    case types.UPDATE_ACTIVE_ATTACK_INPUT:
      let newInputs = {...state.activeAttack.inputs}
      newInputs[action.input.name].value = action.input.value
      newInputs[action.input.name].valid = action.input.valid

      return Object.assign({}, state, {
        activeAttack: Object.assign({}, state.activeAttack, {
          inputs: newInputs
        })
      })
    default:
      return state
  }
}
