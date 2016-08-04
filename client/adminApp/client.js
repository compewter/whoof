import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import io from 'socket.io-client'

const socket = io();

const initialState = {
  users: [],
  attacks: [{
  	name: "test",
  	description: "sample attack module"
  }]
}

const store = require('./redux/store')(initialState);

render(
  <Provider store={store}>
    <App socket={socket}/>
  </Provider>,
  document.getElementById('app')
);