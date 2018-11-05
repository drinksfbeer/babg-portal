import initialState from '../../initialState';

import crudReducers from '../default/crudReducer';

const eventCrudReducer = crudReducers('events');

const events = (state = initialState.events, action) => { // eslint-disable-line
  let localState;
  let foundIndex;

  switch (action.type) {
    case 'UPDATE_EVENT':
      localState = state;
      foundIndex = localState.list._list.findIndex(event => event.id === action.pkg._id);
      localState.list._list[foundIndex] = action.pkg;

      return { ...localState };

    default:
      return eventCrudReducer(state, action);
  }
};

export default events;
