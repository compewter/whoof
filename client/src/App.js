import React, {Component} from 'react'
import io from 'socket.io-client'

import Victims from './components/Victims';
import Attacks from './components/Attacks';
import Terminal from './components/Terminal';

class App extends Component {
  componentWillMount(){
    this._socket = io()
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
        <div className='ui container'>
          <Victims  socket={this._socket} />
          <Attacks  socket={this._socket} />
          <Terminal socket={this._socket} />
        </div>
      </div>
    )
  }
}

export default App