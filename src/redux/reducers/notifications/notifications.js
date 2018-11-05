import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const notificationCrudReducer = crudReducers('notifications');
const notifications = (state = initialState.notifications, action) => { // eslint-disable-line
  return notificationCrudReducer(state, action);
};

export default notifications;
