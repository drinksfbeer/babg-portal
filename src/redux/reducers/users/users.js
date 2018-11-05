/* eslint no-use-before-define: 0 */
/* eslint no-bitwise: 0 */

import initialState from '../../initialState';
import crudReducers from '../default/crudReducer';


const userCrudReducer = crudReducers('users');

const users = (state = initialState.users, action) => {
  // override crud stuff here
  if (action.type === 'AUTHORIZE_USER') return executeAuthorizeUser(state, action.pkg);
  if (action.type === 'USER_STATUS') return executePostUser(state, action.section, action.status, action.bool);
  if (action.type === 'INVITE_USER') return { ...state };
  if (action.type === 'USER_INVITED') return executeInviteUser(state, action);
  return userCrudReducer(state, action);
};

const executeInviteUser = (state, action) => {
  console.log('executeInviteUser state', state); // eslint-disable-line
  console.log('executeInviteUser action', action); // eslint-disable-line
  const newState = { ...state };
  state.list._list.push(action.pkg);

  return { ...newState };
};

const executePostUser = (state, section, status, bool) => {
  const newState = state;
  newState[section][status] = bool;
  return { ...state, newState };
};

const executeAuthorizeUser = (state, pkg) => {
  const newState = state;
  newState.auth.user = pkg;
  localStorage.setItem('pi', pkg.password);
  newState.auth.authorized = true;
  return { ...state, newState };
};

export default users;
