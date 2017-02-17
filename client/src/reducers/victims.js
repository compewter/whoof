import * as types from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.ADD_VICTIM:
      return Object.assign({}, state, {
        victims: state.victims.concat([action.victim]),
        victimsBySocketIdMap: Object.assign({}, state.victimsBySocketIdMap, {
          [action.victim.socketId]: action.victim
        })
      });
    case types.REMOVE_VICTIM:
      let victimsBySocketIdMap = Object.assign({}, state.victimsBySocketIdMap)
      delete victimsBySocketIdMap[action.victim.socketId]
      return Object.assign({}, state, {
        victims: state.victims.filter((victim)=>{
          return victim.id !== action.victim.id
        }),
        activeTargets: Object.assign({}, state.activeTargets, {
          [action.victim.id]: null
        }),
        victimsBySocketIdMap
      });
    case types.TARGET_VICTIM:
      return Object.assign({}, state, {
        activeTargets: Object.assign({}, state.activeTargets, {
          [action.victim.id]: state.activeTargets[action.victim.id] ? null : action.victim
        })
      });
    default:
      return state;
  }
};