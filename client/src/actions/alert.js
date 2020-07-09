import { v4 } from 'uuid';

import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

export const setAlert = (msg, alertTypes) => dispatch => {
  const id = v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertTypes, id },
  });

  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, 7000);
};
