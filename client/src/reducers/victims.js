import * as types from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case types.ADD_VICTIM:
      /*eslint-disable */
      var newSocketIdMap = Object.keys(action.victim.activePagesBySocketId).reduce((map, socketId)=>{
        map[socketId] = action.victim.visibleId
        return map
      },{})
      /*eslint-enable */

      return Object.assign({}, state, {
        victims: Object.assign({}, state.victims, {[action.victim.visibleId]: action.victim}),
        victimIdBySocketIdMap: Object.assign({}, state.victimIdBySocketIdMap, newSocketIdMap)
      });
    case types.REMOVE_VICTIM:
      /*eslint-disable */
      var victims = Object.assign({}, state.victims)
      var victimIdBySocketIdMap = Object.assign({}, state.victimIdBySocketIdMap)
      var activeTargets = Object.assign({}, state.activeTargets)
      /*eslint-enable */
      delete victims[action.victim.visibleId]
      delete victimIdBySocketIdMap[action.victim.socketId]
      delete activeTargets[action.victim.visibleId]

      return Object.assign({}, state, {
        victims,
        activeTargets,
        victimIdBySocketIdMap
      });
    case types.TARGET_VICTIM:
      /*eslint-disable */
      var activeTargets = Object.assign({}, state.activeTargets)
      /*eslint-enable */
      if(activeTargets[action.victimId]){
        delete activeTargets[action.victimId]
      }else{
        activeTargets[action.victimId] = action.victimId
      }

      return Object.assign({}, state, {
        activeTargets
      });
    case types.TARGET_PAGE:
      /*eslint-disable */
      var victims = Object.assign({}, state.victims)
      var victim = victims[state.victimIdBySocketIdMap[action.socketId]]
      var page = victim.activePagesBySocketId[action.socketId]
      /*eslint-enable */
      page.targeted = !page.targeted

      return Object.assign({}, state, {
        victims
      });
    case types.UPDATE_VICTIM:
      /*eslint-disable */
      var victims = Object.assign({}, state.victims)
      var victimIdBySocketIdMap = Object.assign({}, state.victimIdBySocketIdMap)

      var newVictim = action.victim
      var oldVictim = state.victims[newVictim.visibleId]
      /*eslint-enable */
      
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
