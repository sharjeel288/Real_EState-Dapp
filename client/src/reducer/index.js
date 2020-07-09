import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import property from './property';

export default combineReducers({
  auth,
  alert,
  property,
});
