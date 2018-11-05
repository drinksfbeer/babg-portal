import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const settingsCrudReducer = crudReducers('settings');

const settings = (state = initialState.settings, action) => { // eslint-disable-line
  return settingsCrudReducer(state, action);
};

export default settings;
