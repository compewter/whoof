import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as attackActions from '../../actions/attacks'
import * as utils from '../../utils'
import './Attacks.css'
import Attack from './Attack'
import AttackBuilder from './AttackBuilder'


class Attacks extends Component {
  componentDidMount() {
    this._socket = this.props.socket

    this._socket.on('attacks', this._attacksReceived)
    this._socket.on('result', this._resultReceived)
    
    this._socket.emit('getAttacks')
    this._followupBuffer = {}
  }

  _attacksReceived = (attacks)=>{
    console.log(attacks)
    this.props.actions.setAttacks(attacks)
  }

  _executeAttack = (attack)=>{
    try{
      let activeTargetSocketIds = utils.objToArrayOfValues(this.props.activeTargets, 'socketId')
      if(activeTargetSocketIds.length === 0){
        this.props.logger(`No active targets. Select a target.`)
        return
      }
      this.props.logger(`Targeting ${activeTargetSocketIds.length} victim${activeTargetSocketIds.length > 1 ? 's' : ''}...`)


      let attackPrep, attackExecute, attackFollowup
      eval(`attackPrep = ${attack.prepare}; attackExecute = ${attack.execute}; attackFollowup = ${attack.followup};`)
      if(!this._isValidAttackFunction(attackPrep, 'prep') || !this._isValidAttackFunction(attackExecute, 'execute') || !this._isValidAttackFunction(attackFollowup, 'followup')){
        this.props.logger(`Attack "${attack.name}" failed execution instruction validation.`)
        return
      }
      this.props.logger('Attack instructions are valid...')


      let params = attackPrep(utils.getObjValues(attack.inputs), this.props.logger)
      activeTargetSocketIds.forEach((socketId)=>{
        this.props.logger(`Executing attack "${attack.name}" on ${this.props.victimsBySocketIdMap[socketId].id}...`)
        let attackInstanceId = `${socketId}_${new Date().valueOf()}`
        this._followupBuffer[attackInstanceId] = attackFollowup
        this._socket.emit('attackUser', {
          userSocket: socketId,
          attack: attackExecute.toString(),
          params: Object.assign({}, params, {id: attackInstanceId})
        })
      })
    }catch(e){
      this.props.logger('Error executing attack.')
      this.props.logger(e)
    }
  }

  _isValidAttackFunction = (attackFunction, type)=>{
    if(typeof attackFunction !== 'function'){
      this.props.logger(`attack ${type} function is not a valid function`)
      return false
    }
    let attackFunctionString = attackFunction.toString()
    if(!~attackFunctionString.replace(/ /g, '').match(/function[a-zA-Z]+\(params/)){
      this.props.logger(`attack ${type} function is missing parameter 'params'`)
      return false
    }
    return true
  }

  _resultReceived = (result)=>{
    let resultId = result.params.id
    this.props.logger(`Result received from victim ${this.props.victimsBySocketIdMap[resultId.slice(0, resultId.lastIndexOf('_'))].id}`)
    this.props.logger(`${result.message}`)
    this._followupBuffer[resultId](result.params, this.props.logger)
  }

  render(){
    return (
      <table className='ui accordion selectable large table'>
        <thead>
          <tr>
            <th colSpan='5'>
              <h3>Attacks</h3>
            </th>
          </tr>
          <tr>
            <th>Name</th>
            <th className='ten wide'>Description</th>
          </tr>
        </thead>
        {
          this.props.attacks.map((attack, idx) => (
            <Attack 
              attack={attack}
              key={`attack_${idx}`}
              index={idx}
              active={this.props.activeAttack.id === attack.id}
              toggleActive={this.props.actions.toggleActiveAttack}
              updateInput={this.props.actions.updateActiveAttackInput}
              execute={this._executeAttack}
            />
          ))
        }
        <AttackBuilder 
          key={`attack_builder`}
          active={this.props.activeAttack.id === 'builder'}
          logger={this.props.logger}
          toggleActive={this.props.actions.toggleActiveAttack}
          updateInput={this.props.actions.updateActiveAttackInput}
          execute={this._executeAttack}
        />
      </table>
    )
  }
}

Attacks.propTypes = {
  attacks: PropTypes.array,
  activeAttack: PropTypes.object,
  activeTargets: PropTypes.object,
  victimsBySocketIdMap: PropTypes.object,
  logger: PropTypes.func 
}

function mapStateToProps(state, props) {
  return {
    attacks: state.attacks.attacks,
    activeAttack: state.attacks.activeAttack,
    activeTargets: state.victims.activeTargets,
    victimsBySocketIdMap: state.victims.victimsBySocketIdMap,
    logger: state.terminal.logger
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(attackActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Attacks)