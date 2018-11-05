import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const SFBWsponsorCrudReducer = crudReducers('SFBWsponsors');

const SFBWsponsors = (state = initialState.SFBWsponsors, action) => { // eslint-disable-line
  return SFBWsponsorCrudReducer(state, action);
};

export default SFBWsponsors;
