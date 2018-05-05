import * as types from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.ADD_VICTIM:
      var newSocketIdMap = Object.keys(action.victim.activePagesBySocketId).reduce((map, socketId)=>{
        map[socketId] = action.victim.visibleId
        return map
      },{})

      return Object.assign({}, state, {
        victims: Object.assign({}, state.victims, {[action.victim.visibleId]: action.victim}),
        victimIdBySocketIdMap: Object.assign({}, state.victimIdBySocketIdMap, newSocketIdMap)
      });
    case types.REMOVE_VICTIM:
      var victims = Object.assign({}, state.victims)
      delete victims[action.victim.visibleId]
      var victimIdBySocketIdMap = Object.assign({}, state.victimIdBySocketIdMap)
      delete victimIdBySocketIdMap[action.victim.socketId]
      var activeTargets = Object.assign({}, state.activeTargets)
      delete activeTargets[action.victim.visibleId]

      return Object.assign({}, state, {
        victims,
        activeTargets,
        victimIdBySocketIdMap
      });
    case types.TARGET_VICTIM:
      var activeTargets = Object.assign({}, state.activeTargets)
      if(activeTargets[action.victimId]){
        delete activeTargets[action.victimId]
      }else{
        activeTargets[action.victimId] = action.victimId
      }

      return Object.assign({}, state, {
        activeTargets
      });
    case types.TARGET_PAGE:
      var victims = Object.assign({}, state.victims)
      var victim = victims[state.victimIdBySocketIdMap[action.socketId]]
      var page = victim.activePagesBySocketId[action.socketId]
      page.targeted = !page.targeted

      return Object.assign({}, state, {
        victims
      });
    case types.UPDATE_VICTIM:
      var victims = Object.assign({}, state.victims)
      var victimIdBySocketIdMap = Object.assign({}, state.victimIdBySocketIdMap)

      var newVictim = action.victim
      var oldVictim = state.victims[newVictim.visibleId]

      Object.keys(newVictim.activePagesBySocketId).forEach((socketId)=>{
        victimIdBySocketIdMap[socketId] = newVictim.visibleId
        newVictim.activePagesBySocketId[socketId].targeted = oldVictim.activePagesBySocketId[socketId] ? oldVictim.activePagesBySocketId[socketId].targeted : false
      })

      Object.keys(oldVictim.activePagesBySocketId).forEach((socketId)=>{
        if(!newVictim.activePagesBySocketId[socketId]){
          delete victimIdBySocketIdMap[socketId]
        }
      })

      victims[newVictim.visibleId] = newVictim

      return Object.assign({}, state, {
        victims,
        victimIdBySocketIdMap
      })
    default:
      return state;
  }
};
