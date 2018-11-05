import initialState from '../../initialState';
import crudReducers from '../default/crudReducer';

const publicEventCrudReducer = crudReducers('publicEvents');

const publicEvents = (state = initialState.publicEvents, action) => {
  switch (action.type) {
    default: return publicEventCrudReducer(state, action);
  }
};

export default publicEvents;
