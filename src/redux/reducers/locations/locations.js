import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const locationCrudReducer = crudReducers('locations');

const locations = (state = initialState.locations, action) => { // eslint-disable-line
  return locationCrudReducer(state, action);
};

export default locations;
