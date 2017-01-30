import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './semantic-ui/semantic.min.css';
import {Provider} from 'react-redux';
import configureStore from './store';
import initialState from './initialState'

ReactDOM.render(
  <Provider store={configureStore(initialState)}>
    <App />
  </Provider>,
  document.getElementById('root')
);
