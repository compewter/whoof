import victims from './victims.js';
import attacks from './attacks.js';
import terminal from './terminal.js';
import login from './login.js';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  victims,
  attacks,
  terminal,
  login
});

export default rootReducer;