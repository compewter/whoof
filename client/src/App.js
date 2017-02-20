import React, {Component} from 'react'
import io from 'socket.io-client'

import Victims from './components/Victims';
import Attacks from './components/Attacks';
import Terminal from './components/Terminal';

class App extends Component {
  componentWillMount(){
    this._socket = io()
  }

  render(){
    return (
      <div className='App'>
        <div className='ui container'>
          <Victims socket={this._socket}/>
          <Attacks socket={this._socket}/>
          <Terminal />
        </div>
      </div>
    )
  }
}

export default App