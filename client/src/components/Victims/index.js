import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as victimActions from '../../actions/victims';

class Victims extends Component {
  componentDidMount() {
    this._socket = this.props.socket

    this._socket.on('newUser', this.props.actions.addVictim)
    this._socket.on('userLeft', this.props.actions.removeVictim)

    this._socket.emit('getUsers')
  }

  render() {
    return (
      <table className='ui structured large table'>
        <thead>
          <tr>
            <th colSpan='5'>
              <h3>Victims</h3>
            </th>
          </tr>
          <tr>
            <th>ID</th>
            <th>IP</th>
            <th className='eight wide'>Agent</th>
            <th>Time Connected</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.victims.map((victim, idx) => (
              <tr
                key={idx}
                onClick={() => this.props.actions.targetVictim(victim)}
                className={this.props.activeTargets[victim.id] ? 'active' : ''}
              >
                <td>{victim.id}</td>
                <td>{victim.ip}</td>
                <td>{victim.agent}</td>
                <td>{new Date(victim.connectedAt).toLocaleString()}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }
}

Victims.propTypes = {
  victims: PropTypes.array,
  activeTargets: PropTypes.object,
  victimsBySocketIdMap: PropTypes.object
}

function mapStateToProps(state, props) {
  return {
    victims: state.victims.victims,
    activeTargets: state.victims.activeTargets,
    victimsBySocketIdMap: state.victims.victimsBySocketIdMap
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(victimActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Victims)