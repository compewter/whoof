import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as attackActions from '../../actions/attacks'
import { Divider } from 'semantic-ui-react'
import './Attacks.css'
import Attack from './Attack'
import AttackBuilder from './AttackBuilder'
import AttackSearch from './AttackSearch'


class Attacks extends Component {
  componentWillMount() {
    this.props.actions.setPendingAttackEdits(this.props.exampleAttack)
    this._socket = this.props.socket

    this._socket.on('attacks', this._attacksReceived)
    this._socket.on('result', this._resultReceived)

    this._socket.emit('getAttacks')
  }

  _attacksReceived = (attacks)=>{
    this.props.actions.setAttacks(attacks)
    this.props.actions.toggleActiveAttack(this.props.activeAttack)
  }

  _executeAttack = (attack)=>{
    try{
      let activeTargetSocketIds = Object.keys(this.props.activeTargets).reduce((socketIds, targetId)=>{
        let target = this.props.victims[targetId]
        Object.values(target.activePagesBySocketId).forEach((page)=>{
          if(page.targeted){
            socketIds.push(page.socketId)
          }
        })
        return socketIds
      },[])
      if(activeTargetSocketIds.length === 0){
        this.props.logger(`No active targets. Select a target.`)
        return
      }
      this.props.logger(`Targeting ${activeTargetSocketIds.length} victim${activeTargetSocketIds.length > 1 ? 's' : ''}...`)


      let attackPrep, attackExecute, attackFollowup
      eval(`attackPrep = ${attack.prepare.function}; attackExecute = ${attack.execute.function}; attackFollowup = ${attack.followup.function};`)
      if(!this._isValidAttackFunction(attackPrep, 'prep') || !this._isValidAttackFunction(attackExecute, 'execute') || !this._isValidAttackFunction(attackFollowup, 'followup')){
        this.props.logger(`Attack "${attack.name}" failed execution instruction validation.`)
        return
      }
      // this.props.logger('Attack instructions are valid...')


      let inputs = {}
      Object.keys(attack.inputs).forEach((name)=>{
        inputs[name] = attack.inputs[name].value
      })
      let params = attackPrep(inputs, this.props.logger)
      if(params._cancel_attack){
        this.props.logger('Attack cancelled')
        return
      }
      activeTargetSocketIds.forEach((socketId)=>{
        let victim = this.props.victimIdBySocketIdMap[socketId]
        this.props.logger(`Executing attack "${attack.name}" on victim ${victim}...`)
        let attackInstanceId = `${socketId}_${new Date().valueOf()}`
        this.props.followupBuffer[attackInstanceId] = attackFollowup
        this._socket.emit('attackVictim', {
          victimSocket: socketId,
          attack: attackExecute.toString(),
          params: Object.assign(params, {victim, id: attackInstanceId})
        })
      })
    }catch(e){
      this.props.logger('Error executing attack.')
      this.props.logger(e)
    }
  }

  _favoriteAttack = (attack)=>{
    this._socket.emit('saveAttack', Object.assign({},attack,{favorite: attack.favorite === 0 ? 1 : 0}))
  }

  _saveAttack = (attack)=>{
    this._socket.emit('saveAttack', attack)
  }

  _deleteAttack = (attackId)=>{
    this._socket.emit('deleteAttack', attackId)
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
    this.props.logger(`Result received from victim ${this.props.victimIdBySocketIdMap[resultId.slice(0, resultId.lastIndexOf('_'))]}`)
    this.props.logger(`${result.message}`)
    this.props.followupBuffer[resultId](result.params, this.props.logger)
  }

  render(){
    let {attacks, activeAttack, exampleAttack, actions, logger, visibleAttacks} = this.props
    return (
      <div className='block'>
        <h3 className="section-header">Attacks</h3>
        <AttackSearch attacks={attacks} showAttack={actions.showAttack} toggleActive={actions.toggleActiveAttack} />
        <Divider />
        <div className='ui accordion segments'>
          {
            attacks.filter(attack => visibleAttacks[attack.id] || !!attack.favorite).map((attack, idx) => {
              if(activeAttack.id === attack.id && activeAttack.editing){
                return (
                  <AttackBuilder
                    active={activeAttack.id === attack.id}
                    attack={attack.pending}
                    delete={this._deleteAttack}
                    execute={this._executeAttack}
                    key={`attack_${idx}`}
                    logger={logger}
                    save={this._saveAttack}
                    toggleActive={actions.toggleActiveAttack}
                    toggleEdit={actions.toggleEditAttack}
                    update={actions.setPendingAttackEdits}
                  />
                )
              }
              return (
                 <Attack
                  active={activeAttack.id === attack.id}
                  activeAttack={activeAttack}
                  defaultAttack={attack}
                  favoriteAttack={this._favoriteAttack}
                  execute={this._executeAttack}
                  index={idx}
                  key={`attack_${idx}`}
                  toggleActive={actions.toggleActiveAttack}
                  toggleEdit={actions.toggleEditAttack}
                  updateInput={actions.updateActiveAttackInput}
                />)
            })
          }
          <AttackBuilder
            active={activeAttack.id === 'builder'}
            attack={exampleAttack.pending}
            delete={()=>{}}
            execute={this._executeAttack}
            key={`attack_builder`}
            logger={logger}
            save={this._saveAttack}
            toggleActive={actions.toggleActiveAttack}
            update={actions.setPendingAttackEdits}
          />
        </div>
      </div>
    )
  }
}

Attacks.propTypes = {
  attacks: PropTypes.array.isRequired,
  activeAttack: PropTypes.object.isRequired,
  visibleAttacks: PropTypes.object.isRequired,
  activeTargets: PropTypes.object.isRequired,
  followupBuffer: PropTypes.object.isRequired,
  logger: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
  victims: PropTypes.object,
  victimIdBySocketIdMap: PropTypes.object
}

function mapStateToProps(state, props) {
  return {
    attacks: state.attacks.attacks,
    visibleAttacks: state.attacks.visibleAttacks,
    activeAttack: state.attacks.activeAttack,
    activeTargets: state.victims.activeTargets,
    victims: state.victims.victims,
    exampleAttack: state.attacks.exampleAttack,
    followupBuffer: state.attacks.followupBuffer,
    logger: state.terminal.logger,
    victimIdBySocketIdMap: state.victims.victimIdBySocketIdMap
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(attackActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Attacks)
