import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const SFBWpageCrudReducer = crudReducers('SFBWpages');

const SFBWpages = (state = initialState.SFBWpages, action) => { // eslint-disable-line
  return SFBWpageCrudReducer(state, action);
};

export default SFBWpages;
