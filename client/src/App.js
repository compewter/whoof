import React, {Component} from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as loginActions from './actions/login'

import Victims from './components/Victims';
import Attacks from './components/Attacks';
import Terminal from './components/Terminal';
import Login from './components/Login';

class App extends Component {
  componentWillMount(){
    const {actions} = this.props
    this._socket = io(`http://${process.env.REACT_APP_ADMIN_APP_IP}:${process.env.REACT_APP_ADMIN_SOCKET_PORT}`)

    this._socket.on('authorized', function(sessID){
      document.cookie = `admin-sess=${sessID}`
      actions.setAuthorized(true)
    })

    this._socket.on('login-required', function(){
      actions.setAuthorized(false)
    })

    Notification.requestPermission()
      .then((permission)=>{
        if(permission === 'granted'){
          this._socket.on('notify', function(data){
            new Notification(data.title, data.options)
          })
        }
      })
  }

  render(){
    return (
      <div className='App'>
          {
            this.props.authorized ?
            <div className='ui container'>
              <Victims  socket={this._socket} />
              <Attacks  socket={this._socket} />
              <Terminal socket={this._socket} />
            </div>
          :
            <Login socket={this._socket} />
          }
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    authorized: state.login.authorized
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)