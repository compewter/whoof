import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as terminalActions from '../../actions/terminal'

class Terminal extends Component {
  componentDidMount() {
    $('#terminal').terminal(function(command, term) {
      if (command !== '') {
        var result = window.eval(command)
        if (result !== undefined) {
          term.echo(String(result))
        }
      }
    }, {
      greetings: 'Mooooooo',
      name: 'js_demo',
      height: 300,
      prompt: '[VeAL ~]$ '
    })
    this.props.actions.setLogger($.terminal.active().echo)
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
  actions: PropTypes.object
}

function mapStateToProps(state, props) {
  return {
    logger: state.terminal.logger
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(terminalActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)