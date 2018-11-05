import initialState from '../../initialState';
import crudReducers from '../default/crudReducer';

const publicEventVersionCrudReducer = crudReducers('publicEventVersions');

const publicEventVersions = (state = initialState.publicEventVersions, action) => {
  switch (action.type) {
    default: return publicEventVersionCrudReducer(state, action);
  }
};

export default publicEventVersions;
